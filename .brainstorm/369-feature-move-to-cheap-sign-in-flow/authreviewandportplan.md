# Auth in `later` — review + port plan (Next.js + Prisma + Postgres)

## Part 1 — How auth works today

### 1.1 Model (`prisma/schema.prisma`)

```prisma
model User {
  id         String   @id @default(uuid())
  username   String   @unique
  password   String              // bcrypt hash
  isVerified Boolean  @default(false)
  createdAt  DateTime @default(now())
}
```

No sessions table, no refresh-token table, no roles. `isVerified` is a manual admin-approval gate — nothing in the codebase flips it, it is set in the DB by hand.

### 1.2 Token scheme — stateless dual JWT in cookies

|         | payload            | secret               | TTL | cookie          |
| ------- | ------------------ | -------------------- | --- | --------------- |
| access  | `{ id, username }` | `JWT_ACCESS_SECRET`  | 15m | `access_token`  |
| refresh | `{ id }`           | `JWT_REFRESH_SECRET` | 7d  | `refresh_token` |

Both cookies: `httpOnly, secure: true, sameSite: 'lax', path: '/'`. Nothing is persisted server-side — verification is pure signature + expiry.

### 1.3 Endpoints (`v1/auth`, global prefix `api`)

- `POST /api/v1/auth/register` — **public**. Unique-username check → `bcrypt.hash(password, PASSWORD_SALT_ROUNDS)` → create user (`isVerified = false`). Returns `{ id, username }`; no tokens issued.
- `POST /api/v1/auth/login` — **public**. Find user → reject if `!isVerified` → `bcrypt.compare` → sign both tokens → set both cookies.
- `POST /api/v1/auth/refresh` — **public**. Verify refresh cookie → load user → re-issue **both** tokens (full rotation).
- `POST /api/v1/auth/logout` — protected. Clears both cookies. _(Stateless: the old tokens stay valid until expiry.)_
- `GET /api/v1/auth/me` — protected. Re-reads the access cookie itself, loads the user from DB, returns `{ id, username, isVerified, createdAt }`.

### 1.4 Enforcement — deny-by-default global guard

`AuthModule` registers `AuthGuard` as `APP_GUARD`, so **every route in the app is protected unless it opts out** with `@Public()` (a `SetMetadata(IS_PUBLIC_KEY, true)` decorator read via `Reflector.getAllAndOverride`).

The guard reads `access_token` from cookies, verifies it, and attaches the payload to `request['user']`. Downstream controllers pull the caller with `const userId = req['user']?.id as string` and scope every query by it (see `messages.controller.ts`, which has a TODO to replace this with a `@CurrentUser()` param decorator).

### 1.5 Refresh is driven by the client

`apps/web/src/shared/api/api.ts` wraps RTK Query's `fetchBaseQuery` (`credentials: 'include'`):

1. Any response with `401`/`403` triggers `POST v1/auth/refresh`.
2. An `async-mutex` makes refresh **single-flight** — concurrent 401s wait on the mutex instead of firing N refreshes.
3. On success the original request is replayed; on failure the error propagates.

### 1.6 Frontend gate

`WithAuth` wraps the authenticated route subtree in `App.tsx`. It calls `useMeQuery()` and renders `null` while loading, `<Navigate to="/login" replace />` on missing data or error. `/login` and `*` sit outside it. `Login.page.tsx` drives both login and register from one Zod-validated form; there is no separate register page.

### 1.7 Cross-cutting

- `main.ts`: `cookieParser()`, `enableCors({ origin: FRONTEND_URL, credentials: true })`, global `ValidationPipe({ whitelist, forbidNonWhitelisted, transform })`.
- Request/response shapes are shared between API and web via the `@later/types` workspace package.

### 1.8 Flow

```
register → (admin flips is_verified) → login → cookies set
   → requests carry cookies → AuthGuard verifies access token
   → 401 → client refreshes (mutex) → replay → logout clears cookies
```

---

## Part 2 — Weak points to fix in the port

Ordered by how much they matter. All are cheap to address while writing new code.

1. **Logout / revocation is a no-op server-side, by design.** This is a stateless-JWT setup with no session store — a leaked refresh token stays valid until it expires. Accepted tradeoff for simplicity; do not add a session/denylist table.
2. **`sameSite: 'lax'` + cross-site frontend.** Lax cookies are not sent on cross-site XHR; this only works because the two apps share a site. In Next.js the API is same-origin, so lax becomes correct by construction — don't copy `secure: true` unconditionally though, it silently breaks `http://localhost`.
3. **Username enumeration.** Login returns `404 "User with this username does not exist"` vs `400 "Incorrect password"` vs `400 "User is not verified yet"`. → One generic `401 Invalid credentials`.
4. **No rate limiting on login/register.** Nothing throttles credential stuffing.
5. **`isVerified` is checked only at login.** Revoking verification doesn't invalidate live tokens until they expire. → Re-check on every request when the user is loaded from the DB (e.g. in `requireUser()` / `me`).
6. **Secret access is inconsistent**: signing reads `process.env.JWT_*` directly, verification goes through `ConfigService`. `+configService.get('PASSWORD_SALT_ROUNDS')` is `NaN` if unset. → Validate env once at boot with a Zod schema.
7. **No password policy.** Only `IsNotEmpty` server-side, `max(255)` client-side.
8. **`console.error` on every failed verification** — noisy, and logs token errors on a normal expiry path.

---

## Part 3 — Agent plan: implement this in a Next.js + Prisma + Postgres repo

> Assumptions: Next.js App Router, TypeScript, a single Next app (API routes co-located, so **same-origin cookies**), Postgres via Prisma. Adjust step 0 if the repo is a Pages Router or has a separate API service.

**Library choice that matters:** use **`jose`** for JWT (not `jsonwebtoken`) — it works in both the Node and Edge runtimes, so the same helper runs in middleware and in route handlers. Use **`bcryptjs`** (pure JS) or keep `bcrypt` and mark auth routes `export const runtime = 'nodejs'`.

### Step 0 — Recon

Confirm: App Router vs Pages, existing Prisma client singleton, existing `middleware.ts`, package manager, whether an auth lib (NextAuth/Clerk) is already wired. Report findings before writing code if any of these conflict.

### Step 1 — Schema

Add to `schema.prisma`:

```prisma
model User {
  id           String    @id @default(uuid())
  username     String    @unique
  passwordHash String    @map("password_hash")
  isVerified   Boolean   @default(false) @map("is_verified")
  createdAt    DateTime  @default(now()) @map("created_at") @db.Timestamptz(3)
  @@map("users")
}
```

No session/token table — auth stays fully stateless. Run `prisma migrate dev --name auth`.

### Step 2 — Env contract

`src/lib/env.ts` — Zod-validated, parsed once, exported typed:
`DATABASE_URL`, `JWT_ACCESS_SECRET` (≥32 chars), `JWT_REFRESH_SECRET` (≥32 chars), `PASSWORD_SALT_ROUNDS` (coerced int, default 12). Add all of them to `.env.example`.

### Step 3 — Auth primitives (`src/lib/auth/`)

- `tokens.ts` — `signAccessToken({ id, username })` (15m), `signRefreshToken({ id })` (7d), `verifyAccessToken`, `verifyRefreshToken`, all via `jose`, returning `null` on failure rather than throwing. No `jti`/session row — refresh is just a longer-lived JWT re-verified against the DB user.
- `cookies.ts` — `setAuthCookies(res, { accessToken, refreshToken })`, `clearAuthCookies(res)`. Options: `httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production'`, `maxAge` 15m / 7d. Use `next/headers` `cookies()`.
- `password.ts` — `hashPassword`, `verifyPassword`.

### Step 4 — Route handlers (`src/app/api/auth/*/route.ts`)

Mirror the Nest endpoints one-for-one: `register`, `login`, `refresh`, `logout`, `me`. Validate bodies with Zod (mirrors the `ValidationPipe` + DTOs). **Return a single generic `401 { error: 'Invalid credentials' }`** for unknown user / bad password / unverified — do not leak which. Register stays `isVerified: false` and issues no tokens. `logout` just clears cookies — stateless, so previously issued tokens remain valid until they expire. `me` loads the user from DB and re-checks `isVerified`.

### Step 5 — Enforcement (the `APP_GUARD` equivalent)

Two layers — Next has no global DI guard, so build the deny-by-default posture explicitly:

- `middleware.ts` — verify the access token with `jose`, redirect unauthenticated page requests to `/login`. Use a `matcher` that is an **allowlist of public paths** (`/login`, `/api/auth/login|register|refresh`, static assets) so everything else is protected by default. Middleware does **signature checks only** — no Prisma, no bcrypt on the Edge runtime.
- `src/lib/auth/require-user.ts` — `requireUser()` reads the cookie, verifies, loads the user, throws/returns 401. Every protected route handler and server component calls this. This is the real authorization boundary; middleware is UX. Scope every query by `user.id` the way the Nest controllers do.

### Step 6 — Client refresh (port of `baseQueryWithCookies`)

Wrap `fetch` in `src/lib/api-client.ts`: on `401`/`403`, `POST /api/auth/refresh` once — guarded by a **module-level promise** (single-flight; the `async-mutex` equivalent) — then replay the original request. On refresh failure, redirect to `/login`. If the repo uses RTK Query or TanStack Query, keep the interceptor at that layer instead.

### Step 7 — UI

`/login` page with a react-hook-form + Zod form (username, password) and Login / Register buttons, same as `Login.page.tsx`. Protected layout does `await requireUser()` server-side and redirects — the server-side equivalent of `WithAuth`.

### Step 8 — Hardening (do it now, not later)

- Rate-limit `login` and `register` by IP (`@upstash/ratelimit`, or an in-memory limiter for single-instance).
- Password policy: min 12 chars, max 128, in the Zod schema.
- A `pnpm db:verify-user <username>` script (or admin route) to flip `isVerified` — the current repo has no path for this at all.

### Step 9 — Tests

Unit: token sign/verify round-trip, expiry, wrong-secret rejection; password hash/verify. Integration: register → login rejected while unverified → verify → login sets cookies → protected route 200 → expired access + valid refresh → refresh reissues both tokens → logout clears cookies.

### Definition of done

`register → verify → login → protected fetch → 401 → auto-refresh → replay → logout` works end to end, fully stateless (no session store); no endpoint outside the public allowlist is reachable without a valid access token.

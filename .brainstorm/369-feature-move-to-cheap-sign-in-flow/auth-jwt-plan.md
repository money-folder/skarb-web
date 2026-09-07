# Auth port plan — username/password + stateless JWT (skarb-web)

Replaces `authreviewandportplan.md` for this repo. That file was written for a generic
Next.js target and assumed a NestJS-style REST API (`later`'s `v1/auth/*`) with a client
`fetch` interceptor. This repo doesn't work that way — **everything is a Server Action**
(`service.ts` + `actions.ts`, no client-side REST calls), and there is currently no route
middleware for auth. This plan is written against that reality.

Decisions (confirmed):

- `User.name` is dropped; `username` is the only identifying/display field.
- Auth endpoints (`register`/`login`/`refresh`/`logout`) are plain Server Actions, not
  `/api/auth/*` route handlers.
- No new redirect-to-auth behavior — keep today's behavior where pages always render
  and only the data fetch inside a Server Action fails (with `cause: ErrorCauses.UNAUTHORIZED`)
  when the caller isn't authenticated.

---

## 1. Schema (`prisma/schema.prisma`)

Delete entirely: `Account`, `Session`, `VerificationToken` models.

Change `User`:

```prisma
model User {
  id           String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  username     String        @unique @db.VarChar(255)
  passwordHash String        @map("password_hash")
  isVerified   Boolean       @default(false) @map("is_verified")
  createdAt    DateTime      @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt    DateTime      @updatedAt @map("updated_at") @db.Timestamp(6)
  deletedAt    DateTime?     @map("deleted_at") @db.Timestamp(6)
  earnings     Earning[]
  expenseGoals ExpenseGoal[]
  expenses     Expense[]
  wallets      Wallet[]

  @@map("users")
}
```

Removed fields: `name`, `email`, `emailVerified`, `image`, `accounts`, `sessions`.
No refresh-token/session table — refresh tokens are pure JWTs re-verified against the
DB user, same as `later`.

Run `pnpm db:migrate:local --name simplify_auth_to_jwt` (adjust to whatever the actual
script name is — repo uses `dotenv -e .env.local -- npx prisma migrate dev`).

`isVerified` stays `false` by default and is flipped by hand directly in the DB —
no admin route or CLI script needed.

## 2. Remove NextAuth / GitHub completely

Delete:

- [**mocks**/next-auth.ts](__mocks__/next-auth.ts)
- [**mocks**/@auth/prisma-adapter.ts](__mocks__/@auth/prisma-adapter.ts)
- [**mocks**/next-auth/providers/github.ts](__mocks__/next-auth/providers/github.ts)
- [src/shared/components/SignIn.tsx](src/shared/components/SignIn.tsx)
- [src/shared/components/SignOut.tsx](src/shared/components/SignOut.tsx)

Rewrite (not delete) [src/auth.ts](src/auth.ts) — see §4, it keeps exporting an `auth()`
function so the ~30 existing call sites in every `service.ts` don't need to change.

Update:

- [src/app/[locale]/components/AppSidebar/AppSidebarUserProfile.tsx](src/app/[locale]/components/AppSidebar/AppSidebarUserProfile.tsx) —
  swap the GitHub `SignIn`/`SignOut` buttons for a link to the new `/auth` page and a
  `logout()` server action form.
- `package.json` — remove `next-auth`, `@auth/prisma-adapter`.
- `tsconfig.json` — drop the `__mocks__/next-auth.js` include entry.
- [src/dictionaries/en.json](src/dictionaries/en.json) / [be.json](src/dictionaries/be.json) —
  remove `githubSigninLabel`, add labels for username/password/register/sign-in/invalid
  credentials.
- Any test that does `jest.mock("@/auth")` (e.g.
  [src/app/[locale]/wallets/**tests**/services.test.ts](src/app/[locale]/wallets/__tests__/services.test.ts))
  keeps working unchanged since Jest auto-mocks the whole module — just make sure the
  mocked shape (`{ user: { id, username, isVerified } } | null`) matches what tests set up.

## 3. Token & cookie design

Same shape as `later`, adjusted for username instead of `id + username` mismatch:

|         | payload            | secret               | TTL | cookie          |
| ------- | ------------------ | -------------------- | --- | --------------- |
| access  | `{ id, username }` | `JWT_ACCESS_SECRET`  | 15m | `access_token`  |
| refresh | `{ id }`           | `JWT_REFRESH_SECRET` | 7d  | `refresh_token` |

Cookies: `httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production'`.
Use `jose` (Edge + Node compatible) and `bcryptjs` (pure JS, no native build step).

Env additions (`.env.example` + `src/lib/env.ts` if a validated env module exists,
otherwise add one): `JWT_ACCESS_SECRET` (≥32 chars), `JWT_REFRESH_SECRET` (≥32 chars),
`PASSWORD_SALT_ROUNDS` (default 12).

## 4. Auth primitives

New `src/lib/auth/` folder:

- `tokens.ts` — `signAccessToken`, `signRefreshToken`, `verifyAccessToken`,
  `verifyRefreshToken` (return `null` on failure, never throw).
- `password.ts` — `hashPassword`, `verifyPassword`.
- `cookies.ts` — `setAuthCookies`, `clearAuthCookies` via `next/headers` `cookies()`.

Rewrite [src/auth.ts](src/auth.ts) to export:

```ts
export async function auth(): Promise<{
  user: { id: string; username: string; isVerified: boolean };
} | null>;
```

It reads `access_token` from cookies, verifies it with `jose`, loads the user from
Prisma, re-checks `isVerified` (so revoking verification kills access before the token
naturally expires), and returns the session-shaped object or `null`. This preserves the
`session?.user?.id` pattern used everywhere today — **no changes needed in any
`service.ts` file**.

## 5. Auth Server Actions

New `src/app/[locale]/auth/actions.ts` (colocated with the new page), all `"use server"`:

- `register(username, password)` — unique-username check, hash password,
  create user with `isVerified: false`. No tokens issued (mirrors `later`).
- `login(username, password)` — load user, reject with one generic error if
  unknown user / wrong password / `!isVerified` (don't leak which — fixes the
  enumeration issue called out in the old plan). Sign both tokens, set both cookies.
- `refresh()` — verify refresh cookie, reload user, re-issue **both** tokens
  (full rotation, same as `later`).
- `logout()` — clears both cookies. Stateless: previously issued tokens remain
  valid until they expire — this is an accepted tradeoff, not a bug.

All follow the existing `actions.ts` convention: try/catch, return
`{ success, data?, error? }`, never throw across the server/client boundary.

## 6. Client-based refresh & logout

Since there's no central `fetch` client to hook into, refresh has to be triggered by
whatever calls a Server Action and gets back `{ success: false, error }` with
`error.cause === ErrorCauses.UNAUTHORIZED`. Two options, pick one when implementing:

1. **Minimal**: only wire this up where it's actually needed (e.g. a client component
   that renders after a stale access token) — on unauthorized, call `refresh()`, retry
   once, then redirect to `/auth` on repeat failure.
2. **Shared helper**: a small `withAuthRetry(action, ...args)` wrapper used by client
   components that call actions directly, single-flighting concurrent refreshes with a
   module-level in-flight promise (the `async-mutex` equivalent from `later`).

Given the current codebase has no client-side handling of `error.cause` at all yet,
start with option 1 and only extract a shared helper if the duplication shows up in 3+
places.

## 7. Sign-in / register page

Single page, e.g. `src/app/[locale]/auth/page.tsx`: one `react-hook-form` + Zod form
(username, password) with two submit buttons — "Sign In" calls `login()`, "Register"
calls `register()`. On success, redirect to `/`. Password policy in the Zod schema
(min length, max 128) — mirrors `later`'s weak point #7 fix.

## 8. Enforcement — stays action-level, no middleware

`proxy.ts` keeps doing only locale rewriting — do **not** add an auth check there. Every
`service.ts` function keeps its existing shape:

```ts
const session = await auth();
if (!session?.user?.id) {
  throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
}
```

This is already how every mutation/query in the app is gated (`wallets/service.ts`,
`expenses/service.ts`, etc.) — it satisfies "auth check at the action level" without
introducing a second enforcement layer like the old plan's `middleware.ts`.

## 9. Tests

No new tests are being added for the JWT auth flow itself — just remove whatever
existing tests cover the old NextAuth/GitHub sign-in flow (if any exist once the
GitHub-based components/routes are deleted per §2). Existing `service.ts` tests that
`jest.mock("@/auth")` should need no changes beyond whatever mock session shape they
already construct.

## 10. Open items not covered by the original requirements

Carried over from `authreviewandportplan.md` §2 as optional hardening, not required to
ship the port: rate limiting on `login`/`register`, and validating env vars once at
boot with Zod. Do these only if/when asked — not part of this plan's definition of done.

### Definition of done

`register → (admin manually flips is_verified in DB) → sign in → cookies set → every
service.ts call authorizes via auth() → logout clears cookies` works end to end, fully
stateless, GitHub/NextAuth fully removed, `Account`/`Session`/`VerificationToken` tables
gone.

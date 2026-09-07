# Auth migration: GitHub/NextAuth → username + password + stateless JWT

_Repo: `money-folder/skarb-web` · Branch: `369-feature-move-to-cheap-sign-in-flow` · Written 2026-09-06_

This document supersedes `authreview.md`, `auth-jwt-plan.md` and `authreviewandportplan.md`.

### Decisions log

- **2026-09-06** — Existing users are not preserved as part of this work. The migration only does the
  minimum backfill needed to apply on a populated table; fixing (or deleting) old rows is a manual
  follow-up. (F1, step 2, step 13)
- **2026-09-06** — The export feature is fixed **in this migration**, not deferred: it must emit the
  new `users` shape and never the password hash. (F2, R8, step 9)
- **2026-09-06** — The three service test suites that `jest.mock("@/auth")` are **deleted**, not
  adapted. Remaining suites (utils, UI components) stay. (F3, R10, step 11)
- **2026-09-06** — Both functional-gap fixes are confirmed: `AuthRefresher` client component (F4)
  and React `cache()` around `auth()` (F5).

It has three parts:

1. **Findings** — where `auth-jwt-plan.md` disagrees with the repo, and problems the plan does not cover.
2. **Final requirements** — the plan with every open point resolved.
3. **Agent plan** — ordered implementation steps with file paths and verification commands.

---

## Part 1 — Findings (plan vs. repo)

Severity: 🔴 breaks build/tests/data · 🟠 functional gap · 🟡 inconsistency / cleanup.

### 🔴 F1. Existing `users` rows make the naive migration fail

`auth-jwt-plan.md` §1 adds `username` and `passwordHash` as **NOT NULL** and drops `name`, `email`,
`image`, `emailVerified`. `prisma migrate dev` generates `ADD COLUMN ... NOT NULL` with no default,
which Postgres rejects on any table that already has rows. Local and prod DBs both have GitHub-created
users that own wallets/expenses/earnings (all FK `ON DELETE CASCADE` to `users`).

**Resolution (decided: existing users are not a goal):** create the migration with `--create-only`
and hand-edit the SQL so it _applies_ on a populated table — add the columns nullable, backfill
`username := email` and `password_hash := '!'`, then add the NOT NULL constraints and unique index.
`is_verified` stays `false` for old rows. The sentinel `'!'` can never match: `bcryptjs.compare`
returns `false` for any hash that is not 60 chars, and `verifyPassword` wraps `compare` in try/catch.
Whatever happens to those rows afterwards (set a real password, rename, or delete) is a manual
follow-up outside this plan. If wiping is preferred, prepend `DELETE FROM "users";` to the migration
(cascades to wallets/expenses/earnings/goals) and the backfill lines become no-ops.

### 🔴 F2. The exporting feature reads the fields being removed

`src/app/[locale]/exporting/utils-be.ts:50-63` builds an `INSERT INTO users (name, email,
email_verified, ...)` from `appData.name / .email / .emailVerified`. `AppData` is inferred from the
Prisma return type, so `tsc` and `next build` break the moment the schema changes. The plan never
mentions exporting.

Additionally, `exporting/repository.ts` uses `findUnique({ include })` with no `select`, so after the
change the **JSON export would contain `passwordHash`**. Must exclude it.

**Resolution (decided: fix now, in scope):** step 9 updates both the repository query and the SQL
dump so exports carry the full new user shape (`id, username, is_verified, created_at, updated_at,
deleted_at`) and never the hash. This cannot be done ahead of the schema change because `AppData` is
inferred from the Prisma client, so it is sequenced right after the schema steps.

### 🔴 F3. `jose` v6 is ESM-only; `jest.mock("@/auth")` will crash the three service test suites

`jose@6.x` `exports` map has only `"default": "./dist/webapi/index.js"` — no CommonJS build.
`jest.mock("@/auth")` **without a factory** auto-mocks by first `require`-ing the real module to read
its exports. The rewritten `src/auth.ts` imports `jose`, and `jest.config.ts` uses `babel-jest` with
the default `transformIgnorePatterns` (node_modules untouched) → `SyntaxError: Cannot use import
statement outside a module`. That is exactly why `__mocks__/next-auth.ts` exists today.

The plan (§2, §9) says the tests "keep working unchanged". They will not.

**Resolution (decided: delete, don't adapt):** delete the three service test suites and the three
root `__mocks__` files. No service tests remain; the utils and UI component suites are untouched.
(If service tests are reintroduced later, use a factory mock
`jest.mock("@/auth", () => ({ auth: jest.fn() }))` so the real module is never loaded, or add
`transformIgnorePatterns: ["/node_modules/(?!jose)/"]`.)

Files: `src/app/[locale]/wallets/__tests__/services.test.ts:5`,
`src/app/[locale]/wallets/[id]/__tests__/service.test.ts:8`,
`src/app/[locale]/currencies/[currency]/history/__tests__/service.test.ts:9`.

### 🟠 F4. The refresh token is dead weight unless something calls `refresh()`

Every page is server-rendered; there is **no client code** that inspects `error.cause` today, and the
plan's §6 defers the choice. With access TTL 15 min, the concrete outcome is: after 15 minutes of
inactivity the next navigation renders the sidebar as signed-out and every service throws
`UNAUTHORIZED`, even though a valid 7-day refresh cookie is sitting in the browser. `auth()` runs in
Server Components (sidebar) where **setting cookies is forbidden in Next 16**, so `auth()` itself
cannot rotate tokens.

**Resolution (confirmed; plan §6 "option 1", one place only):** a tiny client component `AuthRefresher`
rendered by `AppSidebarUserProfile` **only in the signed-out branch and only when a `refresh_token`
cookie is present** (server passes a boolean). On mount it calls the `refresh()` server action once;
on success it calls `router.refresh()`, on failure it does nothing (user sees "Sign In"). Module-level
in-flight promise guards against React StrictMode double-mount. No shared `withAuthRetry` helper.

### 🟠 F5. `auth()` becomes a DB query per call — 35 call sites, several per request

Plan §4 loads the user from Prisma on every `auth()` to re-check `isVerified`. That is the same cost
profile as today's database sessions (the thing being called "expensive"). One layout render already
calls it 3× (sidebar wallets, sidebar currencies, profile).

**Resolution (confirmed):** wrap the implementation in React `cache()` so it is memoised per
request. Zero API change.

### 🟠 F6. Sidebar profile depends on `user.name` and `user.image`

`AppSidebarUserProfile.tsx:42-60` renders `user.image` via `next/image` (GitHub avatar, whitelisted in
`next.config.mjs` `images.remotePatterns`) and `user.name`. Plan §2 only mentions swapping buttons.

**Resolution:** render `username` + initial-letter avatar only; delete the `next/image` usage and the
`avatars.githubusercontent.com` remote pattern.

### 🟡 F7. Dictionary labels: the ones the plan removes are already unused, and the sidebar has no locale

`sidebar.githubSigninLabel` / `sidebar.signoutLabel` are referenced **nowhere** in `src/` —
`AppSidebarUserProfile` hard-codes `"Sign In"` and `"Logout"`. `AppSidebarFooter` renders the profile
without a `locale` prop, so it cannot translate anything today.

**Resolution:** thread `locale` from `AppSidebar` → `AppSidebarFooter` → `AppSidebarUserProfile`;
replace `githubSigninLabel` with `signinLabel`; add an `authPage` dictionary section (en + be).

### 🟡 F8. Package manager and env files

- Plan §1 says `pnpm db:migrate:local`. Repo uses **npm** (`package-lock.json`, README). Correct
  command: `npm run db:migrate:local`.
- That script runs `dotenv -e .env.local`, but **`.env.local` does not exist** — only `.env` and
  `.env.prod`. dotenv-cli skips the missing file and Prisma falls back to `.env`, so it works by
  accident. Not changed by this migration; noted so nobody "fixes" it mid-task.
- There is **no `.env.example`** and **no `src/lib/env.ts`** (`src/lib/` holds only `utils.ts`).
  Both are created (step 3). `.env`, `.env.prod` are gitignored and hold real secrets — the agent edits
  keys only, never prints values.
- Vercel project env vars (outside the repo) must get `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` and
  lose `AUTH_*` before the prod deploy. Manual step, listed in step 13.

### 🟡 F9. `PASSWORD_SALT_ROUNDS` without validation is `NaN`

`Number(undefined)` → `NaN` → bcrypt cost NaN. Resolution: `src/lib/env.ts` parses with a fallback of
`12`, and JWT secrets are asserted `≥ 32` chars at first use (throws a readable error). No Zod boot
validation (plan §10 keeps that optional).

### 🟡 F10. Server Action conventions vs. `redirect()`

`redirect()` throws `NEXT_REDIRECT`; the repo's actions wrap everything in try/catch and return
`{ success, data, error }`. `login()` / `register()` / `refresh()` therefore **return** a result and the
client form does `router.push` / `router.refresh()`. `logout()` is used as a `<form action>` from a
Server Component, so it may call `redirect()` — but outside any try/catch.

### 🟡 F11. Misc cleanup the plan misses

- `tsconfig.json` `include` lists `__mocks__/next-auth.js`; the file is actually `.ts`. Remove the entry.
- The NextAuth route lives at `src/app/[locale]/api/auth/[...nextauth]/route.ts` and is the only file
  under `src/app/[locale]/api/` — delete the whole `api` directory.
- `.env` has a commented `NEXTAUTH_URL` line — remove.
- `bcryptjs@3` bundles its own types; do **not** add `@types/bcryptjs`.
- `authreviewandportplan.md` is already superseded; all three planning docs can be deleted once this
  one lands (user's call — not done by the agent).

### Things the plan gets right (verified, no change)

- 35 `await auth()` guards across 7 `service.ts` files + sidebar; all read only `session.user.id`.
  Keeping `auth()`'s return shape `{ user: { id, ... } } | null` means **zero service edits**.
- `src/proxy.ts` does only locale rewriting; no auth middleware exists or is added.
- No tests cover `SignIn`/`SignOut`/`AppSidebarUserProfile`; nothing to delete there.
- `react-hook-form` + `zodResolver` + `Input`/`Label`/`Button` from `src/components/ui` are the
  established form pattern (`WalletForm.tsx`, `ExpenseForm.tsx`) — the auth form follows it.
- Next 16: `cookies()` is async; only Server Actions / Route Handlers may set cookies. The design
  respects both.

---

## Part 2 — Final requirements

### R1. Data model

`prisma/schema.prisma` — delete `Account`, `Session`, `VerificationToken`. `User` becomes:

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

Migration `simplify_auth_to_jwt` is hand-edited (F1) only so it applies on a populated table:
old rows end up with `username = <old email>`, an unusable password and `is_verified = false`.
Fixing or deleting them is a manual follow-up, not part of this work.

### R2. Dependencies

Add `jose` (JWT, HS256) and `bcryptjs` v3 (pure JS). Remove `next-auth`, `@auth/prisma-adapter`.

### R3. Tokens & cookies

|         | payload            | secret               | TTL | cookie          |
| ------- | ------------------ | -------------------- | --- | --------------- |
| access  | `{ id, username }` | `JWT_ACCESS_SECRET`  | 15m | `access_token`  |
| refresh | `{ id }`           | `JWT_REFRESH_SECRET` | 7d  | `refresh_token` |

Cookie options: `httpOnly: true, sameSite: "lax", path: "/", secure: NODE_ENV === "production"`,
`maxAge` = token TTL. Fully stateless — no session/denylist table. Logout only clears cookies;
previously issued tokens stay valid until expiry (accepted).

Env: `JWT_ACCESS_SECRET` (≥32 chars), `JWT_REFRESH_SECRET` (≥32 chars, different value),
`PASSWORD_SALT_ROUNDS` (optional, default 12). Read through `src/lib/env.ts` with lazy assertion.

### R4. `auth()` contract (unchanged for callers)

```ts
export type Session = {
  user: { id: string; username: string; isVerified: boolean };
};
export const auth: () => Promise<Session | null>;
```

Reads `access_token`, verifies signature + expiry with `jose`, loads the user by id from Prisma,
returns `null` if missing, `deletedAt` set, or `!isVerified`. Memoised per request with React
`cache()`. Never sets cookies. Never throws.

### R5. Auth Server Actions — `src/app/[locale]/auth/actions.ts`

All return `{ success: boolean; data?; error? }` and never throw across the boundary (F10).

- `register({ username, password })` — Zod-validate; unique check; `hashPassword`; create with
  `isVerified: false`. Issues **no** tokens. Error cases: validation, `USERNAME_TAKEN`.
- `login({ username, password })` — Zod-validate; load user; if not found **or** wrong password
  **or** `!isVerified` **or** `deletedAt` → one generic `INVALID_CREDENTIALS`. On success sign both
  tokens and set both cookies. Always run `verifyPassword` (against the sentinel when the user is
  unknown) so timing does not leak existence.
- `refresh()` — verify `refresh_token`; reload user (same checks as R4); re-issue **both** tokens
  (rotation). On failure clear both cookies and return `{ success: false }`.
- `logout()` — form-action style: clear both cookies, `redirect("/")`.

Validation (`src/app/[locale]/auth/validation.ts`):
`username`: trimmed, 3–32 chars, `/^[a-zA-Z0-9._-]+$/`; `password`: 12–128 chars. Same schema for
login and register.

### R6. UI

- `src/app/[locale]/auth/page.tsx` (server): if `auth()` already returns a user → `redirect("/")`.
  Otherwise render `AuthForm` (client) with dictionary labels.
- `AuthForm` (client): one `react-hook-form` + `zodResolver` form, fields username + password, two
  buttons — **Sign In** → `login()`, **Register** → `register()`. On login success `router.push("/")`
  - `router.refresh()`. On register success show "registered — awaiting verification" and stay on
    the page. Errors shown inline via dictionary strings; server error codes map to labels.
- `AppSidebarUserProfile`: signed-out → link to `/${locale}/auth` (+ `AuthRefresher`, F4);
  signed-in → initial-letter avatar + `username` + dropdown with a `<form action={logout}>` button.
- Delete `src/shared/components/SignIn.tsx`, `SignOut.tsx`, `src/app/[locale]/api/`.

### R7. Enforcement

Unchanged: every `service.ts` keeps its `await auth()` guard throwing
`Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED })`. `src/proxy.ts` untouched. Pages
always render; unauthenticated data fetches fail inside actions exactly as today.

### R8. Exporting

Done in this migration. `utils-be.ts` SQL dump emits `INSERT INTO users (id, username, is_verified,
created_at, updated_at, deleted_at)`; `password_hash` is **never** exported. `repository.getUserAppData`
uses an explicit `select` so the JSON export carries the same six user fields plus the nested
wallets/history/expenses and excludes the hash.

### R9. i18n

`en.json` / `be.json`: `sidebar.githubSigninLabel` → `sidebar.signinLabel`; keep `signoutLabel`;
add `authPage` section (title, usernameLabel, passwordLabel, signinButton, registerButton,
invalidCredentials, usernameTaken, registered, validation messages).

### R10. Tests

The three service test suites (`wallets`, `wallets/[id]`, `currencies/[currency]/history`) and the
root `__mocks__/` directory are deleted (F3). Remaining suites (`src/shared/utils/__tests__`,
`src/shared/components/buttons/__tests__`, `src/components/ui/__tests__`) stay and must pass. No new
tests for the auth flow itself (per plan §9). `npm test`, `npx tsc --noEmit`, `npm run lint`,
`npm run build` all pass at the end.

### R11. Out of scope (unchanged from plan §10)

Rate limiting, Zod boot-time env validation, admin UI for `is_verified`, a `verify-user` script,
redirect-to-login middleware, per-request session lists.

### Definition of done

register → admin flips `is_verified` in DB → sign in → both cookies set → every `service.ts` call
authorizes via `auth()` → after access expiry `AuthRefresher` rotates tokens transparently → logout
clears cookies. NextAuth/GitHub fully removed; `accounts`/`sessions`/`verificationtokens` gone;
export emits the new user shape without the hash; migration applies on the existing DB; all checks
green.

---

## Part 3 — Agent plan

Conventions for the agent: npm only; never print `.env*` values; run prettier via
`npm run format:write` before finishing; keep the repo's `actions.ts` try/catch result pattern.
Work through the steps in order — each step ends with a verification that must pass before moving on.

### Step 0 — Baseline

```bash
npm ci && npx tsc --noEmit && npm run lint && npm test
```

Measured 2026-09-06 on `369-feature-move-to-cheap-sign-in-flow`:

| Check                   | Result                                                            |
| ----------------------- | ----------------------------------------------------------------- |
| `npm run lint`          | pass                                                              |
| `npm test`              | pass — 11 suites, 120 tests                                       |
| `prisma migrate status` | local Postgres reachable (`localhost:5432`), 8 migrations applied |
| `npx tsc --noEmit`      | **2 pre-existing errors**, unrelated to auth (below)              |

Fix the two `tsc` errors first so the gate is meaningful for the rest of the plan:

1. `src/app/[locale]/currencies/[currency]/expenses/components/expenses-goals/destroy-goal/DestroyButton.tsx`
   is an orphaned copy (nothing imports it; the live one is under
   `expense-goals/components/destroy-goal/`). It imports `destroyExpenseGoal` from the wrong
   `actions.ts`. **Delete the whole `expenses/components/expenses-goals/` directory.**
2. `src/shared/utils/__tests__/time-utils.test.ts:173` passes `"unknown"` where `Locale` is expected.
   Change to `"unknown" as unknown as Locale` (the test intentionally exercises the fallback).

Verify: `npx tsc --noEmit` exits 0 before starting step 1.

### Step 1 — Dependencies

```bash
npm i jose bcryptjs && npm uninstall next-auth @auth/prisma-adapter
```

Verify: `package.json` no longer lists `next-auth` / `@auth/prisma-adapter`; no `@types/bcryptjs` added.

### Step 2 — Schema + hand-edited migration

1. Edit `prisma/schema.prisma` per R1.
2. `npm run db:migrate:local -- --create-only --name simplify_auth_to_jwt`
3. Replace the generated `migration.sql` with:

```sql
-- Drop NextAuth tables
DROP TABLE "accounts";
DROP TABLE "sessions";
DROP TABLE "verificationtokens";

-- users: add new columns nullable, backfill, then constrain
ALTER TABLE "users" ADD COLUMN "username" VARCHAR(255);
ALTER TABLE "users" ADD COLUMN "password_hash" TEXT;
ALTER TABLE "users" ADD COLUMN "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- minimum backfill so NOT NULL can be applied; old rows are fixed/deleted manually later
UPDATE "users"
SET "username" = "email",
    "password_hash" = '!';

ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;

DROP INDEX "users_email_key";
ALTER TABLE "users"
  DROP COLUMN "name",
  DROP COLUMN "email",
  DROP COLUMN "email_verified",
  DROP COLUMN "image";

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
```

4. `npm run db:migrate:local` (applies it) then `npx prisma generate`.

Verify: `npx prisma migrate status` shows no pending; `npx prisma validate` OK; the generated client
has `username`, `passwordHash`, `isVerified` and no `Account`/`Session` models.

### Step 3 — Env contract

- `.env` and `.env.prod`: remove `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, the
  `NEXTAUTH_URL` comment; add `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (generate with
  `openssl rand -base64 48`, different per file and per key), optional `PASSWORD_SALT_ROUNDS=12`.
- Create **committed** `.env.example` with `POSTGRES_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`,
  `PASSWORD_SALT_ROUNDS` and placeholder values.
- Create `src/lib/env.ts`:

```ts
const required = (name: string, minLength = 0) => {
  const value = process.env[name];
  if (!value || value.length < minLength) {
    throw new Error(
      `Missing or too short env var ${name} (min ${minLength} chars)`,
    );
  }
  return value;
};

export const env = {
  get jwtAccessSecret() {
    return required("JWT_ACCESS_SECRET", 32);
  },
  get jwtRefreshSecret() {
    return required("JWT_REFRESH_SECRET", 32);
  },
  get passwordSaltRounds() {
    const n = Number(process.env.PASSWORD_SALT_ROUNDS);
    return Number.isInteger(n) && n >= 4 && n <= 31 ? n : 12;
  },
};
```

Getters keep the assertion lazy so `next build` and Jest do not need the secrets.

### Step 4 — Auth primitives `src/lib/auth/`

- `types.ts` — `AccessTokenPayload { id; username }`, `RefreshTokenPayload { id }`, `Session` (R4),
  constants `ACCESS_TOKEN_COOKIE = "access_token"`, `REFRESH_TOKEN_COOKIE = "refresh_token"`,
  `ACCESS_TOKEN_TTL_SEC = 15 * 60`, `REFRESH_TOKEN_TTL_SEC = 7 * 24 * 60 * 60`.
- `tokens.ts` — `signAccessToken`, `signRefreshToken` (`new SignJWT(payload).setProtectedHeader({ alg:
"HS256" }).setIssuedAt().setExpirationTime(...)`), `verifyAccessToken`, `verifyRefreshToken`
  (`jwtVerify` with `TextEncoder().encode(secret)`, return typed payload or `null`, never throw,
  no `console.error` on the normal-expiry path).
- `password.ts` — `hashPassword(plain)` → `bcrypt.hash(plain, env.passwordSaltRounds)`;
  `verifyPassword(plain, hash)` → `try { return await bcrypt.compare(plain, hash) } catch { return false }`.
- `cookies.ts` — `setAuthCookies({ accessToken, refreshToken })`, `clearAuthCookies()` using
  `await cookies()` from `next/headers`; options per R3. Only ever called from Server Actions.

Verify: `npx tsc --noEmit`.

### Step 5 — Rewrite `src/auth.ts`

```ts
import { cache } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/prisma";
import { ACCESS_TOKEN_COOKIE, type Session } from "@/lib/auth/types";
import { verifyAccessToken } from "@/lib/auth/tokens";

export type { Session };

export const auth = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, username: true, isVerified: true, deletedAt: true },
  });
  if (!user || user.deletedAt || !user.isVerified) return null;
  return {
    user: { id: user.id, username: user.username, isVerified: user.isVerified },
  };
});
```

Verify: `npx tsc --noEmit` — all 35 service call sites compile untouched.

### Step 6 — Auth actions, validation, types

- `src/app/[locale]/auth/validation.ts` — `authFormSchema` per R5 (shared by client + server).
- `src/app/[locale]/auth/types.ts` — `AuthFormValues = z.infer<...>`, `AuthErrorCode =
"INVALID_CREDENTIALS" | "USERNAME_TAKEN" | "VALIDATION" | "UNKNOWN"`, `AuthActionResult`.
- `src/app/[locale]/auth/actions.ts` (`"use server"`) — `register`, `login`, `refresh`, `logout`
  per R5. `login` fetches the user with `select: { id, username, passwordHash, isVerified, deletedAt }`,
  runs `verifyPassword` against `user?.passwordHash ?? "!"` unconditionally, and collapses every
  failure into `INVALID_CREDENTIALS`. `refresh` uses the R4 checks and rotates both tokens.
  `logout` clears cookies then `redirect("/")` **outside** any try/catch.

Verify: `npx tsc --noEmit`; `npm run lint`.

### Step 7 — Auth page + form + refresher

- `src/app/[locale]/auth/page.tsx` — server component; `params.locale`; `redirect("/")` if
  `auth()` returns a user; loads `getDictionary(locale, "authPage")`; renders `<AuthForm />`.
- `src/app/[locale]/auth/components/AuthForm.tsx` — `"use client"`; follows `WalletForm.tsx`
  (`Input`, `Label`, `Button`, `useForm({ resolver: zodResolver(authFormSchema) })`); two submit
  paths via `handleSubmit` with a `mode` ref ("login" | "register"); `useRouter` for push/refresh;
  inline error/success text; `type="password"` + `autoComplete="current-password"`.
- `src/app/[locale]/auth/components/AuthRefresher.tsx` — `"use client"`; no UI; on mount calls
  `refresh()` once (module-level in-flight promise, F4); on `success` → `router.refresh()`.

Verify: `npm run dev`, open `/auth` — form renders in `en` and `/be/auth`.

### Step 8 — Sidebar, deletions, config

- `AppSidebar.tsx` → `<AppSidebarFooter locale={locale} />`; `AppSidebarFooter.tsx` forwards it;
  `AppSidebarUserProfile.tsx` takes `locale`, loads `getDictionary(locale, "sidebar")`, and:
  - signed-out: `SidebarMenuButton asChild` → `<Link href={`/${locale}/auth`}>` with `LogIn` icon +
    `signinLabel`; plus `<AuthRefresher />` when `(await cookies()).has("refresh_token")`.
  - signed-in: initial-letter avatar (`username.charAt(0).toUpperCase()`), `username`, dropdown item
    `<form action={logout}><button>…signoutLabel</button></form>`.
  - Remove `next/image` import and `user.image` branch.
- Delete `src/shared/components/SignIn.tsx`, `src/shared/components/SignOut.tsx`,
  `src/app/[locale]/api/` (entire directory).
- `next.config.mjs` — remove the `avatars.githubusercontent.com` `remotePatterns` entry (leave
  `images: {}` or drop the key).

Verify: `grep -rn "next-auth\|@auth/\|signIn(\|signOut(\|githubusercontent" src next.config.mjs`
returns nothing; `npx tsc --noEmit`.

### Step 9 — Exporting fix (R8, in scope)

- `exporting/repository.ts` — replace `include` with a `select` that lists
  `id, username, isVerified, createdAt, updatedAt, deletedAt` and keeps the nested `wallets`
  (with `history`) and `expenses` selections exactly as today. `passwordHash` is deliberately absent
  (Prisma 5.22 has no top-level `omit` without the preview flag, so `select` is the tool).
- `exporting/utils-be.ts:50-63` — the `INSERT INTO users (...)` block emits
  `id, username, is_verified, created_at, updated_at, deleted_at` with the matching
  `formatValueForSQL(appData.*)` values. Remove the `name`/`email`/`email_verified` lines. Adjust any
  `AppData` consumer that the narrowed type breaks.

Verify: `npx tsc --noEmit`; in dev, run Export-All for both JSON and SQL and confirm no
`passwordHash` / `password_hash` in the output (`grep -c password`).

### Step 10 — Dictionaries

`en.json` and `be.json`: rename `sidebar.githubSigninLabel` → `signinLabel` ("Sign In" / "Увайсці");
add:

```json
"authPage": {
  "title": "Sign in or create an account",
  "usernameLabel": "Username",
  "passwordLabel": "Password",
  "signinButton": "Sign In",
  "registerButton": "Register",
  "invalidCredentials": "Invalid username or password",
  "usernameTaken": "This username is already taken",
  "registered": "Account created. You can sign in once an administrator verifies it.",
  "usernameInvalid": "3–32 characters: letters, digits, dot, underscore, dash",
  "passwordInvalid": "12–128 characters",
  "unknownError": "Something went wrong, please try again"
}
```

Belarusian: "Увайдзіце або стварыце акаўнт", "Імя карыстальніка", "Пароль", "Увайсці",
"Зарэгістравацца", "Няправільнае імя карыстальніка або пароль", "Гэтае імя ўжо занята",
"Акаўнт створаны. Вы зможаце ўвайсці пасля пацверджання адміністратарам.",
"3–32 сімвалы: літары, лічбы, кропка, падкрэсліванне, дэфіс", "12–128 сімвалаў",
"Нешта пайшло не так, паспрабуйце яшчэ раз".

Verify: `npx tsc --noEmit` (the `Dictionary` union type must stay structurally compatible — add the
same keys to both files).

### Step 11 — Tests and mocks (decided: delete the affected suites)

- Delete `src/app/[locale]/wallets/__tests__/services.test.ts`,
  `src/app/[locale]/wallets/[id]/__tests__/service.test.ts`,
  `src/app/[locale]/currencies/[currency]/history/__tests__/service.test.ts` (and the emptied
  `__tests__` directories).
- Delete `__mocks__/next-auth.ts`, `__mocks__/next-auth/providers/github.ts`,
  `__mocks__/@auth/prisma-adapter.ts` and the now-empty `__mocks__/` directory.
- `tsconfig.json` — remove `"__mocks__/next-auth.js"` from `include`.

Verify: `npm test` — remaining suites green, no "Cannot use import statement" errors.

### Step 12 — Final verification

```bash
npm run format:write && npm run lint && npx tsc --noEmit && npm test && npm run build
```

Manual end-to-end in `npm run dev` (fresh browser profile):

1. `/auth` → Register `alice` / 12+ char password → "awaiting verification" message; no cookies set.
2. Sign In as `alice` → generic "Invalid username or password" (unverified).
3. `UPDATE users SET is_verified = true WHERE username = 'alice';`
4. Sign In → redirected to `/`; DevTools shows `access_token` (15m) and `refresh_token` (7d),
   both HttpOnly; sidebar shows `alice`; wallets page loads data.
5. Delete only the `access_token` cookie, reload → sidebar briefly signed-out, `AuthRefresher`
   rotates, page refreshes signed-in with two fresh cookies.
6. Delete both cookies, reload → sidebar shows Sign In; wallets page shows the existing
   "loading failed" text (unchanged behaviour).
7. Logout → both cookies gone, redirected to `/`.
8. Export-All (JSON + SQL) contains no password hash.

### Step 13 — Deployment / operations (manual, outside the agent's edits)

1. Vercel → Project → Environment Variables: add `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
   (distinct 48-byte random values), remove `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`.
2. `npm run db:migrate:prod` (applies `simplify_auth_to_jwt`; drops the three NextAuth tables).
3. Deploy. Existing sessions are gone (table dropped).
4. Pre-existing users (now `username = <email>`, unusable password, unverified) are a manual
   follow-up outside this plan. For reference, a hash can be produced with
   `node -e "require('bcryptjs').hash(process.argv[1], 12).then(console.log)" 'pw'` and applied with
   `UPDATE users SET username = ..., password_hash = ..., is_verified = true WHERE ...;`, or the rows
   simply deleted.
5. Optional cleanup afterwards: delete `authreview.md`, `auth-jwt-plan.md`,
   `authreviewandportplan.md`, and revoke the GitHub OAuth app.

# Auth Review — skarb-web

_Branch: `369-feature-move-to-cheap-sign-in-flow` · Reviewed 2026-09-06_

## 1. Stack

| Piece    | What it is                                                                             |
| -------- | -------------------------------------------------------------------------------------- |
| Library  | `next-auth@5.0.0-beta.30` (Auth.js v5)                                                 |
| Adapter  | `@auth/prisma-adapter@2.10.0` → **database sessions** (not JWT)                        |
| Provider | **GitHub OAuth only**                                                                  |
| Config   | `src/auth.ts` — 10 lines, all defaults, no callbacks, no custom pages                  |
| Route    | `src/app/[locale]/api/auth/[...nextauth]/route.ts` — re-exports `handlers` as GET/POST |
| Env      | `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` (`.env`)                         |

Because `PrismaAdapter` is passed, the session strategy defaults to `"database"`: a row in
`sessions` keyed by an opaque `sessionToken` cookie. Every `auth()` call is a **DB round-trip**
(session + user join).

```ts
// src/auth.ts — the entire config
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
});
```

## 2. Flow

```
SignIn button (server action) → signIn("github")
  → /api/auth/signin/github → GitHub OAuth → /api/auth/callback/github
  → adapter: upsert users + accounts rows, insert sessions row
  → sets session cookie → redirect back
```

Sign-out is the mirror: `signOut()` server action deletes the `sessions` row and clears the cookie.

Both `SignIn.tsx` and `SignOut.tsx` are server components wrapping a `<form action={async () => { "use server"; ... }}>`.

## 3. Where auth is enforced

**There is no middleware and no route protection.** No `middleware.ts` exists anywhere in the repo.
Authorization happens exclusively inside service functions, repeated inline **35 times**:

```ts
const session = await auth();
if (!session?.user?.id) {
  throw new Error("Unauthorized!", { cause: ErrorCauses.UNAUTHORIZED });
}
// ... then scope the query by session.user.id
```

Call-site distribution:

| File                                                               | `auth()` calls |
| ------------------------------------------------------------------ | -------------- |
| `src/app/[locale]/currencies/[currency]/expenses/service.ts`       | 7              |
| `src/app/[locale]/wallets/service.ts`                              | 7              |
| `src/app/[locale]/currencies/[currency]/earnings/service.ts`       | 6              |
| `src/app/[locale]/wallets/[id]/service.ts`                         | 6              |
| `src/app/[locale]/currencies/[currency]/history/service.ts`        | 4              |
| `src/app/[locale]/currencies/[currency]/expense-goals/service.ts`  | 3              |
| `src/app/[locale]/exporting/service.ts`                            | 1              |
| `src/app/[locale]/components/AppSidebar/AppSidebarUserProfile.tsx` | 1 (UI only)    |

`session.user.id` is the **only** tenancy key — every repository query filters by
`ownerId` / `userId` derived from it. This is the contract any new strategy must preserve.

## 4. Data model (`prisma/schema.prisma`)

Auth.js-owned tables:

- **`users`** — `id` (uuid), `name`, `email` (unique), `email_verified`, `image`. Also the FK
  target for `wallets`, `expenses`, `earnings`, `expense_goals`. **Keep this table.**
- **`accounts`** — OAuth tokens per provider. Only needed for OAuth.
- **`sessions`** — DB session store. Only needed for the database strategy.
- **`verificationtokens`** — used by Email/magic-link providers. **Currently dead**
  (no email provider configured).

## 5. Change surface for a simpler strategy

### Must rewrite

- `src/auth.ts` — provider + adapter config
- `src/shared/components/SignIn.tsx` — hardcodes `signIn("github")`; a credentials or
  magic-link flow needs a real form with fields, not a bare button
- `.env` / `.env.prod` — swap the `AUTH_GITHUB_*` pair

### Likely unchanged if you stay on Auth.js

- `src/app/[locale]/api/auth/[...nextauth]/route.ts`
- `src/shared/components/SignOut.tsx`
- All 35 service guards
- `AppSidebarUserProfile.tsx`

### Must rewrite if you leave Auth.js entirely

This is the expensive path: all 35 `await auth()` guards, the sidebar, plus the
`jest.mock("@/auth")` stubs in:

- `src/app/[locale]/wallets/__tests__/services.test.ts`
- `src/app/[locale]/wallets/[id]/__tests__/service.test.ts`
- `src/app/[locale]/currencies/[currency]/history/__tests__/service.test.ts`

### Deletable schema, depending on target

| Target                     | `accounts` | `sessions` | `verificationtokens` |
| -------------------------- | ---------- | ---------- | -------------------- |
| Credentials (JWT sessions) | drop       | drop       | drop                 |
| Magic link / email         | drop       | keep       | **needed**           |
| Different OAuth provider   | keep       | keep       | drop                 |

### Package cleanup

- `@auth/prisma-adapter` — droppable on any JWT-only strategy
- `next-auth` — droppable only if you leave Auth.js

## 6. Observations worth acting on

1. **No middleware.** Unauthenticated users can render every page; they just get thrown
   `Unauthorized!` errors from services. Workable, but route protection is a gap you may want
   to close during the migration rather than after.
2. **The guard is copy-pasted 35 times.** Extracting a `requireUserId()` helper _before_
   switching strategies would shrink the migration to one file. Strongly recommended as step one.
3. **Credentials provider caveat.** If "simpler" means email + password: Auth.js v5's Credentials
   provider **cannot use the database session strategy** — it forces JWT. That means `sessions`
   becomes dead, and you'd add a `password_hash` column to `users` plus bcrypt/argon2
   (neither is currently a dependency).
4. **`verificationtokens` is already dead code** — safe to drop today regardless of what you
   choose next.
5. **No `Session` / `User` type augmentation exists** (`session.user.id` works via Auth.js's
   built-in adapter types). A hand-rolled auth layer would need its own types.

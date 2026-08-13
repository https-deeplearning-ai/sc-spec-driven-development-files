# Validation — Phase 8: Staff Authentication

Phase 8 is complete and ready to merge when all three criteria below pass.

---

## 1. TypeScript Compiles Clean

```
npx tsc --noEmit
```

Must exit with code 0 and no errors or warnings.

---

## 2. Vitest Unit Tests

Run with:

```
npm test
```

All existing tests must still pass, plus new coverage:

### Password Hashing (`src/auth/password.ts`)
- `verifyPassword` returns `true` for the correct plaintext against its hash.
- `verifyPassword` returns `false` for an incorrect plaintext.
- Hashing the same password twice produces two different stored values (salt differs).

### Sessions (`src/auth/session.ts`)
- `createSession` inserts a row and returns an id that `getSession` recognizes as valid.
- `destroySession` removes the row; `getSession` no longer recognizes that id.

### Migrations & Seed
- `staff_credentials` and `sessions` tables exist with expected columns after migration.
- After seeding, exactly one `staff_credentials` row exists with the expected default username (in a fresh test DB with no env override).
- Running the seed twice does not duplicate the `staff_credentials` row (idempotent).

### Routes
- `GET /dashboard` with no session cookie redirects (302) to `/login`.
- `GET /login` returns 200 and renders a login form.
- `POST /login` with correct seeded credentials: sets a `session_id` cookie, redirects (302) to `/dashboard`.
- `GET /dashboard` with a valid `session_id` cookie returns 200 and includes dashboard content (e.g. "Staff Dashboard").
- `POST /login` with an incorrect password: returns 200, re-renders the login form with an error message, does not set a session cookie.
- `POST /logout` with a valid session: redirects to `/login`, and a follow-up `GET /dashboard` with the same (now-invalid) cookie redirects to `/login` again.
- All other routes (`/`, `/agents`, `/agents/:id`, `/ailments`, `/therapies`, booking routes) remain reachable with no session cookie at all — confirming the auth gate is scoped to `/dashboard` only.

---

## 3. Manual Smoke Test Checklist

Start the dev server (`npm run dev`) and verify each item in a browser.

### Public Pages Stay Public
- [ ] `/`, `/agents`, `/agents/:id`, `/ailments`, `/therapies`, and the booking form are all reachable in a fresh incognito/private window with no login.

### Login Flow
- [ ] Visiting `/dashboard` while logged out redirects to `/login`.
- [ ] `/login` shows a username/password form with a discoverable "Staff Login" link (e.g. footer) from the home page.
- [ ] Submitting wrong credentials shows a clear, generic error and does not reveal whether the username or password was the problem.
- [ ] Submitting the seeded default credentials (`staff` / `changeme`, or whatever `STAFF_USERNAME`/`STAFF_PASSWORD` are set to) logs in and lands on `/dashboard`.
- [ ] `/dashboard` shows the same stats/tables it did before this phase — no behavior regression, just gated access.

### Session Persistence
- [ ] After logging in, reloading `/dashboard` in the same browser stays logged in (no re-login required).
- [ ] Restarting the dev server (`npm run dev`) and reloading `/dashboard` with the same browser cookie still works — confirms sessions survive a restart (SQLite-backed, not in-memory).

### Logout
- [ ] A visible "Logout" action on `/dashboard` exists and works.
- [ ] After logout, `/dashboard` redirects to `/login` again; the old session cookie no longer grants access.

### Security Basics
- [ ] The `session_id` cookie is `HttpOnly` (not readable via `document.cookie` in DevTools console).
- [ ] The seed's use of a default password (`changeme`) is documented in the README, with a note that production deployments should set `STAFF_PASSWORD`.

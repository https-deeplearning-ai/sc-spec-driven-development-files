# Plan — Phase 8: Staff Authentication

Numbered task groups in implementation order. Each group is independently reviewable.

---

## Group 1 — Staff Credentials Table & Hashing

1. Create `src/db/migrations/007_create_staff_credentials.sql` — `staff_credentials` table: `id`, `username` (`UNIQUE NOT NULL`), `password_hash` (`NOT NULL`), `created_at`.
2. Create `src/auth/password.ts` — `hashPassword(plain: string): string` and `verifyPassword(plain: string, hash: string): boolean`, built on `node:crypto`'s `scryptSync` with a random salt stored alongside the hash (e.g. `salt:hash` format).
3. Extend `src/db/seed.ts` — insert one `staff_credentials` row using `STAFF_USERNAME`/`STAFF_PASSWORD` env vars (defaults `staff` / `changeme`), hashed via `hashPassword`. Log a warning to the console when defaults are used. Use `INSERT OR IGNORE` to stay idempotent like the rest of `seed.ts`.

## Group 2 — Sessions Table & Helpers

4. Create `src/db/migrations/008_create_sessions.sql` — `sessions` table: `id` (`TEXT PRIMARY KEY`), `created_at`.
5. Create `src/auth/session.ts`:
   - `createSession(db): string` — generates a session id via `crypto.randomUUID()`, inserts a row, returns the id.
   - `getSession(db, id): boolean` — true if a session row with that id exists.
   - `destroySession(db, id): void` — deletes the row.

## Group 3 — Auth Middleware

6. Create `src/middleware/auth.ts` — `requireStaffAuth` (Hono `createMiddleware`, same shape as `logger.ts`): reads the `session_id` cookie via `getCookie`, calls `getSession`; if missing/invalid, `c.redirect("/login")` instead of calling `next()`.

## Group 4 — Login/Logout Routes & UI

7. Create `src/components/Login.tsx` — server-side JSX form (username, password fields, error message slot), following the pattern in `AppointmentForm.tsx`.
8. Create `src/routes/auth.tsx`:
   - `GET /login` — renders `Login` (redirect to `/dashboard` if already authenticated).
   - `POST /login` — reads form body, looks up `staff_credentials` by username, `verifyPassword`; on success calls `createSession` and sets the `session_id` cookie (`httpOnly`, `sameSite=lax`, `secure` outside dev), redirects to `/dashboard`; on failure re-renders `Login` with a generic "invalid username or password" error (no hint which field was wrong).
   - `POST /logout` — reads the `session_id` cookie, `destroySession`, clears the cookie, redirects to `/login`.
9. Register `authRouter` in `src/app.tsx`; apply `requireStaffAuth` to the existing `dashboardRouter` mount.
10. Add a small logout form/button to `Dashboard.tsx` (`POST /logout`), and a "Staff Login" link in `Footer.tsx`.

## Group 5 — Tests

11. `tests/auth-password.test.ts` — `hashPassword`/`verifyPassword` round-trip: correct password verifies true, wrong password verifies false, two hashes of the same password differ (salted).
12. Extend `tests/app.test.tsx` (or a new `tests/auth.test.tsx`):
    - `GET /dashboard` without a session redirects to `/login`.
    - `POST /login` with correct seeded credentials sets a `session_id` cookie and redirects to `/dashboard`.
    - `GET /dashboard` with that cookie returns 200 and dashboard content.
    - `POST /login` with wrong credentials returns the login form with an error, no cookie set.
    - `POST /logout` clears the session; a subsequent `GET /dashboard` with the old cookie redirects to `/login` again.

## Group 6 — Docs

13. Update `README.md` (or `CHANGELOG.md`) with the `STAFF_USERNAME`/`STAFF_PASSWORD` env vars and the default dev credentials, so the "changeme" default is documented, not hidden.
14. Mark Phase 8 complete in `specs/roadmap.md` once merged.

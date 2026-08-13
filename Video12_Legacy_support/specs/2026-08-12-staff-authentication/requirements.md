# Requirements — Phase 8: Staff Authentication

## Scope

Phase 8 gates the `/dashboard` route behind a single shared staff login, per `specs/tech-stack.md`. No other route changes: `/`, `/agents`, `/agents/:id`, `/ailments`, `/therapies`, and the booking flow all stay public — agents (and whoever books on their behalf) never see a login screen.

**Correction to the roadmap's phase 5 description:** the current `/dashboard` (`src/routes/dashboard.tsx`) is read-only — it has no POST actions for appointment status transitions, despite earlier CHANGELOG/roadmap text suggesting otherwise. This phase does not add those actions; it only gates what already exists (the dashboard view). Status-transition actions, if wanted, are a separate future phase and out of scope here.

## Decisions

These follow directly from the interview and `specs/tech-stack.md`:

- **Credentials:** a single staff account, stored as one seeded row in a new `staff_credentials` table (`username`, `password_hash`). Not per-user accounts, not roles.
- **Password hashing:** Node's built-in `crypto.scrypt` (salted, no plaintext ever stored). No new dependency (e.g. `bcrypt`) is added — `node:crypto` is sufficient for one credential and keeps the "no new infrastructure" philosophy from `tech-stack.md`.
- **Seeding the password:** the seed step reads `STAFF_USERNAME`/`STAFF_PASSWORD` from the environment (defaults: `staff` / `changeme`) and hashes at seed time. The default is for local/demo use only, is documented here and in the README, and a warning is logged when the default is used. Nothing plaintext is committed to source or the database.
- **Sessions:** server-side session table in SQLite (`sessions`: random `id`, `created_at`). The browser holds only an opaque `session_id` cookie (`httpOnly`, `sameSite=lax`, `secure` when not in dev). This matches `tech-stack.md`'s note that session state can live in SQLite, and sessions survive a server restart.
- **Session lifetime:** no idle timeout, no lockout on failed attempts, per the interview decision. A session is valid until explicit logout or the row is deleted. Unlimited login attempts.
- **Routes added:** `GET /login` (form), `POST /login` (verify, create session, set cookie, redirect to `/dashboard`), `POST /logout` (delete session row, clear cookie, redirect to `/login`).
- **Protection:** a `requireStaffAuth` middleware applied only to `/dashboard/*`. Unauthenticated requests redirect to `/login`.
- **Discoverability:** a low-key "Staff Login" link (e.g. in the footer) makes `/login` reachable without promoting it as a main nav item for agents/visitors.

## Context

This phase reuses two established patterns rather than inventing new ones:
- The migration + seed pattern from Phase 2 (`src/db/migrations/*.sql`, `src/db/seed.ts`) for `staff_credentials` and `sessions`.
- The middleware pattern from Phase 7 (`src/middleware/logger.ts`) for `requireStaffAuth`.

See `specs/mission.md` for why this stays minimal (teaching/demo scope, not a real security audit target) and `specs/tech-stack.md` for the auth and session decisions this phase implements.

## Out of Scope
- Per-user staff accounts or roles/permissions.
- Password reset / change-password flow.
- Rate limiting or account lockout on failed logins.
- Session idle timeout or expiry.
- Any new appointment status-transition actions on the dashboard (separate future phase).
- Protecting any route other than `/dashboard`.

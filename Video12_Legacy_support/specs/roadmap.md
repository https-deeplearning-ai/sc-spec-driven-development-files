# Roadmap

Phases are intentionally focused — each one is a shippable slice of work, independently reviewable and testable, and small enough to build and narrate live.

Phases 1–7 below describe the app as it already exists in `src/`; they're recorded here for continuity since the earlier spec files were lost. Phases 8+ are the next small increments.

---

## Phase 1 — Hello Hono ✅
- Install and configure Hono with `tsx` dev server
- Single `/` route returning a welcome response
- Confirm TypeScript types work end-to-end

## Phase 2 — Agents & Ailments ✅
- Server-side JSX layout component (header, nav, main, footer)
- Basic CSS (custom properties, reset, typography), mobile-first
- All routes render inside the shared layout
- SQLite database + first migrations (`agents`, `ailments`, `agent_ailments`)
- Seed a handful of fictional agents and ailments
- `/agents` list page and `/agents/:id` detail page (name, model type, status, presenting ailments)
- `/ailments` list page

## Phase 3 — Therapies Catalog ✅
- `therapies` + `ailment_therapies` tables and seed data
- `/therapies` list page
- Agent detail page shows recommended therapies per presenting ailment

## Phase 4 — Appointment Booking ✅
- `appointments` table (agent, therapist, scheduled time, status)
- Booking form on the agent detail page
- Server-side validation and a confirmation page at `/appointments/:id`

## Phase 5 — Staff Dashboard ✅
- `/dashboard` with summary counts (agents, open appointments, ailments in-flight)
- Read-only tables for staff to review agents, appointments, and ailments
- Appointment status transitions (`pending` → `confirmed`/`cancelled` → `completed`/`cancelled`) via plain POST forms
- Mary's dashboard is now real

## Phase 6 — Polish & Accessibility ✅
- Responsive layout audit across all pages
- Semantic HTML audit (tables, labeled form fields)
- `alert` role on validation errors, keyboard navigation and focus styles

## Phase 7 — Hardening ✅
- Branded 404/500 error pages
- Request logging middleware
- Input length/whitelist validation on all forms; FK and status enforcement at the SQL layer
- Test suite covering migrations, seeds, routes, validation, and status transitions

---

## Phase 8 — Staff Authentication ✅
- Single shared staff login (session cookie), per `tech-stack.md`
- `/dashboard` and its POST actions require a valid session; redirect to login otherwise
- Login form + logout action; no password reset flow, no per-user accounts yet
- Tests: unauthenticated access is rejected, valid login grants access, logout clears the session

## Phase 9 — Deployment Readiness
- Production `npm run build` produces a runnable `dist/`; document the `node dist/index.js` start command
- Environment-based config for the SQLite file path and port (no more hardcoded dev paths)
- A short deploy runbook (in `README.md` or `CHANGELOG.md`) naming a concrete host, per the single-Node-process decision in `tech-stack.md`
- Smoke-test checklist for a fresh deploy (migrations run, seed data optional, health check route)

## Phase 10 — Therapist Profiles
- `therapists` table (name, specialty, bio) replacing the free-text `therapist_name` on appointments
- `/therapists` list page
- Booking form picks a therapist from the list instead of typing a name

---

Later phases (not yet planned): email/notification reminders for upcoming appointments, richer reporting on the dashboard, multi-agent/org support. These stay out of scope until a phase above is done and a stakeholder asks for them — see `mission.md` on keeping scope tight for teaching and demo purposes.

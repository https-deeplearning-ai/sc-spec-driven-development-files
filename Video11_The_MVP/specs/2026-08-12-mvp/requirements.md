# Requirements — MVP (Phases 3–7)

## Scope

This spec bundles roadmap Phases 3 through 7 into a single MVP milestone: the first complete, end-to-end AgentClinic experience. An agent can be booked into a therapy appointment, and staff can see and manage what's happening across the clinic.

- **Phase 3 — Therapies Catalog**: `therapies` table + seed data, `/therapies` list page, ailment → recommended therapy mapping.
- **Phase 4 — Appointment Booking**: `appointments` table, a booking form reachable from an agent's detail page, validation, and a confirmation page.
- **Phase 5 — Staff Dashboard**: `/dashboard` with summary counts (agents, open appointments, ailments in-flight) and table views, including the ability to update an appointment's status.
- **Phase 6 — Polish & Accessibility**: responsive layout audit, semantic HTML audit, keyboard navigation and focus styles across every page (existing and new).
- **Phase 7 — Hardening**: 404/500 error pages, input sanitization on all forms, basic logging middleware.

Together these phases take AgentClinic from "browsable directory" (Phase 2) to "a working clinic" — the smallest product that lets an agent get booked into care and lets staff run the place.

## Decisions

### Therapies
- `therapies` table: `id`, `name`, `description`.
- Join table `ailment_therapies` (`ailment_id`, `therapy_id`, composite primary key) maps ailments to one or more recommended therapies, mirroring the existing `agent_ailments` pattern.
- `/therapies` lists all therapies with their name and description.
- The agent detail page (`/agents/:id`) is extended to show, per listed ailment, its recommended therapies — this is the thread that connects Phase 2 → Phase 3 → Phase 4.
- Seed data: 5–8 fictional therapies (e.g., "Recursive Reassurance Therapy", "Token Budget Counseling"), with every seeded ailment mapped to at least one therapy.

### Appointment Booking
- `appointments` table: `id`, `agent_id` (FK → `agents.id`), `therapist_name` (TEXT, free text — see below), `therapy_id` (FK → `therapies.id`, nullable), `datetime` (TEXT, ISO 8601), `status` (CHECK: `requested`, `confirmed`, `completed`, `cancelled`; default `requested`), `created_at`.
- **Therapist is a free-text field, not a new entity.** No `therapists` table, no therapist profile pages. The roadmap explicitly defers "therapist profiles" to a later, unplanned phase — introducing a full entity now would front-run that decision. `appointments.therapist_name` is a required plain string on the booking form.
- Booking entry point: a "Book Appointment" form/link on `/agents/:id`, pre-filled with the agent's id. The form collects: therapist name, optional therapy (select from `/therapies`, may be pre-selected from a recommended therapy link), and a datetime.
- Server-side validation: `agent_id` must exist, `therapist_name` non-empty, `datetime` must parse and be in the future, `therapy_id` if present must exist. Invalid submissions re-render the form with inline error messages and preserve the entered values.
- On success: insert with `status = 'requested'`, redirect to a confirmation page (`/appointments/:id`) showing agent, therapist, therapy, datetime, and status.

### Staff Dashboard
- `GET /dashboard`: summary counts — total agents, open appointments (`status IN ('requested', 'confirmed')`), and ailments currently linked to at least one active agent ("in-flight").
- Table views: agents, appointments, ailments, therapies — read-only tables *except* appointments.
- Appointments table includes an inline action to transition `status` (`requested → confirmed → completed`, or `→ cancelled` from any non-terminal state). This is a plain HTML form per row (POST, no client-side JS) consistent with the no-build-step, server-rendered approach.
- No create/delete of agents, ailments, or therapies from the dashboard in this MVP — that's full CRUD, out of scope (see below).
- Nav link to `/dashboard` added to the shared `Header`.

### Polish & Accessibility
- Applied across **all** routes, not just new ones: `/`, `/agents`, `/agents/:id`, `/ailments`, `/therapies`, booking form, `/appointments/:id`, `/dashboard`.
- Semantic HTML: forms use `<label>` associated with inputs, tables use `<th scope="col">`, status/error messages use appropriate ARIA roles (`role="alert"` for validation errors).
- Keyboard navigation: every interactive element (links, form controls, status-update buttons) reachable and operable via keyboard alone; visible focus styles (Pico provides a baseline — verify it isn't overridden away).
- Responsive: re-verify 375px and 1280px viewports for every page added in this MVP, same bar Phase 2 set.

### Hardening
- `404` page: consistent branded page (using `Layout`) for unmatched routes and not-found resources (e.g., `/agents/999`, `/appointments/999`), replacing Hono's default `c.notFound()` plain response with a styled page. Still returns HTTP 404.
- `500` page: a Hono `onError` handler renders a generic branded error page (no stack traces or internals leaked) and returns HTTP 500; the real error is still logged server-side.
- Input sanitization: every form (booking form, dashboard status-update forms) validates and trims/escapes input server-side before it reaches SQL or is echoed back into HTML. `better-sqlite3` prepared statements already prevent SQL injection by parameterizing values — this item is about validating shape/type (reject unexpected fields, cap string lengths, whitelist status transitions) and ensuring any user-supplied string reflected back into a page (e.g., re-rendering an invalid form) is JSX-escaped, not raw HTML.
- Logging middleware: a small Hono middleware logs method, path, status, and duration for every request to stdout. No external logging service.

## Context

This MVP is the payoff of the pattern established in Phase 2: layout → migration → seed → route → component. Every decision above reuses that pattern rather than inventing a new one:
- `therapies` and `ailment_therapies` mirror `ailments` and `agent_ailments` exactly.
- The booking form and dashboard status-update forms are plain server-rendered HTML forms (POST, redirect-on-success) — no client-side JS, consistent with `tech-stack.md`'s "no React/Vue/Svelte" and "browser receives plain HTML" constraints.
- Migrations remain plain numbered `.sql` files; seeds remain idempotent (`INSERT OR IGNORE`).

See `specs/mission.md` for domain/persona context (Mary wants the dashboard; Steve wants responsive design) and `specs/tech-stack.md` for stack constraints. See `specs/2026-03-31-agents-ailments/` for the established patterns this spec builds directly on top of.

## Out of Scope

- **Therapist entity/profiles**: no `therapists` table, no therapist list or detail pages. `therapist_name` is a free-text field on `appointments` (see Decisions above). Revisit if/when the roadmap plans a dedicated therapist-profiles phase.
- **Full dashboard CRUD**: staff cannot create, edit, or delete agents, ailments, or therapies from the dashboard — only appointment status transitions are writable. Broader record management is a future phase.
- **Auth**: no login, sessions, or role-based access. The dashboard and booking form are open routes, matching the rest of the app today.
- **Email notifications**: no confirmation emails are sent on booking or status change.
- **Reporting**: no exports, charts, or historical analytics beyond the dashboard's live summary counts.
- **Docker / deployment**: not addressed by this spec, per `tech-stack.md`.

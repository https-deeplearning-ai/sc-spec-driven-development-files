# Plan — MVP (Phases 3–7)

Numbered task groups in implementation order. Each group is independently reviewable, following the layout → migration → seed → route → component pattern from Phase 2.

---

## Group 1 — Therapies Table & Seed (Phase 3)

1. Create `src/db/migrations/004_create_therapies.sql` — `therapies` table: `id`, `name`, `description`.
2. Create `src/db/migrations/005_create_ailment_therapies.sql` — join table: `ailment_id`, `therapy_id`, composite primary key, FKs to `ailments(id)` and `therapies(id)`.
3. Add `Therapy` and `AilmentTherapy` types to `src/db/types.ts`.
4. Extend `src/db/seed.ts` with 5–8 fictional therapies and a links table mapping every seeded ailment to at least one therapy (`INSERT OR IGNORE`, same pattern as agent–ailment links).

## Group 2 — Therapies Route & List Page (Phase 3)

5. Create `src/routes/therapies.tsx` — `GET /therapies` queries all therapies, renders `TherapiesList`.
6. Create `src/components/TherapiesList.tsx` — server-side JSX, Pico `<table>` or list.
7. Register therapies router in `src/index.tsx`; add `/therapies` nav link in `Header`.
8. Extend `agentsRouter`'s `GET /:id` query to also fetch recommended therapies per ailment; update `AgentDetail` to render them under each ailment.

## Group 3 — Appointments Table (Phase 4)

9. Create `src/db/migrations/006_create_appointments.sql` — `appointments` table: `id`, `agent_id` (FK), `therapist_name` (TEXT NOT NULL), `therapy_id` (FK, nullable), `datetime` (TEXT NOT NULL), `status` (CHECK: `requested`|`confirmed`|`completed`|`cancelled`, default `requested`), `created_at`.
10. Add `Appointment` type to `src/db/types.ts`.

## Group 4 — Booking Form & Confirmation (Phase 4)

11. Create `src/components/BookingForm.tsx` — form fields: therapist name, therapy (`<select>` populated from `therapies`, optional), datetime (`<input type="datetime-local">`); accepts an optional `errors` prop to re-render inline validation messages and preserve submitted values.
12. Add a "Book Appointment" link/section to `AgentDetail` linking to the booking form for that agent.
13. Create `src/routes/appointments.tsx`:
    - `GET /agents/:id/book` — renders `BookingForm` for the given agent (404 if agent doesn't exist).
    - `POST /agents/:id/book` — validates input (agent exists, therapist name non-empty, datetime parses and is in the future, therapy_id exists if provided); on failure re-renders `BookingForm` with errors + HTTP 422; on success inserts appointment with `status = 'requested'` and redirects (303) to `/appointments/:id`.
    - `GET /appointments/:id` — confirmation/detail page: agent, therapist, therapy, datetime, status (404 if not found).
14. Create `src/components/AppointmentConfirmation.tsx`.
15. Register appointments router in `src/index.tsx`.

## Group 5 — Staff Dashboard (Phase 5)

16. Create `src/routes/dashboard.tsx` — `GET /dashboard`:
    - Summary counts: total agents, open appointments (`status IN ('requested','confirmed')`), ailments in-flight (distinct ailments linked to agents with `status = 'active'`).
    - Table data: all agents, all appointments (with joined agent name/therapist/therapy/status), all ailments, all therapies.
17. Create `src/components/Dashboard.tsx` — summary stat row + tables, Pico `<table>` elements.
18. `POST /dashboard/appointments/:id/status` — accepts a whitelisted `status` value, validates the transition (no-op if same, reject invalid target), updates the row, redirects (303) back to `/dashboard`.
19. Add a status-update `<form>` (per appointment row) to `Dashboard` — plain POST, no client-side JS.
20. Register dashboard router in `src/index.tsx`; add `/dashboard` nav link in `Header`.

## Group 6 — Polish & Accessibility Audit (Phase 6)

21. Audit every route (existing + new) for semantic HTML: `<label for>` on all form inputs, `<th scope="col">` on all tables, landmark elements intact.
22. Add `role="alert"` to validation-error blocks on the booking form.
23. Verify visible focus styles are present (not overridden by `styles.css`) on links, buttons, and form controls; add focus-visible CSS if Pico's default is insufficient.
24. Keyboard-navigate every page (tab order, form submission, status-update buttons) manually; fix any traps or unreachable controls.
25. Re-check 375px and 1280px viewports for `/therapies`, booking form, `/appointments/:id`, and `/dashboard`.

## Group 7 — Hardening (Phase 7)

26. Create `src/components/ErrorPage.tsx` — branded 404/500 page using `Layout`.
27. Replace bare `c.notFound()` calls with a handler rendering `ErrorPage` (still HTTP 404); add a global `app.notFound()` handler in `src/index.tsx`.
28. Add `app.onError()` in `src/index.tsx` — logs the error server-side, renders `ErrorPage` with a generic message (no stack trace), returns HTTP 500.
29. Review booking and dashboard status forms: enforce max lengths on `therapist_name`, whitelist `status` transition values server-side, confirm no raw user input is ever interpolated into HTML outside of JSX's automatic escaping.
30. Create `src/middleware/logger.ts` — logs method, path, status, duration per request; register in `src/index.tsx` before routers.

## Group 8 — Tests & Final Verification

31. Extend `tests/db.test.ts`: migrations create `therapies`, `ailment_therapies`, `appointments`; seed populates therapies and ailment_therapies; running seed twice doesn't duplicate.
32. Extend `tests/app.test.tsx`: `/therapies` 200 + lists names; agent detail shows recommended therapies; booking flow (GET form, POST valid → 303 + confirmation page, POST invalid → 422 + errors); `/dashboard` 200 + summary counts + status-update POST changes status; 404 route returns branded 404 page; forced error path returns branded 500 page (see `validation.md` for exact assertions).
33. Run through `validation.md` in full before opening a PR.

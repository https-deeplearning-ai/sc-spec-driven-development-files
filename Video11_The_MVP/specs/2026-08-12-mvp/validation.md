# Validation — MVP (Phases 3–7)

This MVP is complete and ready to merge when all criteria below pass.

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

All tests must pass. Required test coverage, in addition to everything already covered by `specs/2026-03-31-agents-ailments/validation.md`:

### Database / Migrations
- `migrate()` creates `therapies`, `ailment_therapies`, and `appointments` tables with expected columns.
- `appointments.status` CHECK constraint rejects an invalid status value.
- Running `migrate()` twice is still idempotent with the new migrations added.

### Seed Data
- After seeding, `SELECT COUNT(*) FROM therapies` returns ≥ 5.
- After seeding, every seeded ailment has at least one row in `ailment_therapies`.
- Running seed twice does not duplicate rows in `therapies` or `ailment_therapies`.

### Therapies Routes
- `GET /therapies` returns HTTP 200 and lists all therapy names.
- `GET /agents/:id` for a known seed agent includes at least one recommended therapy name (via its ailments).

### Booking Routes
- `GET /agents/:id/book` returns HTTP 200 and includes a form with therapist name, therapy, and datetime fields.
- `GET /agents/999/book` (non-existent agent) returns HTTP 404.
- `POST /agents/:id/book` with valid data (non-empty therapist name, future datetime) returns a redirect to `/appointments/:id` and the new row exists with `status = 'requested'`.
- `POST /agents/:id/book` with an empty therapist name returns HTTP 422 and re-renders the form with an inline error and the previously entered datetime preserved.
- `POST /agents/:id/book` with a past datetime returns HTTP 422 with an inline error.
- `POST /agents/:id/book` with a non-existent `therapy_id` returns HTTP 422 with an inline error.
- `GET /appointments/:id` for a just-created appointment returns HTTP 200 and shows agent name, therapist name, therapy (if set), datetime, and status.
- `GET /appointments/999999` returns HTTP 404.

### Dashboard Routes
- `GET /dashboard` returns HTTP 200 and includes summary counts for agents, open appointments, and in-flight ailments that match direct SQL counts against the same seeded/test data.
- `GET /dashboard` lists all appointments with agent name, therapist name, and status visible.
- `POST /dashboard/appointments/:id/status` with a valid next status (e.g., `requested` → `confirmed`) updates the row and redirects back to `/dashboard`.
- `POST /dashboard/appointments/:id/status` with an invalid/unknown status value is rejected (400/422) and does not change the row.
- `POST /dashboard/appointments/999999/status` (non-existent appointment) returns HTTP 404.

### Error Handling
- `GET /some-nonexistent-route` returns HTTP 404 and rendered HTML includes layout landmarks (branded page, not Hono's plain default).
- A route that deliberately throws (test-only forced error, or an existing route exercised with a condition that triggers the `onError` handler) returns HTTP 500 with a generic branded page — response body must **not** contain a stack trace or raw error message.

### Input Sanitization
- Submitting a `therapist_name` containing `<script>` or HTML tags is either rejected or safely escaped when redisplayed (in the re-rendered form on validation failure, and on the confirmation page) — response body must not contain an unescaped `<script>` tag.
- `POST /dashboard/appointments/:id/status` rejects a status value not in the whitelist (`requested`, `confirmed`, `completed`, `cancelled`) even if it is syntactically valid input.

---

## 3. Manual Smoke Test Checklist

Start the dev server (`npm run dev`) and verify each item visually in a browser.

### Navigation
- [ ] Header nav includes working links to `/`, `/agents`, `/ailments`, `/therapies`, and `/dashboard`.
- [ ] All existing Phase 2 checklist items (`specs/2026-03-31-agents-ailments/validation.md`) still pass — nothing regressed.

### Therapies
- [ ] `/therapies` lists at least 5 therapies with name and description.
- [ ] An agent detail page (`/agents/:id`) shows, for at least one ailment, its recommended therapy/therapies.

### Booking
- [ ] From an agent's detail page, a "Book Appointment" link/section is visible and reachable via keyboard.
- [ ] The booking form loads with therapist name, therapy dropdown, and datetime fields.
- [ ] Submitting with an empty therapist name shows an inline error and does not lose the entered datetime.
- [ ] Submitting a valid booking redirects to a confirmation page showing agent, therapist, therapy, datetime, and status "requested".

### Dashboard
- [ ] `/dashboard` shows summary counts for agents, open appointments, and in-flight ailments, matching what's visible on `/agents`, `/appointments`, and `/ailments`.
- [ ] The appointments table shows every booked appointment with agent, therapist, therapy, datetime, and status.
- [ ] Changing an appointment's status via the dashboard form updates it in place (page reloads, new status visible) without JavaScript enabled.
- [ ] Attempting an invalid status transition (if exposed in the UI) is rejected gracefully.

### Accessibility & Responsive (Phase 6)
- [ ] Every form input has a visible, associated label.
- [ ] Tab key alone can reach and operate every link, form field, and button on every page, including status-update buttons on the dashboard.
- [ ] Focus outlines are visible on all interactive elements (not suppressed).
- [ ] At 375px viewport width, all new pages (`/therapies`, booking form, confirmation, `/dashboard`) stack vertically with no horizontal scroll.
- [ ] At 1280px viewport width, the dashboard's tables and stat row use available space sensibly.
- [ ] Disable JavaScript in the browser entirely and confirm booking and status-update forms still work (server-rendered, no client JS dependency).

### Hardening (Phase 7)
- [ ] Visiting a nonexistent route (e.g., `/nope`) shows a branded 404 page, not a blank or default error screen.
- [ ] Triggering a server error (if a test hook exists) shows a branded, generic 500 page — no stack trace visible in the browser.
- [ ] Server console shows one log line per request (method, path, status, duration) while browsing the app.
- [ ] Submitting `<script>alert(1)</script>` as a therapist name does not execute a script when the value is later displayed (form re-render or confirmation page).

---

## Definition of Done

All three sections above pass, `specs/roadmap.md` Phases 3–7 are marked complete, and `CHANGELOG.md` is updated before merging to `main`.

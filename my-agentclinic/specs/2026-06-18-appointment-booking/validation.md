# Validation — Phase 7: Appointment Booking

## Automated checks

- [ ] `tsc --noEmit` passes with zero errors
- [ ] `npm test` passes — all existing tests green, new tests added:
  - `GET /agents/:id/appointments/new` returns 200 and contains the booking form and agent name
  - `POST /agents/:id/appointments` with valid data returns 302 redirect to confirmation
  - `POST /agents/:id/appointments` with missing fields returns 422 and an error message
  - `GET /appointments/:id/confirmation` returns 200 and contains therapist name and agent name

## Manual checks

- [ ] Agent detail page shows a "Book Appointment" link
- [ ] Clicking "Book Appointment" loads the form pre-scoped to that agent
- [ ] Submitting the form with all fields filled redirects to a confirmation page
- [ ] Confirmation page shows agent name, therapist, datetime, notes, and status "scheduled"
- [ ] "Back to agent" link on confirmation returns to `/agents/:id`
- [ ] Submitting with therapist or datetime blank re-renders the form with an error message
- [ ] Previously entered values are not lost on validation failure (form repopulation)

## Definition of done

All automated and manual checks pass. No phase 6 functionality is broken.

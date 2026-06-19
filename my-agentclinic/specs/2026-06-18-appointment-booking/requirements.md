# Requirements — Phase 7: Appointment Booking

## Goal

Allow staff to book therapy appointments for agents. The flow starts from an agent's detail page, collects therapist name, datetime, and optional notes via a form, and ends on a confirmation page.

## Scope

### In scope

- `appointments` table: `id`, `agent_id`, `therapist`, `datetime`, `notes`, `status`
- `GET /agents/:id/appointments/new` — booking form pre-scoped to the agent
- `POST /agents/:id/appointments` — process form, validate, insert row, redirect to confirmation
- `GET /appointments/:id/confirmation` — shows the booked appointment details
- "Book Appointment" link added to the agent detail page
- Basic server-side validation: therapist and datetime are required; datetime must be a parseable value

### Out of scope

- Editing or cancelling appointments (Phase 8+)
- A therapists table or therapist selector (therapist is free text for now)
- Authentication / access control
- Email notifications

## Data Model

```sql
CREATE TABLE IF NOT EXISTS appointments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id   INTEGER NOT NULL REFERENCES agents(id),
  therapist  TEXT NOT NULL,
  datetime   TEXT NOT NULL,
  notes      TEXT,
  status     TEXT NOT NULL DEFAULT 'scheduled'
);
```

`datetime` is stored as an ISO 8601 string (the native value from `<input type="datetime-local">`).

## Form Fields

| Field | Input type | Required | Notes |
|---|---|---|---|
| Therapist | `text` | Yes | Validated non-empty server-side |
| Date & time | `datetime-local` | Yes | Validated non-empty server-side |
| Notes | `textarea` | No | Stored as-is; null if blank |

## Flow

1. Agent detail page (`/agents/:id`) — "Book Appointment" link at the bottom
2. Booking form (`GET /agents/:id/appointments/new`) — form with the three fields above; agent name shown as context
3. On submit (`POST /agents/:id/appointments`):
   - If validation fails: re-render the form with an inline error message
   - If valid: insert row, redirect to `GET /appointments/:id/confirmation`
4. Confirmation page — shows agent name, therapist, datetime, notes, status; link back to agent detail

## UI Decisions

- Form uses Pico CSS semantic form elements (`<label>`, `<input>`, `<textarea>`, `<button type="submit">`) — no extra classes needed
- Validation errors rendered as a `<p>` with `aria-live="polite"` above the form fields
- Confirmation page is read-only; no edit controls

## References

- `specs/mission.md` — domain context
- `specs/tech-stack.md` — Hono JSX, Pico CSS, SQLite via better-sqlite3

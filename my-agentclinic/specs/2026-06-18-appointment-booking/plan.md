# Plan — Phase 7: Appointment Booking

## 1. Add migration

- Create `db/migrations/007_create_appointments.sql`:
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
- Register in `db/client.ts`

## 2. Add Appointment type

- Create `src/pages/BookAppointment.tsx`
- Export `type Appointment { id, agent_id, therapist, datetime, notes, status }`
- Render a booking form inside `<Layout title="Book Appointment">`:
  - Agent name as context (`<p>Booking for: <strong>{agent.name}</strong></p>`)
  - Optional `error` prop renders a `<p aria-live="polite">` above fields
  - Fields: therapist `<input type="text">`, datetime `<input type="datetime-local">`, notes `<textarea>`
  - `<button type="submit">Book Appointment</button>`
  - Form `action` and `method="post"` pointing to `POST /agents/:id/appointments`

## 3. Build the confirmation page

- Create `src/pages/AppointmentConfirmation.tsx`
- Props: `{ appointment: Appointment, agentName: string }`
- Render inside `<Layout title="Appointment Confirmed">`:
  - `<h1>Appointment Confirmed</h1>`
  - `<dl>` with Agent, Therapist, Date & Time, Notes, Status
  - Link back to `/agents/:id`

## 4. Update AgentDetail to show booking link

- In `src/pages/AgentDetail.tsx`, add a "Book Appointment" link below the back link:
  ```tsx
  <a href={`/agents/${agent.id}/appointments/new`}>Book Appointment</a>
  ```

## 5. Add routes

In `src/app.tsx`:

```ts
// Show booking form
app.get('/agents/:id/appointments/new', (c) => {
  const id = Number(c.req.param('id'))
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined
  if (!agent) return c.text('Agent not found', 404)
  return c.html(<BookAppointment agent={agent} />)
})

// Process booking form
app.post('/agents/:id/appointments', async (c) => {
  const id = Number(c.req.param('id'))
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined
  if (!agent) return c.text('Agent not found', 404)

  const body = await c.req.parseBody()
  const therapist = String(body.therapist ?? '').trim()
  const datetime  = String(body.datetime  ?? '').trim()
  const notes     = String(body.notes     ?? '').trim() || null

  if (!therapist || !datetime) {
    return c.html(<BookAppointment agent={agent} error="Therapist and date/time are required." />, 422)
  }

  const result = db.prepare(
    'INSERT INTO appointments (agent_id, therapist, datetime, notes) VALUES (?, ?, ?, ?)'
  ).run(id, therapist, datetime, notes)

  return c.redirect(`/appointments/${result.lastInsertRowid}/confirmation`)
})

// Confirmation page
app.get('/appointments/:id/confirmation', (c) => {
  const id = Number(c.req.param('id'))
  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as Appointment | undefined
  if (!appointment) return c.text('Appointment not found', 404)
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(appointment.agent_id) as Agent
  return c.html(<AppointmentConfirmation appointment={appointment} agentName={agent.name} />)
})
```

## 6. Update tests

- Add `GET /agents/:id/appointments/new` test: 200, contains form and agent name
- Add `POST /agents/:id/appointments` (valid) test: follows redirect to confirmation (302)
- Add `POST /agents/:id/appointments` (missing fields) test: 422, contains error message
- Add `GET /appointments/:id/confirmation` test: 200, contains therapist and agent name
- Update `GET /agents/:id` test: response contains "Book Appointment" link
- Run `tsc --noEmit` and `npm test` — all pass

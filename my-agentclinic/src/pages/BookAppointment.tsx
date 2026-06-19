import { Layout } from '../components/Layout'
import type { Agent } from './Agents'

export type Appointment = {
  id: number
  agent_id: number
  therapist: string
  datetime: string
  notes: string | null
  status: string
}

type Props = {
  agent: Agent
  error?: string
  values?: { therapist: string; datetime: string; notes: string }
}

export function BookAppointment({ agent, error, values }: Props) {
  return (
    <Layout title="Book Appointment">
      <h1>Book Appointment</h1>
      <p>Booking for: <strong>{agent.name}</strong></p>
      {error && <p aria-live="polite" style="color: var(--pico-color-red-500)">{error}</p>}
      <form method="post" action={`/agents/${agent.id}/appointments`}>
        <label>
          Therapist
          <input type="text" name="therapist" value={values?.therapist ?? ''} required />
        </label>
        <label>
          Date &amp; Time
          <input type="datetime-local" name="datetime" value={values?.datetime ?? ''} required />
        </label>
        <label>
          Notes
          <textarea name="notes">{values?.notes ?? ''}</textarea>
        </label>
        <button type="submit">Book Appointment</button>
      </form>
      <a href={`/agents/${agent.id}`}>← Back to Agent</a>
    </Layout>
  )
}

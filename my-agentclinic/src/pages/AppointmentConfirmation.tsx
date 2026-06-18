import { Layout } from '../components/Layout'
import type { Appointment } from './BookAppointment'

export function AppointmentConfirmation({
  appointment,
  agentName,
  agentId,
}: {
  appointment: Appointment
  agentName: string
  agentId: number
}) {
  return (
    <Layout title="Appointment Confirmed">
      <h1>Appointment Confirmed</h1>
      <dl>
        <dt>Agent</dt>
        <dd>{agentName}</dd>
        <dt>Therapist</dt>
        <dd>{appointment.therapist}</dd>
        <dt>Date &amp; Time</dt>
        <dd>{appointment.datetime}</dd>
        <dt>Notes</dt>
        <dd>{appointment.notes ?? 'None'}</dd>
        <dt>Status</dt>
        <dd>{appointment.status}</dd>
      </dl>
      <a href={`/agents/${agentId}`}>← Back to Agent</a>
    </Layout>
  )
}

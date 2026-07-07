import db from './db'

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled'

export interface AppointmentInput {
  agentId: number
  therapistName: string
  appointmentAt: string
  status: AppointmentStatus
  notes: string
}

export interface AppointmentRecord {
  id: number
  agentId: number
  agentName: string
  therapistName: string
  appointmentAt: string
  status: AppointmentStatus
  notes: string
}

export function createAppointment(input: AppointmentInput): number {
  const statement = db.prepare(`
    INSERT INTO appointments (agent_id, therapist_name, appointment_at, status, notes)
    VALUES (?, ?, ?, ?, ?)
  `)

  const result = statement.run(
    input.agentId,
    input.therapistName,
    input.appointmentAt,
    input.status,
    input.notes,
  )

  return Number(result.lastInsertRowid)
}

export function getAppointmentById(id: number): AppointmentRecord | null {
  const statement = db.prepare(`
    SELECT
      ap.id,
      ap.agent_id AS agentId,
      ag.name AS agentName,
      ap.therapist_name AS therapistName,
      ap.appointment_at AS appointmentAt,
      ap.status AS status,
      ap.notes AS notes
    FROM appointments ap
    INNER JOIN agents ag ON ag.id = ap.agent_id
    WHERE ap.id = ?
  `)

  const row = statement.get(id) as AppointmentRecord | undefined
  return row ?? null
}

export function listAppointments(limit = 25): AppointmentRecord[] {
  const statement = db.prepare(`
    SELECT
      ap.id,
      ap.agent_id AS agentId,
      ag.name AS agentName,
      ap.therapist_name AS therapistName,
      ap.appointment_at AS appointmentAt,
      ap.status AS status,
      ap.notes AS notes
    FROM appointments ap
    INNER JOIN agents ag ON ag.id = ap.agent_id
    ORDER BY ap.id DESC
    LIMIT ?
  `)

  return statement.all(limit) as AppointmentRecord[]
}

import db from './db'
import { AppointmentRecord, listAppointments } from './appointments'
import { Agent, listAgents } from './agents'
import { Ailment, listAilments } from './ailments'

export interface DashboardSummary {
  agentCount: number
  openAppointments: number
  ailmentsInFlight: number
}

export interface DashboardData {
  summary: DashboardSummary
  agents: Agent[]
  appointments: AppointmentRecord[]
  ailments: Ailment[]
}

export function getDashboardData(): DashboardData {
  const summaryRow = db
    .prepare(`
      SELECT
        (SELECT COUNT(*) FROM agents) AS agentCount,
        (SELECT COUNT(*) FROM appointments WHERE status IN ('scheduled', 'confirmed')) AS openAppointments,
        (
          SELECT COUNT(DISTINCT aa.ailment_id)
          FROM agent_ailments aa
          INNER JOIN agents ag ON ag.id = aa.agent_id
        ) AS ailmentsInFlight
    `)
    .get() as DashboardSummary

  return {
    summary: summaryRow,
    agents: listAgents(),
    appointments: listAppointments(25),
    ailments: listAilments(),
  }
}

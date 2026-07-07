import db from './db'

export interface Agent {
  id: number
  name: string
  modelType: string
  currentStatus: string
  presentingComplaints: string
}

export interface AgentProfile extends Agent {
  ailments: string[]
}

export function listAgents(): Agent[] {
  const statement = db.prepare(`
    SELECT
      id,
      name,
      model_type AS modelType,
      current_status AS currentStatus,
      presenting_complaints AS presentingComplaints
    FROM agents
    ORDER BY id ASC
  `)

  return statement.all() as Agent[]
}

interface AgentProfileRow extends Agent {
  ailmentsCsv: string | null
}

export function getAgentById(id: number): AgentProfile | null {
  const statement = db.prepare(
    `
    SELECT
      a.id,
      a.name,
      a.model_type AS modelType,
      a.current_status AS currentStatus,
      a.presenting_complaints AS presentingComplaints,
      GROUP_CONCAT(al.name, '|') AS ailmentsCsv
    FROM agents a
    LEFT JOIN agent_ailments aa ON aa.agent_id = a.id
    LEFT JOIN ailments al ON al.id = aa.ailment_id
    WHERE a.id = ?
    GROUP BY a.id, a.name, a.model_type, a.current_status, a.presenting_complaints
  `,
  )

  const row = statement.get(id) as AgentProfileRow | undefined
  if (!row) {
    return null
  }

  return {
    id: row.id,
    name: row.name,
    modelType: row.modelType,
    currentStatus: row.currentStatus,
    presentingComplaints: row.presentingComplaints,
    ailments: row.ailmentsCsv
      ? row.ailmentsCsv.split('|').filter((item) => item.length > 0)
      : [],
  }
}

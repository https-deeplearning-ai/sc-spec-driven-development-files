import db from './db'

export interface Ailment {
  id: number
  name: string
  description: string
  agentCount: number
}

export function listAilments(): Ailment[] {
  const statement = db.prepare(`
    SELECT
      al.id,
      al.name,
      al.description,
      COUNT(DISTINCT aa.agent_id) AS agentCount
    FROM ailments al
    LEFT JOIN agent_ailments aa ON aa.ailment_id = al.id
    GROUP BY al.id, al.name, al.description
    ORDER BY al.id ASC
  `)

  return statement.all() as Ailment[]
}

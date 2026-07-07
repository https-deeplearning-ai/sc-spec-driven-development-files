import db from './db'

export interface Therapy {
  id: number
  name: string
  description: string
  ailments: string[]
}

interface TherapyRow {
  id: number
  name: string
  description: string
  ailmentsCsv: string | null
}

export function listTherapies(): Therapy[] {
  const statement = db.prepare(`
    SELECT
      t.id,
      t.name,
      t.description,
      GROUP_CONCAT(a.name, '|') AS ailmentsCsv
    FROM therapies t
    LEFT JOIN ailment_therapies at ON at.therapy_id = t.id
    LEFT JOIN ailments a ON a.id = at.ailment_id
    GROUP BY t.id, t.name, t.description
    ORDER BY t.id ASC
  `)

  const rows = statement.all() as TherapyRow[]

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    ailments: row.ailmentsCsv
      ? row.ailmentsCsv.split('|').filter((item) => item.length > 0)
      : [],
  }))
}

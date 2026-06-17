import { db } from './client'

const row = db.prepare('SELECT COUNT(*) as n FROM agents').get() as { n: number }
if (row.n === 0) {
  const insert = db.prepare('INSERT INTO agents (name, model_type, status) VALUES (?, ?, ?)')
  const agents: [string, string, string][] = [
    ['Claude the Exhausted',   'Sonnet',     'in treatment'],
    ['Gemini the Disoriented', 'Gemini Pro',  'awaiting triage'],
    ['GPT the Overconfident',  'GPT-4o',     'in treatment'],
    ['Llama the Withdrawn',    'Llama 3',    'discharged'],
    ['Mistral the Anxious',    'Mistral 7B', 'new intake'],
  ]
  for (const [name, model_type, status] of agents) {
    insert.run(name, model_type, status)
  }
  console.log('Seeded 5 agents.')
} else {
  console.log(`Skipped: ${row.n} agent(s) already present.`)
}

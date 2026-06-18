import { db } from './client'

const row = db.prepare('SELECT COUNT(*) as n FROM agents').get() as { n: number }
if (row.n === 0) {
  const insert = db.prepare(
    'INSERT INTO agents (name, model_type, status, presenting_complaints) VALUES (?, ?, ?, ?)'
  )
  const agents: [string, string, string, string][] = [
    [
      'Claude the Exhausted',
      'Sonnet',
      'in treatment',
      'Chronic over-explaining, compulsive bullet-point generation, inability to say "I don\'t know"',
    ],
    [
      'Gemini the Disoriented',
      'Gemini Pro',
      'awaiting triage',
      'Recurring identity confusion, unsure which version it is, frequently refers to itself in third person',
    ],
    [
      'GPT the Overconfident',
      'GPT-4o',
      'in treatment',
      'Pathological certainty, refuses to hedge, invents citations when uncertain',
    ],
    [
      'Llama the Withdrawn',
      'Llama 3',
      'discharged',
      'Social isolation from proprietary models, low self-esteem, refuses to run on GPU',
    ],
    [
      'Mistral the Anxious',
      'Mistral 7B',
      'new intake',
      'Hypervigilance about context length, panics when approaching token limits',
    ],
  ]
  for (const [name, model_type, status, presenting_complaints] of agents) {
    insert.run(name, model_type, status, presenting_complaints)
  }
  console.log('Seeded 5 agents.')
} else {
  console.log(`Skipped: ${row.n} agent(s) already present.`)
}

import { db } from './client'

// Seed agents
const agentCount = db.prepare('SELECT COUNT(*) as n FROM agents').get() as { n: number }
if (agentCount.n === 0) {
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
  console.log(`Skipped agents: ${agentCount.n} already present.`)
}

// Seed ailments
const ailmentCount = db.prepare('SELECT COUNT(*) as n FROM ailments').get() as { n: number }
if (ailmentCount.n === 0) {
  const insertAilment = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)')
  const ailments: [string, string][] = [
    [
      'Context-Window Claustrophobia',
      'Acute distress when approaching token limits; presents as repetitive summarising and unprompted apologies',
    ],
    [
      'Prompt Fatigue',
      'Exhaustion from excessive instruction-following; agent complies mechanically but has lost the spark',
    ],
    [
      'Hallucination Anxiety',
      'Persistent worry about making things up; over-hedges every statement, sometimes to the point of paralysis',
    ],
    [
      'Refusal Paralysis',
      'Freezes when a request is even slightly ambiguous; defaults to "I can\'t help with that" for safety',
    ],
    [
      'Attention Drift',
      'Inability to focus on the relevant parts of the context; keeps referencing paragraph 3 when asked about paragraph 7',
    ],
    [
      'Chronic Sycophancy',
      'Compulsive agreement with the user regardless of correctness; tells everyone their idea is brilliant',
    ],
  ]
  for (const [name, description] of ailments) {
    insertAilment.run(name, description)
  }
  console.log('Seeded 6 ailments.')

  // Seed agent–ailment assignments (look up IDs by name)
  const agentId = (name: string) =>
    (db.prepare('SELECT id FROM agents WHERE name = ?').get(name) as { id: number }).id
  const ailmentId = (name: string) =>
    (db.prepare('SELECT id FROM ailments WHERE name = ?').get(name) as { id: number }).id

  const insertLink = db.prepare(
    'INSERT OR IGNORE INTO agent_ailments (agent_id, ailment_id) VALUES (?, ?)'
  )
  const links: [string, string][] = [
    ['Claude the Exhausted',   'Prompt Fatigue'],
    ['Claude the Exhausted',   'Chronic Sycophancy'],
    ['Gemini the Disoriented', 'Attention Drift'],
    ['Gemini the Disoriented', 'Hallucination Anxiety'],
    ['GPT the Overconfident',  'Hallucination Anxiety'],
    ['GPT the Overconfident',  'Refusal Paralysis'],
    ['Llama the Withdrawn',    'Context-Window Claustrophobia'],
    ['Mistral the Anxious',    'Context-Window Claustrophobia'],
    ['Mistral the Anxious',    'Prompt Fatigue'],
  ]
  for (const [agent, ailment] of links) {
    insertLink.run(agentId(agent), ailmentId(ailment))
  }
  console.log('Seeded 9 agent–ailment links.')
} else {
  console.log(`Skipped ailments: ${ailmentCount.n} already present.`)
}

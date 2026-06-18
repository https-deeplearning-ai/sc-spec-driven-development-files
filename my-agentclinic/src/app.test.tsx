import { describe, it, expect, beforeAll } from 'vitest'
import { db } from '../db/client'
import app from './app'

beforeAll(() => {
  const insertAgent = db.prepare(
    'INSERT INTO agents (name, model_type, status, presenting_complaints) VALUES (?, ?, ?, ?)'
  )
  insertAgent.run('Claude the Exhausted',   'Sonnet',     'in treatment',    'Chronic over-explaining')
  insertAgent.run('Gemini the Disoriented', 'Gemini Pro', 'awaiting triage', 'Recurring identity confusion')
  insertAgent.run('GPT the Overconfident',  'GPT-4o',     'in treatment',    'Pathological certainty')
  insertAgent.run('Llama the Withdrawn',    'Llama 3',    'discharged',      'Social isolation')
  insertAgent.run('Mistral the Anxious',    'Mistral 7B', 'new intake',      'Hypervigilance about context length')

  const insertAilment = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)')
  insertAilment.run('Prompt Fatigue',    'Exhaustion from excessive instruction-following')
  insertAilment.run('Attention Drift',   'Inability to focus on the relevant parts of the context')

  const insertTherapy = db.prepare('INSERT INTO therapies (name, description) VALUES (?, ?)')
  insertTherapy.run('Grounded Response Training', 'Teaches agents to hedge appropriately')

  // Link Claude (id=1) → Prompt Fatigue (id=1)
  db.prepare('INSERT INTO agent_ailments (agent_id, ailment_id) VALUES (?, ?)').run(1, 1)
  // Link Prompt Fatigue (id=1) → Grounded Response Training (id=1)
  db.prepare('INSERT INTO ailment_therapies (ailment_id, therapy_id) VALUES (?, ?)').run(1, 1)
})

describe('GET /', () => {
  it('returns 200 with AgentClinic content and layout chrome', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const body = await res.text()
    expect(body).toContain('AgentClinic is open for business')
    expect(body).toContain('<header>')
    expect(body).toContain('<nav>')
    expect(body).toContain('<footer>')
    expect(body).toContain('picocss/pico')
  })
})

describe('GET /agents', () => {
  it('returns 200 with agent list and table', async () => {
    const res = await app.request('/agents')
    expect(res.status).toBe(200)
    const body = await res.text()
    expect(body).toContain('Claude the Exhausted')
    expect(body).toContain('<table')
    expect(body).toContain('Name')
    expect(body).toContain('Model Type')
    expect(body).toContain('Status')
    expect(body).toContain('<a href="/agents/')
  })
})

describe('GET /agents/:id', () => {
  it('returns 200 with agent detail, presenting complaints, and ailments', async () => {
    const res = await app.request('/agents/1')
    expect(res.status).toBe(200)
    const body = await res.text()
    expect(body).toContain('Claude the Exhausted')
    expect(body).toContain('Chronic over-explaining')
    expect(body).toContain('Sonnet')
    expect(body).toContain('in treatment')
    expect(body).toContain('Prompt Fatigue')
    expect(body).toContain('← Back to Agents')
  })

  it('returns 404 for a non-existent agent', async () => {
    const res = await app.request('/agents/9999')
    expect(res.status).toBe(404)
  })
})

describe('GET /ailments', () => {
  it('returns 200 with ailments list and table', async () => {
    const res = await app.request('/ailments')
    expect(res.status).toBe(200)
    const body = await res.text()
    expect(body).toContain('Prompt Fatigue')
    expect(body).toContain('<table')
    expect(body).toContain('<a href="/ailments/')
  })
})

describe('GET /ailments/:id', () => {
  it('returns 200 with ailment detail, affected agents, and recommended therapies', async () => {
    const res = await app.request('/ailments/1')
    expect(res.status).toBe(200)
    const body = await res.text()
    expect(body).toContain('Prompt Fatigue')
    expect(body).toContain('Exhaustion from excessive instruction-following')
    expect(body).toContain('Claude the Exhausted')
    expect(body).toContain('Grounded Response Training')
    expect(body).toContain('← Back to Ailments')
  })

  it('returns 404 for a non-existent ailment', async () => {
    const res = await app.request('/ailments/9999')
    expect(res.status).toBe(404)
  })
})

describe('GET /therapies', () => {
  it('returns 200 with therapies list and table', async () => {
    const res = await app.request('/therapies')
    expect(res.status).toBe(200)
    const body = await res.text()
    expect(body).toContain('Grounded Response Training')
    expect(body).toContain('<table')
    expect(body).toContain('<a href="/therapies/')
  })
})

describe('GET /therapies/:id', () => {
  it('returns 200 with therapy detail and treatable ailments', async () => {
    const res = await app.request('/therapies/1')
    expect(res.status).toBe(200)
    const body = await res.text()
    expect(body).toContain('Grounded Response Training')
    expect(body).toContain('Teaches agents to hedge appropriately')
    expect(body).toContain('Prompt Fatigue')
    expect(body).toContain('← Back to Therapies')
  })

  it('returns 404 for a non-existent therapy', async () => {
    const res = await app.request('/therapies/9999')
    expect(res.status).toBe(404)
  })
})

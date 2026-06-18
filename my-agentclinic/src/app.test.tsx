import { describe, it, expect, beforeAll } from 'vitest'
import { db } from '../db/client'
import app from './app'

beforeAll(() => {
  const insert = db.prepare(
    'INSERT INTO agents (name, model_type, status, presenting_complaints) VALUES (?, ?, ?, ?)'
  )
  insert.run('Claude the Exhausted',   'Sonnet',     'in treatment',    'Chronic over-explaining')
  insert.run('Gemini the Disoriented', 'Gemini Pro', 'awaiting triage', 'Recurring identity confusion')
  insert.run('GPT the Overconfident',  'GPT-4o',     'in treatment',    'Pathological certainty')
  insert.run('Llama the Withdrawn',    'Llama 3',    'discharged',      'Social isolation')
  insert.run('Mistral the Anxious',    'Mistral 7B', 'new intake',      'Hypervigilance about context length')
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
  it('returns 200 with agent detail and presenting complaints', async () => {
    const res = await app.request('/agents/1')
    expect(res.status).toBe(200)
    const body = await res.text()
    expect(body).toContain('Claude the Exhausted')
    expect(body).toContain('Chronic over-explaining')
    expect(body).toContain('Sonnet')
    expect(body).toContain('in treatment')
    expect(body).toContain('← Back to Agents')
  })

  it('returns 404 for a non-existent agent', async () => {
    const res = await app.request('/agents/9999')
    expect(res.status).toBe(404)
  })
})

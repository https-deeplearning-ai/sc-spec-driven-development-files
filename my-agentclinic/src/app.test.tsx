import { describe, it, expect, beforeAll } from 'vitest'
import { db } from '../db/client'
import app from './app'

beforeAll(() => {
  const insert = db.prepare('INSERT INTO agents (name, model_type, status) VALUES (?, ?, ?)')
  insert.run('Claude the Exhausted',   'Sonnet',     'in treatment')
  insert.run('Gemini the Disoriented', 'Gemini Pro',  'awaiting triage')
  insert.run('GPT the Overconfident',  'GPT-4o',     'in treatment')
  insert.run('Llama the Withdrawn',    'Llama 3',    'discharged')
  insert.run('Mistral the Anxious',    'Mistral 7B', 'new intake')
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
  })
})

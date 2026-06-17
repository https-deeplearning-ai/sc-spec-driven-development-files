import { describe, it, expect } from 'vitest'
import app from './app'

describe('GET /', () => {
  it('returns 200 with AgentClinic content', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const body = await res.text()
    expect(body).toContain('AgentClinic is open for business')
  })
})

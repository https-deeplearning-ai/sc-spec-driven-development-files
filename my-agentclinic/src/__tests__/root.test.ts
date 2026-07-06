import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('GET /', () => {
  it('returns 200 with the welcome message inside the layout', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.text).toContain('AgentClinic is open for business')
    expect(res.text).toContain('<header>')
    expect(res.text).toContain('<main>')
    expect(res.text).toContain('<footer>')
    expect(res.text).toContain('href="/styles.css"')
  })
})

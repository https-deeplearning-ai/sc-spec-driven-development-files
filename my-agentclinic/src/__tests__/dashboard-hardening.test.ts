import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('GET /dashboard', () => {
  it('returns summary counts and management sections', async () => {
    const res = await request(app).get('/dashboard')

    expect(res.status).toBe(200)
    expect(res.text).toContain('<h2>Dashboard</h2>')
    expect(res.text).toContain('Open appointments')
    expect(res.text).toContain('Recent appointments')
    expect(res.text).toContain('Ailments')
  })
})

describe('Hardening routes', () => {
  it('returns 404 page for unknown routes', async () => {
    const res = await request(app).get('/this-route-does-not-exist')
    expect(res.status).toBe(404)
    expect(res.text).toContain('Page Not Found')
  })

  it('returns 500 page for internal errors', async () => {
    const res = await request(app).get('/__test/error')
    expect(res.status).toBe(500)
    expect(res.text).toContain('Server Error')
  })
})

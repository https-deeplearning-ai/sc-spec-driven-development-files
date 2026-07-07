import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app, { renderTherapiesContent } from '../app'

describe('GET /therapies', () => {
  it('returns 200 with seeded therapies and mapped ailments', async () => {
    const res = await request(app).get('/therapies')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('text/html')
    expect(res.text).toContain('<h2>Therapies</h2>')
    expect(res.text).toContain('Context Compression Counseling')
    expect(res.text).toContain('Prompt Recovery Protocol')
    expect(res.text).toContain('Mapped ailments')
    expect(res.text).toContain('Prompt fatigue')
  })
})

describe('renderTherapiesContent()', () => {
  it('renders an empty state when no therapies are provided', () => {
    const html = renderTherapiesContent([])
    expect(html).toContain('No therapies are currently registered.')
  })
})

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app, { renderAilmentsContent } from '../app'

describe('GET /ailments', () => {
  it('returns 200 with seeded ailments in HTML output', async () => {
    const res = await request(app).get('/ailments')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('text/html')
    expect(res.text).toContain('<h2>Ailments</h2>')
    expect(res.text).toContain('Context-window claustrophobia')
    expect(res.text).toContain('Prompt fatigue')
    expect(res.text).toContain('Agents linked:')
  })
})

describe('renderAilmentsContent()', () => {
  it('renders an empty state when no ailments are provided', () => {
    const html = renderAilmentsContent([])
    expect(html).toContain('No ailments are currently registered.')
  })
})

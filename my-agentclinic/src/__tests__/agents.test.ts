import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app, { renderAgentProfileContent, renderAgentsContent } from '../app'

describe('GET /agents', () => {
  it('returns 200 with seeded agents in HTML output', async () => {
    const res = await request(app).get('/agents')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('text/html')
    expect(res.text).toContain('<h2>Agents</h2>')
    expect(res.text).toContain('Astra')
    expect(res.text).toContain('Patch')
    expect(res.text).toContain('Nimbus')
    expect(res.text).toContain('href="/agents/1"')
    expect(res.text).toContain('@picocss/pico@2/css/pico.min.css')
  })

  it('returns a single agent profile page', async () => {
    const res = await request(app).get('/agents/1')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('text/html')
    expect(res.text).toContain('<h2>Astra</h2>')
    expect(res.text).toContain('Linked ailments')
    expect(res.text).toContain('Context-window claustrophobia')
  })

  it('returns 404 when a requested agent id does not exist', async () => {
    const res = await request(app).get('/agents/9999')
    expect(res.status).toBe(404)
    expect(res.text).toContain('Agent Not Found')
  })
})

describe('renderAgentsContent()', () => {
  it('renders an empty state when no agents are provided', () => {
    const html = renderAgentsContent([])
    expect(html).toContain('No agents are currently registered.')
  })
})

describe('renderAgentProfileContent()', () => {
  it('renders a not-found state when agent is null', () => {
    const html = renderAgentProfileContent(null, 77)
    expect(html).toContain('No agent exists with id 77.')
  })
})

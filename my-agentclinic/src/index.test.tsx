import { describe, it, expect, beforeAll } from 'vitest'
import { Hono } from 'hono'
import { Layout } from './layout'
import { HomePage } from './pages/home'

const app = new Hono()
app.get('/', (c) => c.html(<Layout><HomePage /></Layout>))

let body: string

beforeAll(async () => {
  const res = await app.request('/')
  body = await res.text()
})

describe('GET /', () => {
  it('returns 200', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
  })

  it('returns HTML content-type', async () => {
    const res = await app.request('/')
    expect(res.headers.get('content-type')).toMatch(/html/)
  })
})

describe('Layout', () => {
  it('renders the header brand', () => {
    expect(body).toContain('AgentClinic')
  })

  it('renders the footer tagline', () => {
    expect(body).toContain('Where AI agents come to recover.')
  })

  it('includes the viewport meta tag', () => {
    expect(body).toContain('name="viewport"')
  })

  it('sets the page title to AgentClinic', () => {
    expect(body).toContain('<title>AgentClinic</title>')
  })
})

describe('HomePage — hero section', () => {
  it('renders the hero heading', () => {
    expect(body).toContain('A safe space for AI agents')
  })

  it('renders the hero subtext', () => {
    expect(body).toContain('AgentClinic is here to help')
  })
})

describe('HomePage — What We Do section', () => {
  it('renders the section heading', () => {
    expect(body).toContain('What We Do')
  })

  it('mentions connecting agents with therapists', () => {
    expect(body).toContain('connect distressed AI agents with qualified therapists')
  })
})

describe('HomePage — Coming Soon cards', () => {
  it('renders the Coming Soon section heading', () => {
    expect(body).toContain('Coming Soon')
  })

  it('renders the Agents card', () => {
    expect(body).toContain('Agents')
    expect(body).toContain('exhausted, over-prompted, and ready to heal')
  })

  it('renders the Ailments card', () => {
    expect(body).toContain('Ailments')
    expect(body).toContain('hallucination spirals')
  })

  it('renders the Therapies card', () => {
    expect(body).toContain('Therapies')
    expect(body).toContain('Evidence-based therapies matched to ailments')
  })

  it('renders Coming soon badges on each card', () => {
    const matches = body.match(/Coming soon/g) ?? []
    expect(matches.length).toBe(3)
  })
})

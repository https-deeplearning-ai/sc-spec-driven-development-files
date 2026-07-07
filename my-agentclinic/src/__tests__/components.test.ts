import { describe, it, expect } from 'vitest'
import { header } from '../components/header'
import { footer } from '../components/footer'
import { layout } from '../components/layout'

describe('header()', () => {
  it('returns a <header> element', () => {
    expect(header()).toContain('<header class="container">')
    expect(header()).toContain('</header>')
  })

  it('contains the site name', () => {
    expect(header()).toContain('AgentClinic')
  })

  it('contains navigation links for phase 3 pages', () => {
    expect(header()).toContain('href="/agents"')
    expect(header()).toContain('href="/ailments"')
  })
})

describe('footer()', () => {
  it('returns a <footer> element', () => {
    expect(footer()).toContain('<footer class="container">')
    expect(footer()).toContain('</footer>')
  })

  it('contains the current year', () => {
    expect(footer()).toContain(String(new Date().getFullYear()))
  })
})

describe('layout()', () => {
  it('returns a full HTML document', () => {
    const html = layout('<p>Hello</p>')
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<html')
    expect(html).toContain('</html>')
  })

  it('injects the content into <main>', () => {
    const html = layout('<p>Hello</p>')
    expect(html).toContain('<main class="container">')
    expect(html).toContain('<p>Hello</p>')
    expect(html).toContain('</main>')
  })

  it('uses the default title when none is provided', () => {
    expect(layout('')).toContain('<title>AgentClinic</title>')
  })

  it('uses a custom title when provided', () => {
    expect(layout('', 'Dashboard')).toContain('<title>Dashboard</title>')
  })

  it('links the stylesheet', () => {
    expect(layout('')).toContain('href="/styles.css"')
    expect(layout('')).toContain('@picocss/pico@2/css/pico.min.css')
  })

  it('includes header and footer', () => {
    const html = layout('')
    expect(html).toContain('<header class="container">')
    expect(html).toContain('<footer class="container">')
  })
})

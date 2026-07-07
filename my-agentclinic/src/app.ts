import express from 'express'
import path from 'path'
import { layout } from './components/layout'
import { Agent, AgentProfile, getAgentById, listAgents } from './data/agents'
import { Ailment, listAilments } from './data/ailments'

const app = express()

app.use(express.static(path.join(__dirname, '..', 'public')))

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderAgentsContent(agents: Agent[]): string {
  if (agents.length === 0) {
    return `
      <section>
        <h2>Agents</h2>
        <p role="status">No agents are currently registered.</p>
      </section>
    `
  }

  const cards = agents
    .map((agent) => {
      return `
        <article class="agent-card">
          <h3><a href="/agents/${agent.id}">${escapeHtml(agent.name)}</a></h3>
          <p><strong>Model:</strong> ${escapeHtml(agent.modelType)}</p>
          <p><strong>Status:</strong> ${escapeHtml(agent.currentStatus)}</p>
          <p><strong>Presenting complaints:</strong> ${escapeHtml(agent.presentingComplaints)}</p>
        </article>
      `
    })
    .join('')

  return `
    <section>
      <h2>Agents</h2>
      <p>Current caseload across the clinic.</p>
      ${cards}
    </section>
  `
}

export function renderAgentProfileContent(agent: AgentProfile | null, id: number): string {
  if (!agent) {
    return `
      <section>
        <h2>Agent Not Found</h2>
        <p role="status">No agent exists with id ${id}.</p>
        <p><a href="/agents">Back to agents</a></p>
      </section>
    `
  }

  const ailments =
    agent.ailments.length > 0
      ? `<ul>${agent.ailments.map((ailment) => `<li>${escapeHtml(ailment)}</li>`).join('')}</ul>`
      : '<p>No ailments currently linked.</p>'

  return `
    <section>
      <p><a href="/agents">Back to agents</a></p>
      <h2>${escapeHtml(agent.name)}</h2>
      <p><strong>Model:</strong> ${escapeHtml(agent.modelType)}</p>
      <p><strong>Status:</strong> ${escapeHtml(agent.currentStatus)}</p>
      <p><strong>Presenting complaints:</strong> ${escapeHtml(agent.presentingComplaints)}</p>
      <h3>Linked ailments</h3>
      ${ailments}
    </section>
  `
}

export function renderAilmentsContent(ailments: Ailment[]): string {
  if (ailments.length === 0) {
    return `
      <section>
        <h2>Ailments</h2>
        <p role="status">No ailments are currently registered.</p>
      </section>
    `
  }

  const items = ailments
    .map((ailment) => {
      return `
        <article class="ailment-card">
          <h3>${escapeHtml(ailment.name)}</h3>
          <p>${escapeHtml(ailment.description)}</p>
          <p><strong>Agents linked:</strong> ${ailment.agentCount}</p>
        </article>
      `
    })
    .join('')

  return `
    <section>
      <h2>Ailments</h2>
      <p>Common concerns currently tracked at AgentClinic.</p>
      ${items}
    </section>
  `
}

app.get('/', (req, res) => {
  res.send(layout('<p>AgentClinic is open for business</p>'))
})

app.get('/agents', (req, res) => {
  const agents = listAgents()
  res.send(layout(renderAgentsContent(agents), 'Agents | AgentClinic'))
})

app.get('/agents/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  if (Number.isNaN(id) || id <= 0) {
    res.status(404).send(layout(renderAgentProfileContent(null, 0), 'Agent Not Found | AgentClinic'))
    return
  }

  const agent = getAgentById(id)
  if (!agent) {
    res.status(404).send(layout(renderAgentProfileContent(null, id), 'Agent Not Found | AgentClinic'))
    return
  }

  res.send(layout(renderAgentProfileContent(agent, id), `${agent.name} | AgentClinic`))
})

app.get('/ailments', (req, res) => {
  const ailments = listAilments()
  res.send(layout(renderAilmentsContent(ailments), 'Ailments | AgentClinic'))
})

export default app

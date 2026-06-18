import { Layout } from '../components/Layout'
import type { Agent } from './Agents'

export function AgentDetail({ agent }: { agent: Agent }) {
  return (
    <Layout title={agent.name}>
      <h1>{agent.name}</h1>
      <dl>
        <dt>Model Type</dt>
        <dd>{agent.model_type}</dd>
        <dt>Status</dt>
        <dd>{agent.status}</dd>
        <dt>Presenting Complaints</dt>
        <dd>{agent.presenting_complaints ?? 'None recorded'}</dd>
      </dl>
      <a href="/agents">← Back to Agents</a>
    </Layout>
  )
}

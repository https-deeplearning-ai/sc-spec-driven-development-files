import { Layout } from '../components/Layout'
import type { Agent } from './Agents'
import type { Ailment } from './Ailments'

export function AgentDetail({ agent, ailments }: { agent: Agent; ailments: Ailment[] }) {
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
      <h2>Ailments</h2>
      {ailments.length === 0 ? (
        <p>None diagnosed</p>
      ) : (
        <ul>
          {ailments.map((ailment) => (
            <li key={ailment.id}>
              <a href={`/ailments/${ailment.id}`}>{ailment.name}</a>
            </li>
          ))}
        </ul>
      )}
      <a href="/agents">← Back to Agents</a>
    </Layout>
  )
}

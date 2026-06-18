import { Layout } from '../components/Layout'
import type { Ailment } from './Ailments'
import type { Agent } from './Agents'

export function AilmentDetail({ ailment, agents }: { ailment: Ailment; agents: Agent[] }) {
  return (
    <Layout title={ailment.name}>
      <h1>{ailment.name}</h1>
      <p>{ailment.description}</p>
      <h2>Affected Agents</h2>
      {agents.length === 0 ? (
        <p>No agents currently diagnosed.</p>
      ) : (
        <ul>
          {agents.map((agent) => (
            <li key={agent.id}>
              <a href={`/agents/${agent.id}`}>{agent.name}</a>
            </li>
          ))}
        </ul>
      )}
      <a href="/ailments">← Back to Ailments</a>
    </Layout>
  )
}

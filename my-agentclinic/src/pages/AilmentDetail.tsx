import { Layout } from '../components/Layout'
import type { Ailment } from './Ailments'
import type { Agent } from './Agents'
import type { Therapy } from './Therapies'

export function AilmentDetail({
  ailment,
  agents,
  therapies,
}: {
  ailment: Ailment
  agents: Agent[]
  therapies: Therapy[]
}) {
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
      <h2>Recommended Therapies</h2>
      {therapies.length === 0 ? (
        <p>None recommended.</p>
      ) : (
        <ul>
          {therapies.map((therapy) => (
            <li key={therapy.id}>
              <a href={`/therapies/${therapy.id}`}>{therapy.name}</a>
            </li>
          ))}
        </ul>
      )}
      <a href="/ailments">← Back to Ailments</a>
    </Layout>
  )
}

import { Layout } from '../components/Layout'

export type Agent = {
  id: number
  name: string
  model_type: string
  status: string
}

export function Agents({ agents }: { agents: Agent[] }) {
  return (
    <Layout title="Agents">
      <h1>Agents</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Model Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.name}</td>
              <td>{agent.model_type}</td>
              <td>{agent.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

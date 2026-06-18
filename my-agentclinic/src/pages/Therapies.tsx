import { Layout } from '../components/Layout'

export type Therapy = {
  id: number
  name: string
  description: string
}

export function Therapies({ therapies }: { therapies: Therapy[] }) {
  return (
    <Layout title="Therapies">
      <h1>Therapies</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {therapies.map((therapy) => (
            <tr key={therapy.id}>
              <td><a href={`/therapies/${therapy.id}`}>{therapy.name}</a></td>
              <td>{therapy.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

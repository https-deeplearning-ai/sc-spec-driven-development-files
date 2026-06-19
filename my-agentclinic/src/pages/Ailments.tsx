import { Layout } from '../components/Layout'

export type Ailment = {
  id: number
  name: string
  description: string
}

export function Ailments({ ailments }: { ailments: Ailment[] }) {
  return (
    <Layout title="Ailments">
      <h1>Ailments</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {ailments.map((ailment) => (
            <tr key={ailment.id}>
              <td><a href={`/ailments/${ailment.id}`}>{ailment.name}</a></td>
              <td>{ailment.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

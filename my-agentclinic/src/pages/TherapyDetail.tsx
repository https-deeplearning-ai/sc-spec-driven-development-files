import { Layout } from '../components/Layout'
import type { Therapy } from './Therapies'
import type { Ailment } from './Ailments'

export function TherapyDetail({ therapy, ailments }: { therapy: Therapy; ailments: Ailment[] }) {
  return (
    <Layout title={therapy.name}>
      <h1>{therapy.name}</h1>
      <p>{therapy.description}</p>
      <h2>Treats</h2>
      {ailments.length === 0 ? (
        <p>No ailments currently mapped.</p>
      ) : (
        <ul>
          {ailments.map((ailment) => (
            <li key={ailment.id}>
              <a href={`/ailments/${ailment.id}`}>{ailment.name}</a>
            </li>
          ))}
        </ul>
      )}
      <a href="/therapies">← Back to Therapies</a>
    </Layout>
  )
}

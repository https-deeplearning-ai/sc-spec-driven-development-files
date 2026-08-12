import { Layout } from "../components/Layout";
import type { Ailment } from "../types";

type AilmentsProps = {
  ailments: Ailment[];
};

export function Ailments({ ailments }: AilmentsProps) {
  return (
    <Layout>
      <h1>Ailments</h1>
      <ul>
        {ailments.map((ailment) => (
          <li>
            <strong>{ailment.name}</strong> — {ailment.description}
          </li>
        ))}
      </ul>
    </Layout>
  );
}

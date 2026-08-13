import { FC } from "hono/jsx";
import { Layout } from "./Layout";
import type { Therapy } from "../db/types";

type TherapiesListProps = { therapies: Therapy[] };

export const TherapiesList: FC<TherapiesListProps> = ({ therapies }) => (
  <Layout>
    <h1>Therapies</h1>
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        {therapies.map((t) => (
          <tr key={t.id}>
            <td>{t.name}</td>
            <td>{t.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Layout>
);

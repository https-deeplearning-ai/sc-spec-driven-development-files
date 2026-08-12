import { Layout } from "../components/Layout";
import type { Agent, Ailment } from "../types";

type AgentDetailProps = {
  agent: Agent;
  ailments?: Ailment[];
};

export function AgentDetail({ agent, ailments = [] }: AgentDetailProps) {
  return (
    <Layout>
      <h1>{agent.name}</h1>
      <dl>
        <dt>Model type</dt>
        <dd>{agent.model_type}</dd>
        <dt>Status</dt>
        <dd>{agent.status}</dd>
      </dl>
      <h2>Presenting Complaints</h2>
      {ailments.length === 0 ? (
        <p>No presenting complaints on file.</p>
      ) : (
        <ul>
          {ailments.map((ailment) => (
            <li>
              <strong>{ailment.name}</strong> — {ailment.description}
            </li>
          ))}
        </ul>
      )}
      <p>
        <a href="/agents">Back to Agents</a>
      </p>
    </Layout>
  );
}

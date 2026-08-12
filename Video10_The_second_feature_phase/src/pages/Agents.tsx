import { Layout } from "../components/Layout";
import type { Agent } from "../types";

type AgentsProps = {
  agents: Agent[];
};

export function Agents({ agents }: AgentsProps) {
  return (
    <Layout>
      <h1>Agents</h1>
      <ul>
        {agents.map((agent) => (
          <li>
            <a href={`/agents/${agent.id}`}>{agent.name}</a> — {agent.model_type} — {agent.status}
          </li>
        ))}
      </ul>
    </Layout>
  );
}

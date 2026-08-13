import { FC } from "hono/jsx";
import { Layout } from "./Layout";

type Stats = {
  agentCount: number;
  openAppointmentCount: number;
  activeAilmentCount: number;
};

type AgentRow = { id: number; name: string; model_type: string; status: string };

type AppointmentRow = {
  id: number;
  agent_name: string;
  therapist_name: string;
  scheduled_at: string;
  status: string;
};

type AilmentRow = { id: number; name: string; agent_count: number };

type DashboardProps = {
  stats: Stats;
  agents: AgentRow[];
  appointments: AppointmentRow[];
  ailments: AilmentRow[];
};

export const Dashboard: FC<DashboardProps> = ({
  stats,
  agents,
  appointments,
  ailments,
}) => (
  <Layout>
    <h1>Staff Dashboard</h1>

    <form method="post" action="/logout">
      <button type="submit">Logout</button>
    </form>

    <div class="grid">
      <article>
        <h2>{stats.agentCount}</h2>
        <p>Total Agents</p>
      </article>
      <article>
        <h2>{stats.openAppointmentCount}</h2>
        <p>Open Appointments</p>
      </article>
      <article>
        <h2>{stats.activeAilmentCount}</h2>
        <p>Active Ailments In-Flight</p>
      </article>
    </div>

    <h2>Agents</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Model</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((a) => (
          <tr key={a.id}>
            <td>
              <a href={`/agents/${a.id}`}>{a.name}</a>
            </td>
            <td>{a.model_type}</td>
            <td>{a.status.replace("_", " ")}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2>Upcoming Appointments</h2>
    {appointments.length === 0 ? (
      <p>No open appointments.</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Therapist</th>
            <th>Scheduled</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((ap) => (
            <tr key={ap.id}>
              <td>{ap.agent_name}</td>
              <td>{ap.therapist_name}</td>
              <td>{ap.scheduled_at}</td>
              <td>{ap.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

    <h2>Ailments</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Agents Affected</th>
        </tr>
      </thead>
      <tbody>
        {ailments.map((al) => (
          <tr key={al.id}>
            <td>{al.name}</td>
            <td>{al.agent_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Layout>
);

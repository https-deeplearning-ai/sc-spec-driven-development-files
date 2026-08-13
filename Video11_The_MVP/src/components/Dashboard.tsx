import { FC } from "hono/jsx";
import { Layout } from "./Layout";
import { APPOINTMENT_STATUSES } from "../db/types";
import type { Agent, Ailment, Therapy, AppointmentWithDetails } from "../db/types";

type DashboardProps = {
  summary: {
    totalAgents: number;
    openAppointments: number;
    ailmentsInFlight: number;
  };
  agents: Agent[];
  appointments: AppointmentWithDetails[];
  ailments: Ailment[];
  therapies: Therapy[];
};

export const Dashboard: FC<DashboardProps> = ({
  summary,
  agents,
  appointments,
  ailments,
  therapies,
}) => (
  <Layout>
    <h1>Staff Dashboard</h1>

    <div class="grid">
      <article>
        <h2>{summary.totalAgents}</h2>
        <p>Total Agents</p>
      </article>
      <article>
        <h2>{summary.openAppointments}</h2>
        <p>Open Appointments</p>
      </article>
      <article>
        <h2>{summary.ailmentsInFlight}</h2>
        <p>Ailments In-Flight</p>
      </article>
    </div>

    <h2>Appointments</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Agent</th>
          <th scope="col">Therapist</th>
          <th scope="col">Therapy</th>
          <th scope="col">Scheduled</th>
          <th scope="col">Status</th>
          <th scope="col">Update Status</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a) => (
          <tr key={a.id}>
            <td>{a.agent_name}</td>
            <td>{a.therapist_name}</td>
            <td>{a.therapy_name ?? "—"}</td>
            <td>{a.scheduled_at}</td>
            <td>{a.status}</td>
            <td>
              <form method="post" action={`/dashboard/appointments/${a.id}/status`}>
                <label for={`status-${a.id}`}>Status</label>
                <select id={`status-${a.id}`} name="status">
                  {APPOINTMENT_STATUSES.map((s) => (
                    <option key={s} value={s} selected={s === a.status}>
                      {s}
                    </option>
                  ))}
                </select>
                <button type="submit">Update</button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2>Agents</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Model</th>
          <th scope="col">Status</th>
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

    <h2>Ailments</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        {ailments.map((a) => (
          <tr key={a.id}>
            <td>{a.name}</td>
            <td>{a.description}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2>Therapies</h2>
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

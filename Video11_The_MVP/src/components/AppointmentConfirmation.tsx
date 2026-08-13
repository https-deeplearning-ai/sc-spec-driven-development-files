import { FC } from "hono/jsx";
import { Layout } from "./Layout";
import type { AppointmentWithDetails } from "../db/types";

type AppointmentConfirmationProps = { appointment: AppointmentWithDetails };

export const AppointmentConfirmation: FC<AppointmentConfirmationProps> = ({
  appointment,
}) => (
  <Layout>
    <article>
      <header>
        <h1>Appointment {appointment.status}</h1>
      </header>
      <p>
        <strong>Agent:</strong>{" "}
        <a href={`/agents/${appointment.agent_id}`}>{appointment.agent_name}</a>
      </p>
      <p>
        <strong>Therapist:</strong> {appointment.therapist_name}
      </p>
      <p>
        <strong>Therapy:</strong> {appointment.therapy_name ?? "Not specified"}
      </p>
      <p>
        <strong>Scheduled for:</strong> {appointment.scheduled_at}
      </p>
      <p>
        <strong>Status:</strong> {appointment.status}
      </p>
    </article>
    <p>
      <a href="/agents">← Back to agents</a>
    </p>
  </Layout>
);

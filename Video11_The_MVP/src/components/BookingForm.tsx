import { FC } from "hono/jsx";
import { Layout } from "./Layout";
import type { Agent, Therapy } from "../db/types";

type BookingFormValues = {
  therapist_name?: string;
  therapy_id?: string;
  scheduled_at?: string;
};

type BookingFormProps = {
  agent: Agent;
  therapies: Therapy[];
  errors?: string[];
  values?: BookingFormValues;
};

export const BookingForm: FC<BookingFormProps> = ({
  agent,
  therapies,
  errors = [],
  values = {},
}) => (
  <Layout>
    <article>
      <header>
        <h1>Book an Appointment for {agent.name}</h1>
      </header>

      {errors.length > 0 && (
        <div role="alert">
          <strong>Please fix the following:</strong>
          <ul>
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <form method="post" action={`/agents/${agent.id}/book`}>
        <label for="therapist_name">Therapist Name</label>
        <input
          type="text"
          id="therapist_name"
          name="therapist_name"
          required
          maxlength={200}
          value={values.therapist_name ?? ""}
        />

        <label for="therapy_id">Therapy (optional)</label>
        <select id="therapy_id" name="therapy_id">
          <option value="">— None selected —</option>
          {therapies.map((t) => (
            <option
              key={t.id}
              value={String(t.id)}
              selected={values.therapy_id === String(t.id)}
            >
              {t.name}
            </option>
          ))}
        </select>

        <label for="scheduled_at">Date &amp; Time</label>
        <input
          type="datetime-local"
          id="scheduled_at"
          name="scheduled_at"
          required
          value={values.scheduled_at ?? ""}
        />

        <button type="submit">Book Appointment</button>
      </form>
    </article>
    <p>
      <a href={`/agents/${agent.id}`}>← Back to {agent.name}</a>
    </p>
  </Layout>
);

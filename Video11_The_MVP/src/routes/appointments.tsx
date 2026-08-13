import { Hono } from "hono";
import type Database from "better-sqlite3";
import { BookingForm } from "../components/BookingForm";
import { AppointmentConfirmation } from "../components/AppointmentConfirmation";
import type { Agent, Therapy, AppointmentWithDetails } from "../db/types";

const MAX_THERAPIST_NAME_LENGTH = 200;

export function appointmentsRouter(db: Database.Database) {
  const router = new Hono();

  const selectAgentById = db.prepare("SELECT * FROM agents WHERE id = ?");
  const selectAllTherapies = db.prepare("SELECT * FROM therapies ORDER BY name");
  const selectTherapyById = db.prepare("SELECT * FROM therapies WHERE id = ?");
  const insertAppointment = db.prepare(
    `INSERT INTO appointments (agent_id, therapist_name, therapy_id, scheduled_at, status)
     VALUES (@agent_id, @therapist_name, @therapy_id, @scheduled_at, 'requested')`
  );
  const selectAppointmentWithDetails = db.prepare(
    `SELECT a.*, ag.name AS agent_name, t.name AS therapy_name
     FROM appointments a
     JOIN agents ag ON ag.id = a.agent_id
     LEFT JOIN therapies t ON t.id = a.therapy_id
     WHERE a.id = ?`
  );

  router.get("/agents/:id/book", (c) => {
    const agentId = Number(c.req.param("id"));
    const agent = selectAgentById.get(agentId) as Agent | undefined;
    if (!agent) return c.notFound();
    const therapies = selectAllTherapies.all() as Therapy[];
    return c.html(<BookingForm agent={agent} therapies={therapies} />);
  });

  router.post("/agents/:id/book", async (c) => {
    const agentId = Number(c.req.param("id"));
    const agent = selectAgentById.get(agentId) as Agent | undefined;
    if (!agent) return c.notFound();

    const body = await c.req.parseBody();
    const therapistName = typeof body.therapist_name === "string" ? body.therapist_name.trim() : "";
    const therapyIdRaw = typeof body.therapy_id === "string" ? body.therapy_id.trim() : "";
    const scheduledAt = typeof body.scheduled_at === "string" ? body.scheduled_at.trim() : "";

    const errors: string[] = [];

    if (!therapistName) {
      errors.push("Therapist name is required.");
    } else if (therapistName.length > MAX_THERAPIST_NAME_LENGTH) {
      errors.push(`Therapist name must be ${MAX_THERAPIST_NAME_LENGTH} characters or fewer.`);
    }

    let therapyId: number | null = null;
    if (therapyIdRaw) {
      therapyId = Number(therapyIdRaw);
      const therapy = Number.isInteger(therapyId) ? selectTherapyById.get(therapyId) : undefined;
      if (!therapy) {
        errors.push("Selected therapy does not exist.");
      }
    }

    const parsedDate = scheduledAt ? new Date(scheduledAt) : null;
    if (!scheduledAt || !parsedDate || Number.isNaN(parsedDate.getTime())) {
      errors.push("A valid date and time is required.");
    } else if (parsedDate.getTime() <= Date.now()) {
      errors.push("The appointment must be scheduled in the future.");
    }

    if (errors.length > 0) {
      const therapies = selectAllTherapies.all() as Therapy[];
      return c.html(
        (
          <BookingForm
            agent={agent}
            therapies={therapies}
            errors={errors}
            values={{ therapist_name: therapistName, therapy_id: therapyIdRaw, scheduled_at: scheduledAt }}
          />
        ),
        422
      );
    }

    const result = insertAppointment.run({
      agent_id: agentId,
      therapist_name: therapistName,
      therapy_id: therapyId,
      scheduled_at: scheduledAt,
    });

    return c.redirect(`/appointments/${result.lastInsertRowid}`, 303);
  });

  router.get("/appointments/:id", (c) => {
    const id = Number(c.req.param("id"));
    const appointment = selectAppointmentWithDetails.get(id) as AppointmentWithDetails | undefined;
    if (!appointment) return c.notFound();
    return c.html(<AppointmentConfirmation appointment={appointment} />);
  });

  return router;
}

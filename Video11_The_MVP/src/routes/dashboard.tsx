import { Hono } from "hono";
import type Database from "better-sqlite3";
import { Dashboard } from "../components/Dashboard";
import { APPOINTMENT_STATUSES } from "../db/types";
import type {
  Agent,
  Ailment,
  Therapy,
  Appointment,
  AppointmentStatus,
  AppointmentWithDetails,
} from "../db/types";

const ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  requested: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function dashboardRouter(db: Database.Database) {
  const router = new Hono();

  const countAgents = db.prepare("SELECT COUNT(*) AS count FROM agents");
  const countOpenAppointments = db.prepare(
    "SELECT COUNT(*) AS count FROM appointments WHERE status IN ('requested', 'confirmed')"
  );
  const countAilmentsInFlight = db.prepare(
    `SELECT COUNT(DISTINCT aa.ailment_id) AS count
     FROM agent_ailments aa
     JOIN agents a ON a.id = aa.agent_id
     WHERE a.status = 'active'`
  );
  const selectAllAgents = db.prepare("SELECT * FROM agents ORDER BY name");
  const selectAllAilments = db.prepare("SELECT * FROM ailments ORDER BY name");
  const selectAllTherapies = db.prepare("SELECT * FROM therapies ORDER BY name");
  const selectAllAppointments = db.prepare(
    `SELECT a.*, ag.name AS agent_name, t.name AS therapy_name
     FROM appointments a
     JOIN agents ag ON ag.id = a.agent_id
     LEFT JOIN therapies t ON t.id = a.therapy_id
     ORDER BY a.scheduled_at`
  );
  const selectAppointmentById = db.prepare("SELECT * FROM appointments WHERE id = ?");
  const updateAppointmentStatus = db.prepare(
    "UPDATE appointments SET status = ? WHERE id = ?"
  );

  router.get("/", (c) => {
    const summary = {
      totalAgents: (countAgents.get() as { count: number }).count,
      openAppointments: (countOpenAppointments.get() as { count: number }).count,
      ailmentsInFlight: (countAilmentsInFlight.get() as { count: number }).count,
    };
    const agents = selectAllAgents.all() as Agent[];
    const ailments = selectAllAilments.all() as Ailment[];
    const therapies = selectAllTherapies.all() as Therapy[];
    const appointments = selectAllAppointments.all() as AppointmentWithDetails[];

    return c.html(
      <Dashboard
        summary={summary}
        agents={agents}
        appointments={appointments}
        ailments={ailments}
        therapies={therapies}
      />
    );
  });

  router.post("/appointments/:id/status", async (c) => {
    const id = Number(c.req.param("id"));
    const appointment = selectAppointmentById.get(id) as Appointment | undefined;
    if (!appointment) return c.notFound();

    const body = await c.req.parseBody();
    const nextStatus = typeof body.status === "string" ? body.status : "";

    if (!APPOINTMENT_STATUSES.includes(nextStatus as AppointmentStatus)) {
      return c.text("Invalid status value.", 400);
    }

    if (nextStatus === appointment.status) {
      // No-op: already in the requested status.
      return c.redirect("/dashboard", 303);
    }

    const allowed = ALLOWED_TRANSITIONS[appointment.status];
    if (!allowed.includes(nextStatus as AppointmentStatus)) {
      return c.text(`Cannot transition appointment from "${appointment.status}" to "${nextStatus}".`, 400);
    }

    updateAppointmentStatus.run(nextStatus, id);
    return c.redirect("/dashboard", 303);
  });

  return router;
}

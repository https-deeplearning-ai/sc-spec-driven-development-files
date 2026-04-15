import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import { Dashboard } from "../components/Dashboard";
export function dashboardRouter(db) {
    const router = new Hono();
    const countAgents = db.prepare("SELECT COUNT(*) as count FROM agents");
    const countOpenAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status IN ('pending', 'confirmed')");
    const countActiveAilments = db.prepare(`SELECT COUNT(DISTINCT aa.ailment_id) as count
     FROM agent_ailments aa
     JOIN agents a ON aa.agent_id = a.id
     WHERE a.status = 'active'`);
    const selectAgents = db.prepare("SELECT id, name, model_type, status FROM agents ORDER BY name");
    const selectUpcomingAppointments = db.prepare(`SELECT ap.id, a.name as agent_name, ap.therapist_name, ap.scheduled_at, ap.status
     FROM appointments ap
     JOIN agents a ON ap.agent_id = a.id
     WHERE ap.status IN ('pending', 'confirmed')
     ORDER BY ap.scheduled_at`);
    const selectAilments = db.prepare(`SELECT al.id, al.name, COUNT(aa.agent_id) as agent_count
     FROM ailments al
     LEFT JOIN agent_ailments aa ON al.id = aa.ailment_id
     GROUP BY al.id, al.name
     ORDER BY al.name`);
    router.get("/", (c) => {
        const stats = {
            agentCount: countAgents.get().count,
            openAppointmentCount: countOpenAppointments.get()
                .count,
            activeAilmentCount: countActiveAilments.get()
                .count,
        };
        const agents = selectAgents.all();
        const appointments = selectUpcomingAppointments.all();
        const ailments = selectAilments.all();
        return c.html(_jsx(Dashboard, { stats: stats, agents: agents, appointments: appointments, ailments: ailments }));
    });
    return router;
}

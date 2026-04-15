import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import { AgentsList } from "../components/AgentsList";
import { AgentDetail } from "../components/AgentDetail";
export function agentsRouter(db) {
    const router = new Hono();
    const selectAll = db.prepare("SELECT * FROM agents ORDER BY name");
    const selectById = db.prepare("SELECT * FROM agents WHERE id = ?");
    const selectAilments = db.prepare(`SELECT al.* FROM ailments al
     JOIN agent_ailments aa ON al.id = aa.ailment_id
     WHERE aa.agent_id = ?
     ORDER BY al.name`);
    router.get("/", (c) => {
        const agents = selectAll.all();
        return c.html(_jsx(AgentsList, { agents: agents }));
    });
    router.get("/:id", (c) => {
        const id = Number(c.req.param("id"));
        const agent = selectById.get(id);
        if (!agent)
            return c.notFound();
        const ailments = selectAilments.all(id);
        return c.html(_jsx(AgentDetail, { agent: agent, ailments: ailments }));
    });
    return router;
}

import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import { AilmentsList } from "../components/AilmentsList";
export function ailmentsRouter(db) {
    const router = new Hono();
    const selectAll = db.prepare("SELECT * FROM ailments ORDER BY name");
    router.get("/", (c) => {
        const ailments = selectAll.all();
        return c.html(_jsx(AilmentsList, { ailments: ailments }));
    });
    return router;
}

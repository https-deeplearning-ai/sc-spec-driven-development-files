import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import { TherapiesList } from "../components/TherapiesList";
export function therapiesRouter(db) {
    const router = new Hono();
    const selectAll = db.prepare("SELECT * FROM therapies ORDER BY name");
    router.get("/", (c) => {
        const therapies = selectAll.all();
        return c.html(_jsx(TherapiesList, { therapies: therapies }));
    });
    return router;
}

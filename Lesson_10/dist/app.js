import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { Home } from "./pages/Home";
import { agentsRouter } from "./routes/agents";
import { ailmentsRouter } from "./routes/ailments";
export function createApp(db) {
    const app = new Hono();
    app.use("/static/*", serveStatic({ root: "./" }));
    app.get("/", (c) => c.html(_jsx(Home, {})));
    app.route("/agents", agentsRouter(db));
    app.route("/ailments", ailmentsRouter(db));
    return app;
}

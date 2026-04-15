import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { ServerError } from "./pages/ServerError";
import { agentsRouter } from "./routes/agents";
import { ailmentsRouter } from "./routes/ailments";
import { therapiesRouter } from "./routes/therapies";
import { appointmentsRouter } from "./routes/appointments";
import { dashboardRouter } from "./routes/dashboard";
import { logger } from "./middleware/logger";
export function createApp(db) {
    const app = new Hono();
    app.use("*", logger);
    app.use("/static/*", serveStatic({ root: "./" }));
    app.get("/", (c) => c.html(_jsx(Home, {})));
    app.route("/agents", agentsRouter(db));
    app.route("/agents", appointmentsRouter(db));
    app.route("/ailments", ailmentsRouter(db));
    app.route("/therapies", therapiesRouter(db));
    app.route("/dashboard", dashboardRouter(db));
    app.notFound((c) => c.html(_jsx(NotFound, {}), 404));
    app.onError((_err, c) => c.html(_jsx(ServerError, {}), 500));
    return app;
}

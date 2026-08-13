import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import type Database from "better-sqlite3";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { ServerError } from "./pages/ServerError";
import { agentsRouter } from "./routes/agents";
import { ailmentsRouter } from "./routes/ailments";
import { therapiesRouter } from "./routes/therapies";
import { appointmentsRouter } from "./routes/appointments";
import { dashboardRouter } from "./routes/dashboard";
import { authRouter } from "./routes/auth";
import { logger } from "./middleware/logger";
import { requireStaffAuth } from "./middleware/auth";

export function createApp(db: Database.Database) {
  const app = new Hono();

  app.use("*", logger);
  app.use("/static/*", serveStatic({ root: "./" }));

  app.get("/", (c) => c.html(<Home />));
  app.route("/agents", agentsRouter(db));
  app.route("/agents", appointmentsRouter(db));
  app.route("/ailments", ailmentsRouter(db));
  app.route("/therapies", therapiesRouter(db));
  app.route("/", authRouter(db));
  app.use("/dashboard/*", requireStaffAuth(db));
  app.route("/dashboard", dashboardRouter(db));

  app.notFound((c) => c.html(<NotFound />, 404));
  app.onError((_err, c) => c.html(<ServerError />, 500));

  return app;
}

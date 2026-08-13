import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import type Database from "better-sqlite3";
import { Home } from "./pages/Home";
import { ErrorPage } from "./components/ErrorPage";
import { requestLogger } from "./middleware/logger";
import { agentsRouter } from "./routes/agents";
import { ailmentsRouter } from "./routes/ailments";
import { therapiesRouter } from "./routes/therapies";
import { appointmentsRouter } from "./routes/appointments";
import { dashboardRouter } from "./routes/dashboard";

export function createApp(db: Database.Database) {
  const app = new Hono();

  app.use(requestLogger());
  app.use("/static/*", serveStatic({ root: "./" }));

  app.get("/", (c) => c.html(<Home />));
  app.route("/agents", agentsRouter(db));
  app.route("/ailments", ailmentsRouter(db));
  app.route("/therapies", therapiesRouter(db));
  app.route("/", appointmentsRouter(db));
  app.route("/dashboard", dashboardRouter(db));

  app.notFound((c) =>
    c.html(<ErrorPage code={404} message="We couldn't find the page you're looking for." />, 404)
  );

  app.onError((err, c) => {
    console.error(err);
    return c.html(
      <ErrorPage code={500} message="An unexpected error occurred. Please try again later." />,
      500
    );
  });

  return app;
}

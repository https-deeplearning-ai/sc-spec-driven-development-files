import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { Home } from "./pages/Home";
import { Agents } from "./pages/Agents";
import { AgentDetail } from "./pages/AgentDetail";
import { Ailments } from "./pages/Ailments";
import { listAgents, getAgentById } from "./db/agents";
import { listAilments, getAilmentsForAgent } from "./db/ailments";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", (c) => {
  return c.html(<Home />);
});

app.get("/agents", (c) => {
  return c.html(<Agents agents={listAgents()} />);
});

app.get("/agents/:id", (c) => {
  const id = Number(c.req.param("id"));
  const agent = Number.isInteger(id) ? getAgentById(id) : undefined;

  if (!agent) {
    return c.html(<AgentDetail agent={undefined} />, 404);
  }

  return c.html(<AgentDetail agent={agent} ailments={getAilmentsForAgent(agent.id)} />);
});

app.get("/ailments", (c) => {
  return c.html(<Ailments ailments={listAilments()} />);
});

export default app;

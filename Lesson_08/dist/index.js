import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Home } from "./pages/Home";
const app = new Hono();
app.use("/static/*", serveStatic({ root: "./" }));
app.get("/", (c) => {
    return c.html(_jsx(Home, {}));
});
serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Server running at http://localhost:${info.port}`);
});

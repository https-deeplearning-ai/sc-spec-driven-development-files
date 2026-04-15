import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { Home } from "./pages/Home";
const app = new Hono();
app.use("/static/*", serveStatic({ root: "./" }));
app.get("/", (c) => {
    return c.html(_jsx(Home, {}));
});
export default app;

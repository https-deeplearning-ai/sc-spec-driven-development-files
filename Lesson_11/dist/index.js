import { serve } from "@hono/node-server";
import { createDb } from "./db/index";
import { migrate } from "./db/migrate";
import { seed } from "./db/seed";
import { createApp } from "./app";
const db = createDb();
migrate(db);
seed(db);
const app = createApp(db);
serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Server running at http://localhost:${info.port}`);
});

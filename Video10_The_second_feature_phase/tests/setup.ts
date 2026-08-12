// Runs before every test file. Points the app's default DB connection at an
// in-memory database (per worker) and migrates + seeds it, so route/component
// tests exercise the same data-access code paths as production without ever
// touching data/agentclinic.db.
process.env.DATABASE_PATH = ":memory:";

const { db } = await import("../src/db/client");
const { runMigrations } = await import("../src/db/migrate");
const { seed } = await import("../src/db/seed");

runMigrations(db);
seed(db);

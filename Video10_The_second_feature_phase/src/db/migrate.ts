import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import type Database from "better-sqlite3";
import { createDb } from "./client";

const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

export function runMigrations(database: Database.Database, migrationsDir: string = MIGRATIONS_DIR): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const applied = new Set(
    (database.prepare("SELECT filename FROM schema_migrations").all() as { filename: string }[]).map(
      (row) => row.filename,
    ),
  );

  const pending = readdirSync(migrationsDir)
    .filter((filename) => filename.endsWith(".sql"))
    .sort()
    .filter((filename) => !applied.has(filename));

  for (const filename of pending) {
    const sql = readFileSync(path.join(migrationsDir, filename), "utf-8");
    const applyMigration = database.transaction(() => {
      database.exec(sql);
      database.prepare("INSERT INTO schema_migrations (filename) VALUES (?)").run(filename);
    });
    applyMigration();
    console.log(`Applied migration: ${filename}`);
  }

  if (pending.length === 0) {
    console.log("No pending migrations.");
  }
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  runMigrations(createDb());
}

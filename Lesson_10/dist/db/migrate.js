import { readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "migrations");
export function migrate(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
    const applied = new Set(db.prepare("SELECT name FROM _migrations").all().map((r) => r.name));
    const files = readdirSync(migrationsDir)
        .filter((f) => f.endsWith(".sql"))
        .sort();
    for (const file of files) {
        if (applied.has(file))
            continue;
        const sql = readFileSync(join(migrationsDir, file), "utf8");
        db.exec(sql);
        db.prepare("INSERT INTO _migrations (name) VALUES (?)").run(file);
    }
}

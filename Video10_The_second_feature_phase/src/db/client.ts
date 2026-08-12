import path from "node:path";
import Database from "better-sqlite3";

const DEFAULT_DB_PATH = path.join(process.cwd(), "data", "agentclinic.db");

export function createDb(dbPath: string = process.env.DATABASE_PATH ?? DEFAULT_DB_PATH): Database.Database {
  const database = new Database(dbPath);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  return database;
}

export const db = createDb();

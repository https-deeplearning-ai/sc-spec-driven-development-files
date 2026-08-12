import type Database from "better-sqlite3";
import type { Ailment } from "../types";
import { db as defaultDb } from "./client";

export function listAilments(database: Database.Database = defaultDb): Ailment[] {
  return database.prepare("SELECT id, name, description FROM ailments ORDER BY name").all() as Ailment[];
}

export function getAilmentsForAgent(agentId: number, database: Database.Database = defaultDb): Ailment[] {
  return database
    .prepare(
      `SELECT ailments.id, ailments.name, ailments.description
       FROM ailments
       JOIN agent_ailments ON agent_ailments.ailment_id = ailments.id
       WHERE agent_ailments.agent_id = ?
       ORDER BY ailments.name`,
    )
    .all(agentId) as Ailment[];
}

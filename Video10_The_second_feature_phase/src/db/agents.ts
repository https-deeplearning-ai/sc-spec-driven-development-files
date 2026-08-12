import type Database from "better-sqlite3";
import type { Agent } from "../types";
import { db as defaultDb } from "./client";

export function listAgents(database: Database.Database = defaultDb): Agent[] {
  return database.prepare("SELECT id, name, model_type, status FROM agents ORDER BY name").all() as Agent[];
}

export function getAgentById(id: number, database: Database.Database = defaultDb): Agent | undefined {
  return database.prepare("SELECT id, name, model_type, status FROM agents WHERE id = ?").get(id) as
    | Agent
    | undefined;
}

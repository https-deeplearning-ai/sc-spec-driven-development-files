import { randomUUID } from "crypto";
import type Database from "better-sqlite3";

/**
 * Creates a new staff session and returns its id.
 * Sessions have no expiry (see specs/2026-08-12-staff-authentication/requirements.md) —
 * they last until destroySession is called.
 */
export function createSession(db: Database.Database): string {
  const id = randomUUID();
  db.prepare("INSERT INTO sessions (id) VALUES (?)").run(id);
  return id;
}

/** True if a session with this id exists. */
export function getSession(db: Database.Database, id: string): boolean {
  const row = db.prepare("SELECT id FROM sessions WHERE id = ?").get(id);
  return row !== undefined;
}

/** Deletes a session, if it exists. Safe to call with an unknown id. */
export function destroySession(db: Database.Database, id: string): void {
  db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
}

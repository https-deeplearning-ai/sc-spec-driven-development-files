import { describe, it, expect } from "vitest";
import { createDb } from "../src/db/index";
import { migrate } from "../src/db/migrate";
import { createSession, getSession, destroySession } from "../src/auth/session";

function freshDb() {
  const db = createDb(":memory:");
  migrate(db);
  return db;
}

describe("sessions", () => {
  it("creates a session that getSession recognizes as valid", () => {
    const db = freshDb();
    const id = createSession(db);
    expect(getSession(db, id)).toBe(true);
  });

  it("does not recognize an unknown session id", () => {
    const db = freshDb();
    expect(getSession(db, "not-a-real-session")).toBe(false);
  });

  it("removes a session on destroySession", () => {
    const db = freshDb();
    const id = createSession(db);
    destroySession(db, id);
    expect(getSession(db, id)).toBe(false);
  });

  it("does not throw when destroying an unknown session id", () => {
    const db = freshDb();
    expect(() => destroySession(db, "not-a-real-session")).not.toThrow();
  });
});

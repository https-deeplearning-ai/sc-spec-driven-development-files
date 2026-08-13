import { describe, it, expect } from "vitest";
import { createDb } from "../src/db/index";
import { migrate } from "../src/db/migrate";
import { seed } from "../src/db/seed";

function freshDb() {
  const db = createDb(":memory:");
  migrate(db);
  return db;
}

describe("migrate", () => {
  it("runs without error on a fresh database", () => {
    expect(() => freshDb()).not.toThrow();
  });

  it("is idempotent — running twice does not error", () => {
    const db = freshDb();
    expect(() => migrate(db)).not.toThrow();
  });

  it("creates the agents table", () => {
    const db = freshDb();
    const row = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='agents'"
      )
      .get();
    expect(row).toBeDefined();
  });

  it("creates the ailments table", () => {
    const db = freshDb();
    const row = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='ailments'"
      )
      .get();
    expect(row).toBeDefined();
  });

  it("creates the agent_ailments join table", () => {
    const db = freshDb();
    const row = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='agent_ailments'"
      )
      .get();
    expect(row).toBeDefined();
  });

  it("creates the therapies table", () => {
    const db = freshDb();
    const row = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='therapies'"
      )
      .get();
    expect(row).toBeDefined();
  });

  it("creates the ailment_therapies join table", () => {
    const db = freshDb();
    const row = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='ailment_therapies'"
      )
      .get();
    expect(row).toBeDefined();
  });

  it("creates the appointments table", () => {
    const db = freshDb();
    const row = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='appointments'"
      )
      .get();
    expect(row).toBeDefined();
  });

  it("rejects an invalid appointment status via the CHECK constraint", () => {
    const db = freshDb();
    seed(db);
    expect(() =>
      db
        .prepare(
          `INSERT INTO appointments (agent_id, therapist_name, scheduled_at, status)
           VALUES (1, 'Dr. Byte', '2099-01-01T10:00', 'not-a-real-status')`
        )
        .run()
    ).toThrow();
  });
});

describe("seed", () => {
  it("inserts at least 5 agents", () => {
    const db = freshDb();
    seed(db);
    const { count } = db
      .prepare("SELECT COUNT(*) as count FROM agents")
      .get() as { count: number };
    expect(count).toBeGreaterThanOrEqual(5);
  });

  it("inserts at least 5 ailments", () => {
    const db = freshDb();
    seed(db);
    const { count } = db
      .prepare("SELECT COUNT(*) as count FROM ailments")
      .get() as { count: number };
    expect(count).toBeGreaterThanOrEqual(5);
  });

  it("creates at least one agent-ailment link", () => {
    const db = freshDb();
    seed(db);
    const { count } = db
      .prepare("SELECT COUNT(*) as count FROM agent_ailments")
      .get() as { count: number };
    expect(count).toBeGreaterThan(0);
  });

  it("is idempotent — seeding twice does not duplicate rows", () => {
    const db = freshDb();
    seed(db);
    const first = (
      db.prepare("SELECT COUNT(*) as count FROM agents").get() as {
        count: number;
      }
    ).count;
    seed(db);
    const second = (
      db.prepare("SELECT COUNT(*) as count FROM agents").get() as {
        count: number;
      }
    ).count;
    expect(second).toBe(first);
  });

  it("inserts at least 5 therapies", () => {
    const db = freshDb();
    seed(db);
    const { count } = db
      .prepare("SELECT COUNT(*) as count FROM therapies")
      .get() as { count: number };
    expect(count).toBeGreaterThanOrEqual(5);
  });

  it("links every seeded ailment to at least one therapy", () => {
    const db = freshDb();
    seed(db);
    const { count } = db
      .prepare(
        `SELECT COUNT(*) as count FROM ailments a
         WHERE NOT EXISTS (
           SELECT 1 FROM ailment_therapies at WHERE at.ailment_id = a.id
         )`
      )
      .get() as { count: number };
    expect(count).toBe(0);
  });

  it("is idempotent — seeding twice does not duplicate therapies or links", () => {
    const db = freshDb();
    seed(db);
    const firstTherapies = (
      db.prepare("SELECT COUNT(*) as count FROM therapies").get() as { count: number }
    ).count;
    const firstLinks = (
      db.prepare("SELECT COUNT(*) as count FROM ailment_therapies").get() as { count: number }
    ).count;
    seed(db);
    const secondTherapies = (
      db.prepare("SELECT COUNT(*) as count FROM therapies").get() as { count: number }
    ).count;
    const secondLinks = (
      db.prepare("SELECT COUNT(*) as count FROM ailment_therapies").get() as { count: number }
    ).count;
    expect(secondTherapies).toBe(firstTherapies);
    expect(secondLinks).toBe(firstLinks);
  });
});

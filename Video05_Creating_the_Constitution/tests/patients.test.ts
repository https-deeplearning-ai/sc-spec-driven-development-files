import { describe, it, expect, beforeEach, afterAll } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import { patients } from "@/db/schema";
import type { NewPatient } from "@/db/schema";

function createTestDb() {
  const sqlite = new Database(":memory:");
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      model_provider TEXT NOT NULL,
      model_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  return drizzle(sqlite, { schema: { patients } });
}

const validPatient: NewPatient = {
  name: "TestBot-1",
  species: "chatbot",
  modelProvider: "anthropic",
  modelName: "claude-sonnet-4-20250514",
};

describe("patients schema validation", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(() => {
    db = createTestDb();
  });

  it("should insert a patient with all required fields", () => {
    const result = db.insert(patients).values(validPatient).returning().get();

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.name).toBe("TestBot-1");
    expect(result.species).toBe("chatbot");
    expect(result.modelProvider).toBe("anthropic");
    expect(result.modelName).toBe("claude-sonnet-4-20250514");
    expect(result.status).toBe("active");
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  it("should reject a patient missing required name field", () => {
    expect(() => {
      db.insert(patients)
        .values({
          species: "chatbot",
          modelProvider: "anthropic",
          modelName: "claude-sonnet-4-20250514",
        } as NewPatient)
        .run();
    }).toThrow();
  });

  it("should reject a patient missing required species field", () => {
    expect(() => {
      db.insert(patients)
        .values({
          name: "TestBot",
          modelProvider: "anthropic",
          modelName: "claude-sonnet-4-20250514",
        } as NewPatient)
        .run();
    }).toThrow();
  });

  it("should reject a patient missing required modelProvider field", () => {
    expect(() => {
      db.insert(patients)
        .values({
          name: "TestBot",
          species: "chatbot",
          modelName: "claude-sonnet-4-20250514",
        } as NewPatient)
        .run();
    }).toThrow();
  });

  it("should reject a patient missing required modelName field", () => {
    expect(() => {
      db.insert(patients)
        .values({
          name: "TestBot",
          species: "chatbot",
          modelProvider: "anthropic",
        } as NewPatient)
        .run();
    }).toThrow();
  });

  it("should default status to active", () => {
    const result = db.insert(patients).values(validPatient).returning().get();
    expect(result.status).toBe("active");
  });

  it("should auto-generate timestamps", () => {
    const result = db.insert(patients).values(validPatient).returning().get();
    expect(result.createdAt).toBeTruthy();
    expect(result.updatedAt).toBeTruthy();
  });
});

describe("POST /api/patients — creates a record and returns it", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(() => {
    db = createTestDb();
  });

  it("should create a patient record and return it with an id", () => {
    const result = db
      .insert(patients)
      .values(validPatient)
      .returning()
      .get();

    expect(result.id).toBeGreaterThan(0);
    expect(result.name).toBe(validPatient.name);
    expect(result.species).toBe(validPatient.species);
    expect(result.modelProvider).toBe(validPatient.modelProvider);
    expect(result.modelName).toBe(validPatient.modelName);
  });

  it("should auto-increment ids for multiple patients", () => {
    const first = db.insert(patients).values(validPatient).returning().get();
    const second = db
      .insert(patients)
      .values({ ...validPatient, name: "TestBot-2" })
      .returning()
      .get();

    expect(second.id).toBe(first.id + 1);
  });
});

describe("GET /api/patients/:id — returns correct patient or 404", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(() => {
    db = createTestDb();
  });

  it("should return the correct patient by id", () => {
    const inserted = db
      .insert(patients)
      .values(validPatient)
      .returning()
      .get();

    const found = db
      .select()
      .from(patients)
      .where(eq(patients.id, inserted.id))
      .get();

    expect(found).toBeDefined();
    expect(found!.id).toBe(inserted.id);
    expect(found!.name).toBe(validPatient.name);
  });

  it("should return undefined for a non-existent patient id", () => {
    const found = db
      .select()
      .from(patients)
      .where(eq(patients.id, 9999))
      .get();

    expect(found).toBeUndefined();
  });

  it("should return all patients with select().all()", () => {
    db.insert(patients).values(validPatient).run();
    db.insert(patients)
      .values({ ...validPatient, name: "TestBot-2" })
      .run();
    db.insert(patients)
      .values({ ...validPatient, name: "TestBot-3" })
      .run();

    const all = db.select().from(patients).all();
    expect(all).toHaveLength(3);
  });
});

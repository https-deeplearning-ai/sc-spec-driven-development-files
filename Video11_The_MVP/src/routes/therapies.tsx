import { Hono } from "hono";
import type Database from "better-sqlite3";
import { TherapiesList } from "../components/TherapiesList";
import type { Therapy } from "../db/types";

export function therapiesRouter(db: Database.Database) {
  const router = new Hono();

  const selectAll = db.prepare("SELECT * FROM therapies ORDER BY name");

  router.get("/", (c) => {
    const therapies = selectAll.all() as Therapy[];
    return c.html(<TherapiesList therapies={therapies} />);
  });

  return router;
}

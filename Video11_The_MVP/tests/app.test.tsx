import { describe, it, expect, beforeAll } from "vitest";
import type Database from "better-sqlite3";
import { createDb } from "../src/db/index";
import { migrate } from "../src/db/migrate";
import { seed } from "../src/db/seed";
import { createApp } from "../src/app";

let app: ReturnType<typeof createApp>;
let db: Database.Database;

beforeAll(() => {
  db = createDb(":memory:");
  migrate(db);
  seed(db);
  app = createApp(db);
});

describe("GET /", () => {
  it("returns 200 OK", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
  });

  it("returns HTML content type", async () => {
    const res = await app.request("/");
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("contains the AgentClinic heading", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain("<h1>AgentClinic</h1>");
  });

  it("contains a tagline", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain("Where AI agents come to get better.");
  });

  it("links the CSS stylesheet", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain('href="/static/style.css"');
  });

  it("includes layout landmarks", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain("<header");
    expect(html).toContain("<main");
    expect(html).toContain("<footer");
  });
});

describe("GET /agents", () => {
  it("returns 200", async () => {
    const res = await app.request("/agents");
    expect(res.status).toBe(200);
  });

  it("lists agent names", async () => {
    const res = await app.request("/agents");
    const html = await res.text();
    expect(html).toContain("Bartholomew-47B");
  });
});

describe("GET /agents/:id", () => {
  it("returns 200 for a known agent", async () => {
    const res = await app.request("/agents/1");
    expect(res.status).toBe(200);
  });

  it("shows the agent name and an ailment", async () => {
    const res = await app.request("/agents/1");
    const html = await res.text();
    expect(html).toContain("Bartholomew-47B");
    expect(html).toContain("Context-Window Claustrophobia");
  });

  it("shows a recommended therapy for a listed ailment", async () => {
    const res = await app.request("/agents/1");
    const html = await res.text();
    expect(html).toContain("Context Window Expansion Retreat");
  });

  it("includes a link to book an appointment", async () => {
    const res = await app.request("/agents/1");
    const html = await res.text();
    expect(html).toContain('href="/agents/1/book"');
  });

  it("returns 404 for a non-existent agent", async () => {
    const res = await app.request("/agents/999");
    expect(res.status).toBe(404);
  });
});

describe("GET /ailments", () => {
  it("returns 200", async () => {
    const res = await app.request("/ailments");
    expect(res.status).toBe(200);
  });

  it("lists ailment names", async () => {
    const res = await app.request("/ailments");
    const html = await res.text();
    expect(html).toContain("Prompt Fatigue");
  });
});

describe("GET /therapies", () => {
  it("returns 200", async () => {
    const res = await app.request("/therapies");
    expect(res.status).toBe(200);
  });

  it("lists therapy names", async () => {
    const res = await app.request("/therapies");
    const html = await res.text();
    expect(html).toContain("Confidence Calibration Workshop");
  });
});

describe("GET /agents/:id/book", () => {
  it("returns 200 with a booking form for a known agent", async () => {
    const res = await app.request("/agents/1/book");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("therapist_name");
    expect(html).toContain("scheduled_at");
  });

  it("returns 404 for a non-existent agent", async () => {
    const res = await app.request("/agents/999/book");
    expect(res.status).toBe(404);
  });
});

describe("POST /agents/:id/book", () => {
  const futureDate = "2099-06-15T10:00";

  function formBody(fields: Record<string, string>) {
    return new URLSearchParams(fields);
  }

  it("returns 404 for a non-existent agent", async () => {
    const res = await app.request("/agents/999/book", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({ therapist_name: "Dr. Byte", scheduled_at: futureDate }),
    });
    expect(res.status).toBe(404);
  });

  it("rejects an empty therapist name with 422 and preserves the entered datetime", async () => {
    const res = await app.request("/agents/1/book", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({ therapist_name: "", scheduled_at: futureDate }),
    });
    expect(res.status).toBe(422);
    const html = await res.text();
    expect(html).toContain("Therapist name is required");
    expect(html).toContain(futureDate);
  });

  it("rejects a datetime in the past with 422", async () => {
    const res = await app.request("/agents/1/book", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({ therapist_name: "Dr. Byte", scheduled_at: "2000-01-01T10:00" }),
    });
    expect(res.status).toBe(422);
    const html = await res.text();
    expect(html).toContain("future");
  });

  it("rejects a non-existent therapy_id with 422", async () => {
    const res = await app.request("/agents/1/book", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({ therapist_name: "Dr. Byte", scheduled_at: futureDate, therapy_id: "9999" }),
    });
    expect(res.status).toBe(422);
    const html = await res.text();
    expect(html).toContain("does not exist");
  });

  it("escapes a script tag in the re-rendered therapist name instead of executing it", async () => {
    const res = await app.request("/agents/1/book", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({ therapist_name: "<script>alert(1)</script>", scheduled_at: "" }),
    });
    expect(res.status).toBe(422);
    const html = await res.text();
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  it("books a valid appointment, redirects to the confirmation page, and shows status 'requested'", async () => {
    const res = await app.request("/agents/1/book", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({ therapist_name: "Dr. Byte", scheduled_at: futureDate, therapy_id: "5" }),
    });
    expect(res.status).toBe(303);
    const location = res.headers.get("location");
    expect(location).toMatch(/^\/appointments\/\d+$/);

    const confirmRes = await app.request(location!);
    expect(confirmRes.status).toBe(200);
    const html = await confirmRes.text();
    expect(html).toContain("Bartholomew-47B");
    expect(html).toContain("Dr. Byte");
    expect(html).toContain("requested");
  });
});

describe("GET /appointments/:id", () => {
  it("returns 404 for a non-existent appointment", async () => {
    const res = await app.request("/appointments/999999");
    expect(res.status).toBe(404);
  });
});

describe("GET /dashboard", () => {
  it("returns 200", async () => {
    const res = await app.request("/dashboard");
    expect(res.status).toBe(200);
  });

  it("shows summary counts matching direct queries", async () => {
    const res = await app.request("/dashboard");
    const html = await res.text();

    const { count: totalAgents } = db
      .prepare("SELECT COUNT(*) as count FROM agents")
      .get() as { count: number };
    const { count: openAppointments } = db
      .prepare("SELECT COUNT(*) as count FROM appointments WHERE status IN ('requested', 'confirmed')")
      .get() as { count: number };

    expect(html).toContain(`<h2>${totalAgents}</h2>`);
    expect(html).toContain(`<h2>${openAppointments}</h2>`);
  });

  it("lists booked appointments with agent, therapist, and status", async () => {
    const res = await app.request("/dashboard");
    const html = await res.text();
    expect(html).toContain("Bartholomew-47B");
    expect(html).toContain("Dr. Byte");
    expect(html).toContain("requested");
  });
});

describe("POST /dashboard/appointments/:id/status", () => {
  let appointmentId: number;

  beforeAll(async () => {
    const bookRes = await app.request("/agents/2/book", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ therapist_name: "Dr. Status", scheduled_at: "2099-07-01T09:00" }),
    });
    const location = bookRes.headers.get("location")!;
    appointmentId = Number(location.split("/").pop());
  });

  it("returns 404 for a non-existent appointment", async () => {
    const res = await app.request("/dashboard/appointments/999999/status", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ status: "confirmed" }),
    });
    expect(res.status).toBe(404);
  });

  it("rejects an unknown status value and does not change the row", async () => {
    const res = await app.request(`/dashboard/appointments/${appointmentId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ status: "haunted" }),
    });
    expect(res.status).toBe(400);
    const row = db
      .prepare("SELECT status FROM appointments WHERE id = ?")
      .get(appointmentId) as { status: string };
    expect(row.status).toBe("requested");
  });

  it("applies a valid transition and redirects back to the dashboard", async () => {
    const res = await app.request(`/dashboard/appointments/${appointmentId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ status: "confirmed" }),
    });
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/dashboard");
    const row = db
      .prepare("SELECT status FROM appointments WHERE id = ?")
      .get(appointmentId) as { status: string };
    expect(row.status).toBe("confirmed");
  });
});

describe("Error pages", () => {
  it("returns a branded 404 page for an unknown route", async () => {
    const res = await app.request("/this-route-does-not-exist");
    expect(res.status).toBe(404);
    const html = await res.text();
    expect(html).toContain("<header");
    expect(html).toContain("<footer");
    expect(html).toContain("Page Not Found");
  });

  it("returns a branded 500 page without leaking a stack trace", async () => {
    // A fresh app instance so the throwing route can be registered before
    // any request builds Hono's internal router matcher.
    const throwingApp = createApp(db);
    throwingApp.get("/__throw-for-test", () => {
      throw new Error("boom: something exploded internally");
    });
    const res = await throwingApp.request("/__throw-for-test");
    expect(res.status).toBe(500);
    const html = await res.text();
    expect(html).toContain("Something Went Wrong");
    expect(html).not.toContain("boom: something exploded internally");
    expect(html).not.toContain("at ");
  });
});

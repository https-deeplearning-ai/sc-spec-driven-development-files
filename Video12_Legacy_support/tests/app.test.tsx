import { describe, it, expect, beforeAll, vi } from "vitest";
import { createDb } from "../src/db/index";
import { migrate } from "../src/db/migrate";
import { seed } from "../src/db/seed";
import { createApp } from "../src/app";

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  const db = createDb(":memory:");
  migrate(db);
  seed(db);
  app = createApp(db);
});

async function staffCookie(): Promise<string> {
  const res = await app.request("/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "username=staff&password=changeme",
  });
  const setCookie = res.headers.get("set-cookie") ?? "";
  return setCookie.split(";")[0];
}

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

  it("includes a book appointment link", async () => {
    const res = await app.request("/agents/1");
    const html = await res.text();
    expect(html).toContain("/agents/1/appointments/new");
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
    expect(html).toContain("Prompt Reduction Therapy");
  });
});

describe("Appointment booking", () => {
  it("GET /agents/:id/appointments/new returns 200 with a form", async () => {
    const res = await app.request("/agents/1/appointments/new");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("<form");
    expect(html).toContain('name="therapist_name"');
    expect(html).toContain('name="date"');
    expect(html).toContain('name="time"');
  });

  it("GET /agents/999/appointments/new returns 404", async () => {
    const res = await app.request("/agents/999/appointments/new");
    expect(res.status).toBe(404);
  });

  it("POST with valid data redirects to confirmation", async () => {
    const formData = new FormData();
    formData.append("therapist_name", "Dr. Test");
    formData.append("date", "2099-12-31");
    formData.append("time", "10:00");
    const res = await app.request("/agents/1/appointments", {
      method: "POST",
      body: formData,
    });
    expect(res.status).toBe(302);
    const location = res.headers.get("Location");
    expect(location).toMatch(/\/agents\/1\/appointments\/\d+/);
  });

  it("POST with missing fields returns 200 with errors", async () => {
    const formData = new FormData();
    formData.append("therapist_name", "");
    formData.append("date", "");
    formData.append("time", "");
    const res = await app.request("/agents/1/appointments", {
      method: "POST",
      body: formData,
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("required");
  });

  it("POST with a past date returns 200 with an error", async () => {
    const formData = new FormData();
    formData.append("therapist_name", "Dr. Past");
    formData.append("date", "1999-01-01");
    formData.append("time", "10:00");
    const res = await app.request("/agents/1/appointments", {
      method: "POST",
      body: formData,
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("future");
  });

  it("GET confirmation page returns 200 with appointment details", async () => {
    const formData = new FormData();
    formData.append("therapist_name", "Dr. Confirm");
    formData.append("date", "2099-06-15");
    formData.append("time", "14:00");
    const postRes = await app.request("/agents/1/appointments", {
      method: "POST",
      body: formData,
    });
    const location = postRes.headers.get("Location")!;
    const res = await app.request(location);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Dr. Confirm");
    expect(html).toContain("Bartholomew-47B");
  });

  it("sanitizes HTML tags from therapist name", async () => {
    const formData = new FormData();
    formData.append("therapist_name", "<script>alert(1)</script>Dr. Safe");
    formData.append("date", "2099-11-30");
    formData.append("time", "09:00");
    const postRes = await app.request("/agents/1/appointments", {
      method: "POST",
      body: formData,
    });
    expect(postRes.status).toBe(302);
    const location = postRes.headers.get("Location")!;
    const confirmRes = await app.request(location);
    const html = await confirmRes.text();
    expect(html).not.toContain("<script>");
    expect(html).toContain("Dr. Safe");
  });
});

describe("GET /dashboard", () => {
  it("redirects to /login when not authenticated", async () => {
    const res = await app.request("/dashboard", { redirect: "manual" });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("/login");
  });

  it("returns 200 when authenticated", async () => {
    const cookie = await staffCookie();
    const res = await app.request("/dashboard", {
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(200);
  });

  it("contains agent count", async () => {
    const cookie = await staffCookie();
    const res = await app.request("/dashboard", {
      headers: { Cookie: cookie },
    });
    const html = await res.text();
    expect(html).toContain("Total Agents");
  });

  it("contains open appointment count", async () => {
    const cookie = await staffCookie();
    const res = await app.request("/dashboard", {
      headers: { Cookie: cookie },
    });
    const html = await res.text();
    expect(html).toContain("Open Appointments");
  });

  it("contains active ailments count", async () => {
    const cookie = await staffCookie();
    const res = await app.request("/dashboard", {
      headers: { Cookie: cookie },
    });
    const html = await res.text();
    expect(html).toContain("Active Ailments In-Flight");
  });

  it("lists agents in the management table", async () => {
    const cookie = await staffCookie();
    const res = await app.request("/dashboard", {
      headers: { Cookie: cookie },
    });
    const html = await res.text();
    expect(html).toContain("Bartholomew-47B");
  });
});

describe("404 handling", () => {
  it("returns 404 for an unknown route", async () => {
    const res = await app.request("/nonexistent-route");
    expect(res.status).toBe(404);
  });

  it("renders a styled not-found page", async () => {
    const res = await app.request("/nonexistent-route");
    const html = await res.text();
    expect(html).toContain("Not Found");
    expect(html).toContain("<header");
  });
});

describe("logging middleware", () => {
  it("logs each request to stdout", async () => {
    const logs: string[] = [];
    const spy = vi
      .spyOn(console, "log")
      .mockImplementation((...args) => logs.push(args.join(" ")));
    await app.request("/");
    spy.mockRestore();
    expect(logs.some((l) => l.includes("GET") && l.includes("/"))).toBe(true);
  });
});

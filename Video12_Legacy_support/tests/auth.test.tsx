import { describe, it, expect, beforeAll } from "vitest";
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

function loginBody(username: string, password: string) {
  return `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
}

describe("GET /login", () => {
  it("returns 200 and renders a login form", async () => {
    const res = await app.request("/login");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('name="username"');
    expect(html).toContain('name="password"');
  });
});

describe("POST /login", () => {
  it("rejects an incorrect password without setting a cookie", async () => {
    const res = await app.request("/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: loginBody("staff", "wrong-password"),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toBeNull();
    const html = await res.text();
    expect(html).toContain("Invalid username or password.");
  });

  it("rejects an unknown username without setting a cookie", async () => {
    const res = await app.request("/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: loginBody("nobody", "changeme"),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("accepts the seeded default credentials and sets a session cookie", async () => {
    const res = await app.request("/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: loginBody("staff", "changeme"),
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("/dashboard");
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("session_id=");
    expect(setCookie).toContain("HttpOnly");
  });
});

describe("POST /logout", () => {
  it("clears the session so /dashboard requires login again", async () => {
    const loginRes = await app.request("/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: loginBody("staff", "changeme"),
    });
    const cookie = (loginRes.headers.get("set-cookie") ?? "").split(";")[0];

    const dashboardBefore = await app.request("/dashboard", {
      headers: { Cookie: cookie },
    });
    expect(dashboardBefore.status).toBe(200);

    const logoutRes = await app.request("/logout", {
      method: "POST",
      headers: { Cookie: cookie },
    });
    expect(logoutRes.status).toBe(302);
    expect(logoutRes.headers.get("location")).toBe("/login");

    const dashboardAfter = await app.request("/dashboard", {
      headers: { Cookie: cookie },
      redirect: "manual",
    });
    expect(dashboardAfter.status).toBe(302);
    expect(dashboardAfter.headers.get("location")).toBe("/login");
  });
});

describe("public routes stay reachable without a session", () => {
  const publicPaths = ["/", "/agents", "/ailments", "/therapies"];

  for (const path of publicPaths) {
    it(`GET ${path} returns 200 with no session cookie`, async () => {
      const res = await app.request(path);
      expect(res.status).toBe(200);
    });
  }
});

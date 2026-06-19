import { describe, it, expect } from "vitest";
import { app } from "./app";

describe("GET /", () => {
  it("returns 200 OK", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
  });

  it("responds with HTML content type", async () => {
    const res = await app.request("/");
    expect(res.headers.get("content-type")).toMatch(/text\/html/);
  });

  it("body contains the AgentClinic <h1> heading", async () => {
    const res = await app.request("/");
    const body = await res.text();
    expect(body).toContain("<h1>");
    expect(body).toContain("AgentClinic");
  });

  it("body contains the tagline", async () => {
    const res = await app.request("/");
    const body = await res.text();
    expect(body).toContain("Where AI agents come to get better.");
  });

  it("body is a complete HTML document", async () => {
    const res = await app.request("/");
    const body = await res.text();
    expect(body).toContain("<html");
    expect(body).toContain("<head");
    expect(body).toContain("<body");
  });
});

describe("unknown routes", () => {
  it("returns 404 for a path that does not exist", async () => {
    const res = await app.request("/does-not-exist");
    expect(res.status).toBe(404);
  });
});

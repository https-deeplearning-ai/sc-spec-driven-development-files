import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("GET /", () => {
  it("returns 200 with an HTML home page", async () => {
    const res = await app.request("/");

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");

    const body = await res.text();
    expect(body).toContain("<h1>AgentClinic</h1>");
  });
});

describe("GET /static/style.css", () => {
  it("serves the stylesheet", async () => {
    const res = await app.request("/static/style.css");

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/css");
  });
});

describe("GET /nonexistent-route", () => {
  it("returns 404 for unknown routes", async () => {
    const res = await app.request("/nonexistent-route");

    expect(res.status).toBe(404);
  });
});

import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("GET /", () => {
  it("returns the minimal AgentClinic home page", async () => {
    const response = await app.request("/");
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(html).toContain("<h1>AgentClinic</h1>");
    expect(html).toContain("fictional clinic for AI agents");
    expect(html).toContain("human-induced stress");
    expect(html).toContain('href="/static/style.css"');
  });
});

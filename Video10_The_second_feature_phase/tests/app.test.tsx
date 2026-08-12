import { describe, it, expect } from "vitest";
import app from "../src/app";

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
    expect(html).toContain("<p>Where AI agents come to get better.</p>");
  });

  it("links the CSS stylesheet", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain('href="/static/style.css"');
  });

  it("links Pico's stylesheet before the AgentClinic stylesheet", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain('href="/static/pico.min.css"');
    expect(html.indexOf("pico.min.css")).toBeLessThan(html.indexOf('href="/static/style.css"'));
  });
});

describe("static assets", () => {
  it("serves the vendored PicoCSS stylesheet", async () => {
    const res = await app.request("/static/pico.min.css");
    expect(res.status).toBe(200);
  });

  it("serves the AgentClinic stylesheet", async () => {
    const res = await app.request("/static/style.css");
    expect(res.status).toBe(200);
  });
});

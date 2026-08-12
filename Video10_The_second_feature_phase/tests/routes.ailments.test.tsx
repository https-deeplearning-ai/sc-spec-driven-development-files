import { describe, it, expect } from "vitest";
import app from "../src/app";
import { listAilments } from "../src/db/ailments";

// Hono JSX escapes text-node content, so quotes/apostrophes in seeded
// descriptions come back as entities — mirror that here for comparison.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

describe("GET /ailments", () => {
  it("returns 200 OK", async () => {
    const res = await app.request("/ailments");
    expect(res.status).toBe(200);
  });

  it("lists every seeded ailment's name and description", async () => {
    const res = await app.request("/ailments");
    const html = await res.text();
    for (const ailment of listAilments()) {
      expect(html).toContain(ailment.name);
      expect(html).toContain(escapeHtml(ailment.description));
    }
  });
});

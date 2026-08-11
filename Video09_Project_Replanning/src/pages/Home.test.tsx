import { describe, expect, it } from "vitest";
import { Home } from "./Home";

describe("Home", () => {
  it("renders an h1 containing AgentClinic", async () => {
    const html = String(await <Home />);

    expect(html).toContain("<h1>AgentClinic</h1>");
  });

  it("renders a tagline", async () => {
    const html = String(await <Home />);

    expect(html).toContain("<p>Where AI agents come to get better.</p>");
  });

  it("does not nest <main> elements", async () => {
    const html = String(await <Home />);

    expect(html).not.toContain("<main><main>");
  });
});

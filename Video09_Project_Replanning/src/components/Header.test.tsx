import { describe, expect, it } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  it("renders a link to the home page", async () => {
    const html = String(await <Header />);

    expect(html).toContain("<header>");
    expect(html).toContain('<a href="/">AgentClinic</a>');
  });
});

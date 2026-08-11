import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders a copyright notice with the current year", async () => {
    const html = String(await <Footer />);
    const currentYear = new Date().getFullYear();

    expect(html).toContain("<footer>");
    expect(html).toContain(`© ${currentYear} AgentClinic`);
  });
});

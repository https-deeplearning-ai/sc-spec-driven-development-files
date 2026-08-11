import { describe, expect, it } from "vitest";
import { Layout } from "./Layout";

describe("Layout", () => {
  it("renders the page shell with head metadata and the stylesheet link", async () => {
    const html = String(
      await (
        <Layout>
          <p>page content</p>
        </Layout>
      ),
    );

    expect(html).toContain("<title>AgentClinic</title>");
    expect(html).toContain('<link rel="stylesheet" href="/static/style.css"/>');
  });

  it("renders Header and Footer around the content", async () => {
    const html = String(
      await (
        <Layout>
          <p>page content</p>
        </Layout>
      ),
    );

    expect(html).toContain("<header>");
    expect(html).toContain("<footer>");

    const headerIndex = html.indexOf("<header>");
    const contentIndex = html.indexOf("page content");
    const footerIndex = html.indexOf("<footer>");
    expect(headerIndex).toBeLessThan(contentIndex);
    expect(contentIndex).toBeLessThan(footerIndex);
  });

  it("wraps children in exactly one <main> element", async () => {
    const html = String(
      await (
        <Layout>
          <p>page content</p>
        </Layout>
      ),
    );

    expect(html).toContain("<main><p>page content</p></main>");
    // guards against a regression where a page also wraps its own content in <Main>,
    // producing a nested <main><main>...
    expect(html).not.toContain("<main><main>");
  });
});

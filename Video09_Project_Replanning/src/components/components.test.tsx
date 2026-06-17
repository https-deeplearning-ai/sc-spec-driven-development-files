import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Main } from "./Main";
import { Layout } from "./Layout";

async function render(el: JSX.Element): Promise<string> {
  const testApp = new Hono();
  testApp.get("/", (c) => c.html(el));
  const res = await testApp.request("/");
  return res.text();
}

describe("Header", () => {
  it("renders a <header> element", async () => {
    const html = await render(<Header />);
    expect(html).toContain("<header");
    expect(html).toContain("</header>");
  });

  it("includes a link to the home page", async () => {
    const html = await render(<Header />);
    expect(html).toContain('href="/"');
  });

  it("displays the site name", async () => {
    const html = await render(<Header />);
    expect(html).toContain("AgentClinic");
  });
});

describe("Footer", () => {
  it("renders a <footer> element", async () => {
    const html = await render(<Footer />);
    expect(html).toContain("<footer");
    expect(html).toContain("</footer>");
  });

  it("includes the current year in the copyright notice", async () => {
    const html = await render(<Footer />);
    expect(html).toContain(String(new Date().getFullYear()));
  });

  it("includes the site name in the copyright notice", async () => {
    const html = await render(<Footer />);
    expect(html).toContain("AgentClinic");
  });
});

describe("Main", () => {
  it("renders a <main> element", async () => {
    const html = await render(<Main>content</Main>);
    expect(html).toContain("<main");
    expect(html).toContain("</main>");
  });

  it("renders children inside <main>", async () => {
    const html = await render(<Main><p>hello world</p></Main>);
    expect(html).toContain("<p>hello world</p>");
  });
});

describe("Layout", () => {
  it("renders a complete HTML document structure", async () => {
    const html = await render(<Layout>content</Layout>);
    expect(html).toContain("<html");
    expect(html).toContain("<head");
    expect(html).toContain("<body");
  });

  it("sets the page title to AgentClinic", async () => {
    const html = await render(<Layout>content</Layout>);
    expect(html).toContain("<title>AgentClinic</title>");
  });

  it("links the stylesheet", async () => {
    const html = await render(<Layout>content</Layout>);
    expect(html).toContain("/static/style.css");
  });

  it("includes the Header", async () => {
    const html = await render(<Layout>content</Layout>);
    expect(html).toContain("<header");
  });

  it("includes the Footer", async () => {
    const html = await render(<Layout>content</Layout>);
    expect(html).toContain("<footer");
  });

  it("renders children within the page body", async () => {
    const html = await render(<Layout><p id="marker">test content</p></Layout>);
    expect(html).toContain('<p id="marker">test content</p>');
  });
});

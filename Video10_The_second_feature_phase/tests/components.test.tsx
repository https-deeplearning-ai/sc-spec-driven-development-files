import { describe, it, expect } from "vitest";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import { Main } from "../src/components/Main";
import { Layout } from "../src/components/Layout";

describe("Header", () => {
  it("renders a header element", () => {
    const html = Header({}).toString();
    expect(html).toContain("<header");
  });

  it("links to the home page", () => {
    const html = Header({}).toString();
    expect(html).toContain('href="/"');
  });

  it("displays the site name", () => {
    const html = Header({}).toString();
    expect(html).toContain("AgentClinic");
  });

  it("has a nav linking to Home, Agents, and Ailments", () => {
    const html = Header({}).toString();
    expect(html).toContain("<nav");
    expect(html).toContain('href="/agents"');
    expect(html).toContain('href="/ailments"');
  });
});

describe("Footer", () => {
  it("renders a footer element", () => {
    const html = Footer({}).toString();
    expect(html).toContain("<footer");
  });

  it("displays the current year", () => {
    const html = Footer({}).toString();
    expect(html).toContain(String(new Date().getFullYear()));
  });

  it("displays the site name", () => {
    const html = Footer({}).toString();
    expect(html).toContain("AgentClinic");
  });
});

describe("Main", () => {
  it("renders a main element", () => {
    const html = Main({ children: "content" }).toString();
    expect(html).toContain("<main");
  });

  it("renders children", () => {
    const html = Main({ children: "hello world" }).toString();
    expect(html).toContain("hello world");
  });
});

describe("Layout", () => {
  it("renders an html element with lang attribute", () => {
    const html = Layout({ children: "" }).toString();
    expect(html).toContain('<html lang="en"');
  });

  it("includes a title", () => {
    const html = Layout({ children: "" }).toString();
    expect(html).toContain("<title>AgentClinic</title>");
  });

  it("links the stylesheet", () => {
    const html = Layout({ children: "" }).toString();
    expect(html).toContain('href="/static/style.css"');
  });

  it("renders children", () => {
    const html = Layout({ children: "page content" }).toString();
    expect(html).toContain("page content");
  });

  it("includes header and footer", () => {
    const html = Layout({ children: "" }).toString();
    expect(html).toContain("<header");
    expect(html).toContain("<footer");
  });

  it("includes the viewport meta tag for responsive design", () => {
    const html = Layout({ children: "" }).toString();
    expect(html).toContain('name="viewport"');
    expect(html).toContain("width=device-width");
  });
});

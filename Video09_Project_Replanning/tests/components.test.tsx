import { expect, test } from "vitest";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import { Layout } from "../src/components/Layout";

test("Header renders correctly", async () => {
  const html = Header({}).toString();
  expect(html).toContain('<header>');
  expect(html).toContain('AgentClinic');
});

test("Footer renders correctly", async () => {
  const html = Footer({}).toString();
  expect(html).toContain('<footer>');
});

test("Layout renders with children", async () => {
  const html = Layout({ children: "Test Content" }).toString();
  expect(html).toContain('<html lang="en">');
  expect(html).toContain('Test Content');
  expect(html).toContain('<header>');
  expect(html).toContain('<footer>');
});

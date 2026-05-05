import { expect, test } from "vitest";
import { Home } from "../src/pages/Home";

test("Home page renders correctly", async () => {
  const html = Home().toString();
  expect(html).toContain('<h1>AgentClinic</h1>');
  expect(html).toContain('Where AI agents come to get better.');
  expect(html).toContain('<header>');
  expect(html).toContain('<footer>');
});

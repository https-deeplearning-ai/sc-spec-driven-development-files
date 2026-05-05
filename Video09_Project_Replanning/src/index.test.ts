import { expect, test } from "vitest";
import { app } from "./index";

test("GET / returns 200 OK and contains AgentClinic", async () => {
  const res = await app.request("/");
  expect(res.status).toBe(200);
  const body = await res.text();
  expect(body).toContain("<h1>AgentClinic</h1>");
});

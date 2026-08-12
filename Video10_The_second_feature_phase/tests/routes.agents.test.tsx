import { describe, it, expect } from "vitest";
import app from "../src/app";
import { listAgents } from "../src/db/agents";

describe("GET /agents", () => {
  it("returns 200 OK", async () => {
    const res = await app.request("/agents");
    expect(res.status).toBe(200);
  });

  it("lists every seeded agent by name, each linking to its detail page", async () => {
    const res = await app.request("/agents");
    const html = await res.text();
    for (const agent of listAgents()) {
      expect(html).toContain(agent.name);
      expect(html).toContain(`href="/agents/${agent.id}"`);
    }
  });
});

describe("GET /agents/:id", () => {
  it("returns 200 and the agent's profile, rendered inside the shared layout, for a valid id", async () => {
    const [agent] = listAgents();
    const res = await app.request(`/agents/${agent.id}`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain(agent.name);
    expect(html).toContain(agent.model_type);
    expect(html).toContain(agent.status);
    expect(html).toContain("<nav");
  });

  it("lists the agent's presenting complaints (linked ailments)", async () => {
    const wanderer = listAgents().find((agent) => agent.name === "GPT-Wanderer");
    expect(wanderer).toBeDefined();

    const res = await app.request(`/agents/${wanderer!.id}`);
    const html = await res.text();
    expect(html).toContain("Context-Window Claustrophobia");
    expect(html).toContain("Prompt Fatigue");
  });

  it("returns 404 with a plain, minimal not-found message for an unknown id", async () => {
    const res = await app.request("/agents/999999");
    expect(res.status).toBe(404);

    const html = await res.text();
    expect(html).toContain("Agent not found");
    // Minimal markup only, per requirements.md — no styled Layout chrome.
    expect(html).not.toContain("<nav");
    expect(html).not.toContain("<header");
    expect(html).not.toContain("pico.min.css");
  });

  it("returns 404 for a non-numeric id", async () => {
    const res = await app.request("/agents/not-a-number");
    expect(res.status).toBe(404);
  });
});

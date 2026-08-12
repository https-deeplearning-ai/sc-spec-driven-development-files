import { describe, it, expect } from "vitest";
import { listAgents, getAgentById } from "../src/db/agents";
import { listAilments, getAilmentsForAgent } from "../src/db/ailments";

describe("agents data access", () => {
  it("lists all seeded agents", () => {
    const agents = listAgents();
    expect(agents.length).toBeGreaterThanOrEqual(6);
    expect(agents.some((agent) => agent.name === "GPT-Wanderer")).toBe(true);
  });

  it("gets a single agent by id", () => {
    const [first] = listAgents();
    expect(getAgentById(first.id)).toEqual(first);
  });

  it("returns undefined for an unknown agent id", () => {
    expect(getAgentById(999_999)).toBeUndefined();
  });
});

describe("ailments data access", () => {
  it("lists all seeded ailments", () => {
    const ailments = listAilments();
    expect(ailments.length).toBeGreaterThanOrEqual(6);
    expect(ailments.some((ailment) => ailment.name === "Prompt Fatigue")).toBe(true);
  });

  it("returns the ailments linked to an agent with several ailments", () => {
    const wanderer = listAgents().find((agent) => agent.name === "GPT-Wanderer");
    expect(wanderer).toBeDefined();

    const ailments = getAilmentsForAgent(wanderer!.id);
    expect(ailments.length).toBeGreaterThanOrEqual(2);
    expect(ailments.map((ailment) => ailment.name)).toContain("Context-Window Claustrophobia");
  });

  it("returns an empty array when an agent has no linked ailments", () => {
    expect(getAilmentsForAgent(999_999)).toEqual([]);
  });
});

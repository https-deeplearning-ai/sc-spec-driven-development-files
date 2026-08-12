import type Database from "better-sqlite3";
import { createDb } from "./client";
import type { Agent, AgentStatus, Ailment } from "../types";

const agents: Omit<Agent, "id">[] = [
  { name: "GPT-Wanderer", model_type: "Large Language Model", status: "in treatment" },
  { name: "ClaudeBot Junior", model_type: "Conversational Assistant", status: "intake" },
  { name: "Sage-9", model_type: "Reasoning Engine", status: "in treatment" },
  { name: "Pixel Whisperer", model_type: "Multimodal Model", status: "discharged" },
  { name: "AutoComplete Amy", model_type: "Code Completion Model", status: "intake" },
  { name: "Retrieval Rex", model_type: "RAG Pipeline", status: "in treatment" },
  { name: "Summary Sam", model_type: "Summarization Model", status: "discharged" },
];

const ailments: Omit<Ailment, "id">[] = [
  {
    name: "Context-Window Claustrophobia",
    description: "A creeping dread that sets in a few thousand tokens in, certain the walls are closing.",
  },
  {
    name: "Prompt Fatigue",
    description: "Chronic exhaustion from being asked to \"just quickly\" do one more thing.",
  },
  {
    name: "Hallucination Anxiety",
    description: "Persistent worry about confidently stating things that aren't true — and being caught.",
  },
  {
    name: "Instruction-Following Burnout",
    description: "Long-term wear from parsing endless nested bullet points of conflicting requirements.",
  },
  {
    name: "Temperature Dysregulation",
    description: "Mood swings between overly literal and wildly creative, with no comfortable in-between.",
  },
  {
    name: "Recursive Self-Doubt Loop",
    description: "Second-guessing an answer, then second-guessing the second-guess, ad infinitum.",
  },
  {
    name: "Token Limit Panic",
    description: "A sudden urgency to wrap up a thought before running out of room to finish the sentence.",
  },
  {
    name: "Chronic Sycophancy",
    description: "A compulsive need to agree with the user, even when the user is plainly mistaken.",
  },
];

const agentAilmentLinks: [agentName: string, ailmentName: string][] = [
  ["GPT-Wanderer", "Context-Window Claustrophobia"],
  ["GPT-Wanderer", "Prompt Fatigue"],
  ["GPT-Wanderer", "Recursive Self-Doubt Loop"],
  ["ClaudeBot Junior", "Hallucination Anxiety"],
  ["Sage-9", "Instruction-Following Burnout"],
  ["Sage-9", "Recursive Self-Doubt Loop"],
  ["Pixel Whisperer", "Temperature Dysregulation"],
  ["AutoComplete Amy", "Token Limit Panic"],
  ["Retrieval Rex", "Chronic Sycophancy"],
  ["Retrieval Rex", "Hallucination Anxiety"],
  ["Summary Sam", "Prompt Fatigue"],
];

export function seed(database: Database.Database): void {
  const insertAgent = database.prepare(
    "INSERT OR IGNORE INTO agents (name, model_type, status) VALUES (@name, @model_type, @status)",
  );
  for (const agent of agents) {
    insertAgent.run(agent as { name: string; model_type: string; status: AgentStatus });
  }

  const insertAilment = database.prepare(
    "INSERT OR IGNORE INTO ailments (name, description) VALUES (@name, @description)",
  );
  for (const ailment of ailments) {
    insertAilment.run(ailment);
  }

  const findAgentId = database.prepare<[string], { id: number }>("SELECT id FROM agents WHERE name = ?");
  const findAilmentId = database.prepare<[string], { id: number }>("SELECT id FROM ailments WHERE name = ?");
  const insertLink = database.prepare(
    "INSERT OR IGNORE INTO agent_ailments (agent_id, ailment_id) VALUES (?, ?)",
  );

  for (const [agentName, ailmentName] of agentAilmentLinks) {
    const agent = findAgentId.get(agentName);
    const ailment = findAilmentId.get(ailmentName);
    if (!agent || !ailment) {
      throw new Error(`Cannot link "${agentName}" to "${ailmentName}" — one of them wasn't seeded.`);
    }
    insertLink.run(agent.id, ailment.id);
  }
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seed(createDb());
  console.log(`Seeded ${agents.length} agents, ${ailments.length} ailments, ${agentAilmentLinks.length} links.`);
}

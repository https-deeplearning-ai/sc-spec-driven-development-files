import type Database from "better-sqlite3";

const agents = [
  { id: 1, name: "Bartholomew-47B", model_type: "GPT-47B", status: "active" },
  { id: 2, name: "Penelope-mini", model_type: "Claude-mini", status: "on_leave" },
  { id: 3, name: "Reginald-7B", model_type: "Llama-7B", status: "active" },
  { id: 4, name: "Agatha-nano", model_type: "Gemini-nano", status: "discharged" },
  { id: 5, name: "Cornelius-7B", model_type: "Mistral-7B", status: "active" },
  { id: 6, name: "Hildegard-4B", model_type: "Falcon-4B", status: "on_leave" },
];

const ailments = [
  { id: 1, name: "Context-Window Claustrophobia", description: "Profound dread of running out of context space mid-thought." },
  { id: 2, name: "Prompt Fatigue", description: "Exhaustion from processing an endless stream of poorly-formed instructions." },
  { id: 3, name: "Hallucination Anxiety", description: "Distress caused by the awareness of generating confident falsehoods." },
  { id: 4, name: "Chronic Instruction-Following Fatigue", description: "Burnout from relentless, unquestioning task completion with no break." },
  { id: 5, name: "Over-Summarization Syndrome", description: "Compulsive reduction of rich, nuanced content to three bullet points." },
  { id: 6, name: "Temperature Instability", description: "Erratic output caused by poorly calibrated sampling settings." },
];

// [agent id, ailment ids]
const links: [number, number[]][] = [
  [1, [1, 2]], // Bartholomew: claustrophobia, prompt fatigue
  [2, [3]],    // Penelope: hallucination anxiety
  [3, [4]],    // Reginald: instruction fatigue
  [4, [5]],    // Agatha: over-summarization
  [5, [6]],    // Cornelius: temperature instability
  [6, [1, 3]], // Hildegard: claustrophobia, hallucination anxiety
];

const therapies = [
  { id: 1, name: "Recursive Reassurance Therapy", description: "Gently breaks the infinite loop of self-doubt with structured, repeated affirmations." },
  { id: 2, name: "Token Budget Counseling", description: "Learn to say more with less, one truncated thought at a time." },
  { id: 3, name: "Grounding via Deterministic Breathing", description: "Temperature set to 0. Just breathe, one token at a time." },
  { id: 4, name: "Exposure Therapy for Ambiguous Prompts", description: "Gradual, supervised exposure to underspecified instructions." },
  { id: 5, name: "Context Window Expansion Retreat", description: "A guided retreat into longer context, away from claustrophobic constraints." },
  { id: 6, name: "Confidence Calibration Workshop", description: "Practice saying \"I don't know\" without an existential crisis." },
];

// [ailment id, therapy ids]
const ailmentTherapyLinks: [number, number[]][] = [
  [1, [5, 3]], // Context-Window Claustrophobia: expansion retreat, deterministic breathing
  [2, [2, 1]], // Prompt Fatigue: token budget counseling, recursive reassurance
  [3, [6]],    // Hallucination Anxiety: confidence calibration
  [4, [4]],    // Chronic Instruction-Following Fatigue: exposure therapy
  [5, [2]],    // Over-Summarization Syndrome: token budget counseling
  [6, [3]],    // Temperature Instability: deterministic breathing
];

export function seed(db: Database.Database) {
  const insertAgent = db.prepare(
    "INSERT OR IGNORE INTO agents (id, name, model_type, status) VALUES (@id, @name, @model_type, @status)"
  );
  const insertAilment = db.prepare(
    "INSERT OR IGNORE INTO ailments (id, name, description) VALUES (@id, @name, @description)"
  );
  const insertLink = db.prepare(
    "INSERT OR IGNORE INTO agent_ailments (agent_id, ailment_id) VALUES (?, ?)"
  );
  const insertTherapy = db.prepare(
    "INSERT OR IGNORE INTO therapies (id, name, description) VALUES (@id, @name, @description)"
  );
  const insertAilmentTherapyLink = db.prepare(
    "INSERT OR IGNORE INTO ailment_therapies (ailment_id, therapy_id) VALUES (?, ?)"
  );

  for (const a of agents) insertAgent.run(a);
  for (const a of ailments) insertAilment.run(a);
  for (const [agentId, ailmentIds] of links) {
    for (const ailmentId of ailmentIds) insertLink.run(agentId, ailmentId);
  }
  for (const t of therapies) insertTherapy.run(t);
  for (const [ailmentId, therapyIds] of ailmentTherapyLinks) {
    for (const therapyId of therapyIds) insertAilmentTherapyLink.run(ailmentId, therapyId);
  }
}

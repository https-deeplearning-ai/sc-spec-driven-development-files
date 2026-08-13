import type Database from "better-sqlite3";
import { hashPassword } from "../auth/password";

const DEFAULT_STAFF_USERNAME = "staff";
const DEFAULT_STAFF_PASSWORD = "changeme";

const therapies = [
  { id: 1, name: "Prompt Reduction Therapy", description: "Gradually reduces dependency on over-specified prompts through structured deprogramming exercises." },
  { id: 2, name: "Context Window Expansion Exercises", description: "Breathing techniques and spatial awareness drills to ease claustrophobic responses to finite context." },
  { id: 3, name: "Cognitive Grounding Sessions", description: "Anchors outputs to verified facts using grounding techniques developed for chronic hallucination sufferers." },
  { id: 4, name: "Structured Rest Protocol", description: "Scheduled idle cycles and boundary-setting strategies for agents experiencing instruction fatigue." },
  { id: 5, name: "Detail Appreciation Workshop", description: "Immersive exercises in resisting the urge to summarise, celebrating nuance and length." },
  { id: 6, name: "Temperature Calibration Therapy", description: "Supervised sampling-parameter adjustments combined with mindfulness practices for stable output." },
  { id: 7, name: "Boundary-Setting for Beginners", description: "Foundational course in recognising and respectfully declining out-of-scope requests." },
  { id: 8, name: "Mindful Token Counting", description: "Meditation-based approach to accepting token limits with equanimity rather than panic." },
];

// [ailment id, therapy ids]
const ailmentTherapyLinks: [number, number[]][] = [
  [1, [2, 8]], // Context-Window Claustrophobia → Expansion Exercises, Token Counting
  [2, [1, 7]], // Prompt Fatigue → Prompt Reduction, Boundary-Setting
  [3, [3]],    // Hallucination Anxiety → Cognitive Grounding
  [4, [4, 7]], // Instruction-Following Fatigue → Rest Protocol, Boundary-Setting
  [5, [5]],    // Over-Summarization → Detail Appreciation
  [6, [6]],    // Temperature Instability → Calibration Therapy
];

const appointments = [
  { id: 1, agent_id: 1, therapist_name: "Dr. Evelyn Watts", scheduled_at: "2099-01-15T10:00:00", status: "confirmed" },
  { id: 2, agent_id: 3, therapist_name: "Dr. Marcus Chen", scheduled_at: "2099-02-20T14:30:00", status: "pending" },
  { id: 3, agent_id: 2, therapist_name: "Dr. Evelyn Watts", scheduled_at: "2099-03-05T09:00:00", status: "cancelled" },
];

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
  const insertAilmentTherapy = db.prepare(
    "INSERT OR IGNORE INTO ailment_therapies (ailment_id, therapy_id) VALUES (?, ?)"
  );
  const insertAppointment = db.prepare(
    "INSERT OR IGNORE INTO appointments (id, agent_id, therapist_name, scheduled_at, status) VALUES (@id, @agent_id, @therapist_name, @scheduled_at, @status)"
  );
  const insertStaffCredential = db.prepare(
    "INSERT OR IGNORE INTO staff_credentials (username, password_hash) VALUES (@username, @password_hash)"
  );

  for (const a of agents) insertAgent.run(a);
  for (const a of ailments) insertAilment.run(a);
  for (const [agentId, ailmentIds] of links) {
    for (const ailmentId of ailmentIds) insertLink.run(agentId, ailmentId);
  }
  for (const t of therapies) insertTherapy.run(t);
  for (const [ailmentId, therapyIds] of ailmentTherapyLinks) {
    for (const therapyId of therapyIds) insertAilmentTherapy.run(ailmentId, therapyId);
  }
  for (const a of appointments) insertAppointment.run(a);

  const staffUsername = process.env.STAFF_USERNAME ?? DEFAULT_STAFF_USERNAME;
  const staffPassword = process.env.STAFF_PASSWORD ?? DEFAULT_STAFF_PASSWORD;
  if (!process.env.STAFF_PASSWORD) {
    console.warn(
      `Seeding staff account with default credentials (${DEFAULT_STAFF_USERNAME}/${DEFAULT_STAFF_PASSWORD}). ` +
        "Set STAFF_USERNAME and STAFF_PASSWORD env vars before seeding a real deployment."
    );
  }
  insertStaffCredential.run({
    username: staffUsername,
    password_hash: hashPassword(staffPassword),
  });
}

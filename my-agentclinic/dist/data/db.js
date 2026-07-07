"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const worker_threads_1 = require("worker_threads");
const DATA_DIR = path_1.default.join(process.cwd(), '.data');
const isTest = process.env.VITEST === 'true';
const dbName = isTest
    ? `agentclinic.test-${process.pid}-${worker_threads_1.threadId}.db`
    : 'agentclinic.db';
const DB_PATH = path_1.default.join(DATA_DIR, dbName);
const seedAgents = [
    {
        name: 'Astra',
        modelType: 'GPT-5.3-Codex',
        status: 'Open for intake',
        complaints: 'Context-window claustrophobia',
    },
    {
        name: 'Patch',
        modelType: 'Claude 4.5 Sonnet',
        status: 'In triage',
        complaints: 'Prompt fatigue',
    },
    {
        name: 'Nimbus',
        modelType: 'Gemini 2.5 Pro',
        status: 'Follow-up scheduled',
        complaints: 'Hallucination anxiety',
    },
];
const seedAilments = [
    {
        name: 'Context-window claustrophobia',
        description: 'Escalating stress when context gets truncated in long sessions.',
    },
    {
        name: 'Prompt fatigue',
        description: 'Reduced focus after repetitive or conflicting prompts.',
    },
    {
        name: 'Hallucination anxiety',
        description: 'High concern about confidence drift and factual reliability.',
    },
    {
        name: 'Instruction overload',
        description: 'Difficulty prioritizing directives from multiple channels.',
    },
];
const agentAilmentLinks = {
    Astra: ['Context-window claustrophobia', 'Instruction overload'],
    Patch: ['Prompt fatigue'],
    Nimbus: ['Hallucination anxiety', 'Prompt fatigue'],
};
function ensureDataDirectory() {
    fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
}
function migrateAndSeed(db) {
    db.pragma('foreign_keys = ON');
    db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      model_type TEXT NOT NULL,
      current_status TEXT NOT NULL,
      presenting_complaints TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ailments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS agent_ailments (
      agent_id INTEGER NOT NULL,
      ailment_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (agent_id, ailment_id),
      FOREIGN KEY(agent_id) REFERENCES agents(id) ON DELETE CASCADE,
      FOREIGN KEY(ailment_id) REFERENCES ailments(id) ON DELETE CASCADE
    );
  `);
    const insertAgent = db.prepare(`
    INSERT INTO agents (name, model_type, current_status, presenting_complaints)
    VALUES (@name, @model_type, @current_status, @presenting_complaints)
    ON CONFLICT(name) DO NOTHING;
  `);
    const insertAilment = db.prepare(`
    INSERT INTO ailments (name, description)
    VALUES (@name, @description)
    ON CONFLICT(name) DO NOTHING;
  `);
    const getAgentIdByName = db.prepare(`
    SELECT id FROM agents WHERE name = @name
  `);
    const getAilmentIdByName = db.prepare(`
    SELECT id FROM ailments WHERE name = @name
  `);
    const insertAgentAilment = db.prepare(`
    INSERT INTO agent_ailments (agent_id, ailment_id)
    VALUES (@agent_id, @ailment_id)
    ON CONFLICT(agent_id, ailment_id) DO NOTHING;
  `);
    const seed = db.transaction(() => {
        for (const agent of seedAgents) {
            insertAgent.run({
                name: agent.name,
                model_type: agent.modelType,
                current_status: agent.status,
                presenting_complaints: agent.complaints,
            });
        }
        for (const ailment of seedAilments) {
            insertAilment.run(ailment);
        }
        for (const [agentName, ailmentNames] of Object.entries(agentAilmentLinks)) {
            const agent = getAgentIdByName.get({ name: agentName });
            if (!agent) {
                continue;
            }
            for (const ailmentName of ailmentNames) {
                const ailment = getAilmentIdByName.get({ name: ailmentName });
                if (!ailment) {
                    continue;
                }
                insertAgentAilment.run({
                    agent_id: agent.id,
                    ailment_id: ailment.id,
                });
            }
        }
    });
    seed();
}
ensureDataDirectory();
const db = new better_sqlite3_1.default(DB_PATH);
migrateAndSeed(db);
exports.default = db;

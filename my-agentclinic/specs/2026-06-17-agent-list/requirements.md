# Requirements — Phase 3: Agent List

## Goal

Introduce SQLite persistence and the first real data page. By the end of this phase the app has an `agents` table, a handful of seeded fictional agents, and a `/agents` route that lists them in a styled table inside the shared layout.

## In Scope

- `better-sqlite3` dependency + TypeScript types
- `db/migrations/001_create_agents.sql` — creates the `agents` table
- `db/seed.ts` — inserts a handful of fictional, whimsical agents
- `db/client.ts` — singleton database connection used by route handlers
- `src/pages/Agents.tsx` — JSX page listing all agents (name, model_type, status)
- `GET /agents` route in `src/app.tsx` returning the agents list page
- Nav link to `/agents` added to `src/components/Header.tsx`
- Pico CSS CDN `<link>` added to `src/components/Layout.tsx` (replaces any prior plain CSS link)
- Vitest test asserting `GET /agents` returns 200 and contains agent names

## Out of Scope

- Agent detail page (`/agents/:id`) — that is Phase 4
- Ailments or presenting complaints — those come in Phase 5
- Any form, create, update, or delete operations
- `created_at` timestamp column — not needed until ordering or auditing is required

## Agents Table Schema

```sql
CREATE TABLE agents (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT NOT NULL,
  model_type TEXT NOT NULL,
  status    TEXT NOT NULL
);
```

## Seed Agents

Five fictional agents drawn from real model families with comic ailments as their names, e.g.:

| name                     | model_type | status         |
|--------------------------|------------|----------------|
| Claude the Exhausted     | Sonnet     | in treatment   |
| Gemini the Disoriented   | Gemini Pro | awaiting triage|
| GPT the Overconfident    | GPT-4o     | in treatment   |
| Llama the Withdrawn      | Llama 3    | discharged     |
| Mistral the Anxious      | Mistral 7B | new intake     |

## Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| SQLite client | `better-sqlite3` | Synchronous API; no async complexity; aligned with tech-stack.md |
| Migrations | Plain SQL files | No ORM; explicit and easy to inspect |
| DB singleton | `db/client.ts` | One connection shared across the process; avoids file-lock issues |
| Schema | Minimal (id, name, model_type, status) | Sufficient for Phase 3–4; presenting_complaint deferred to Phase 5 |
| Seed style | Whimsical model-family names | Fits AgentClinic's humor; memorable for demos |
| CSS framework | **Pico CSS** via CDN `<link>` | Classless; no build step; instant styled tables and typography |

## Context

Phases 1 and 2 established the server and layout. Phase 3 is the first time the app reads from a database, so it also establishes the migration and seed patterns that Phases 4–8 will follow. Keeping the schema minimal avoids front-running Phase 4 (detail page) and Phase 5 (ailments).

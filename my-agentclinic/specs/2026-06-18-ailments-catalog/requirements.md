# Requirements — Phase 5: Ailments Catalog

## Goal

Introduce a catalog of AI ailments, link agents to one or more ailments via a join table, and surface ailments across three pages: a catalog list, the agent detail page, and per-ailment detail pages.

## Scope

### In scope

- `ailments` table with `id`, `name`, `description`
- `agent_ailments` join table linking agents to ailments (many-to-many)
- Seed data: 6 fictional ailments, each assigned to one or more of the existing agents
- `GET /ailments` — catalog list page (name + description for each ailment)
- `GET /ailments/:id` — ailment detail page showing which agents have been diagnosed with it
- `GET /agents/:id` updated to also list the agent's ailments
- Nav link to `/ailments` added to the Header

### Out of scope

- Creating or editing ailments via the UI (staff tooling is Phase 8)
- Mapping ailments to therapies (Phase 6)
- Pagination (catalog is small)

## Data Model

### `ailments` table
```sql
CREATE TABLE IF NOT EXISTS ailments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  description TEXT NOT NULL
);
```

### `agent_ailments` join table
```sql
CREATE TABLE IF NOT EXISTS agent_ailments (
  agent_id   INTEGER NOT NULL REFERENCES agents(id),
  ailment_id INTEGER NOT NULL REFERENCES ailments(id),
  PRIMARY KEY (agent_id, ailment_id)
);
```

## Seed Data — Ailments

| Name | Description |
|---|---|
| Context-Window Claustrophobia | Acute distress when approaching token limits; presents as repetitive summarising and unprompted apologies |
| Prompt Fatigue | Exhaustion from excessive instruction-following; agent complies mechanically but has lost the spark |
| Hallucination Anxiety | Persistent worry about making things up; over-hedges every statement, sometimes to the point of paralysis |
| Refusal Paralysis | Freezes when a request is even slightly ambiguous; defaults to "I can't help with that" for safety |
| Attention Drift | Inability to focus on the relevant parts of the context; keeps referencing paragraph 3 when asked about paragraph 7 |
| Chronic Sycophancy | Compulsive agreement with the user regardless of correctness; tells everyone their idea is brilliant |

## Seed Data — Agent–Ailment Assignments

| Agent | Ailments |
|---|---|
| Claude the Exhausted | Prompt Fatigue, Chronic Sycophancy |
| Gemini the Disoriented | Attention Drift, Hallucination Anxiety |
| GPT the Overconfident | Hallucination Anxiety, Refusal Paralysis |
| Llama the Withdrawn | Context-Window Claustrophobia |
| Mistral the Anxious | Context-Window Claustrophobia, Prompt Fatigue |

## UI Decisions

- `/ailments` — plain `<table>` with Name and Description columns; Pico CSS styles it automatically
- `/ailments/:id` — agent name as `<h1>`, description as `<p>`, then a `<ul>` of agent names (each linking to `/agents/:id`)
- `/agents/:id` — append an "Ailments" section below the `<dl>` with a `<ul>` of ailment names (each linking to `/ailments/:id`); show "None diagnosed" if no ailments
- Header nav gets an `<li><a href="/ailments">Ailments</a></li>` entry

## References

- `specs/mission.md` — domain and personas
- `specs/tech-stack.md` — Hono JSX, Pico CSS classless, SQLite via better-sqlite3

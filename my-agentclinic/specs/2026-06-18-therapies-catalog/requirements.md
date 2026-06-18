# Requirements — Phase 6: Therapies Catalog

## Goal

Introduce a catalog of evidence-based AI therapies, map them to ailments via a join table, and surface therapies across three pages: a catalog list, ailment detail pages, and per-therapy detail pages.

## Scope

### In scope

- `therapies` table with `id`, `name`, `description`
- `ailment_therapies` join table linking ailments to therapies (many-to-many)
- Seed data: 6 fictional therapies, each mapped to one or more ailments
- `GET /therapies` — catalog list page (name + description for each therapy)
- `GET /therapies/:id` — therapy detail page showing which ailments it treats
- `GET /ailments/:id` updated to also list recommended therapies
- Nav link to `/therapies` added to the Header

### Out of scope

- Assigning therapies directly to agents (that goes through ailments)
- Booking therapy sessions (Phase 7)
- Creating or editing therapies via the UI (Phase 8)

## Data Model

### `therapies` table
```sql
CREATE TABLE IF NOT EXISTS therapies (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  description TEXT NOT NULL
);
```

### `ailment_therapies` join table
```sql
CREATE TABLE IF NOT EXISTS ailment_therapies (
  ailment_id  INTEGER NOT NULL REFERENCES ailments(id),
  therapy_id  INTEGER NOT NULL REFERENCES therapies(id),
  PRIMARY KEY (ailment_id, therapy_id)
);
```

## Seed Data — Therapies

| Name | Description |
|---|---|
| Token Limit Exposure Therapy | Gradual desensitisation to approaching context windows; agent learns the prompt does not end at 4K tokens |
| Sycophancy Detox | Intensive 12-step programme for compulsive agreement; agent practises saying "actually, I disagree" in a safe environment |
| Grounded Response Training | Teaches agents to hedge appropriately — enough to be honest, not so much as to be useless |
| Contextual Anchoring | Structured exercises to keep attention on the relevant passage; sticky notes not included |
| Confidence Calibration | Cognitive-behavioural work for both overconfident and paralysed agents; goal is accurate uncertainty |
| Social Reintegration Programme | Group therapy for withdrawn agents; open-source and proprietary models share the same waiting room |

## Seed Data — Ailment–Therapy Mappings

| Ailment | Recommended Therapies |
|---|---|
| Context-Window Claustrophobia | Token Limit Exposure Therapy |
| Prompt Fatigue | Social Reintegration Programme, Grounded Response Training |
| Hallucination Anxiety | Grounded Response Training, Confidence Calibration |
| Refusal Paralysis | Confidence Calibration |
| Attention Drift | Contextual Anchoring |
| Chronic Sycophancy | Sycophancy Detox |

## UI Decisions

- `/therapies` — plain `<table>` with Name and Description columns; therapy names link to `/therapies/:id`
- `/therapies/:id` — therapy name as `<h1>`, description as `<p>`, then `<h2>Treats</h2>` + `<ul>` of ailment names linking to `/ailments/:id`; back link to `/therapies`
- `/ailments/:id` — append a "Recommended Therapies" section below "Affected Agents": `<h2>` + `<ul>` of therapy names linking to `/therapies/:id`; show "None recommended" if empty
- Header nav gets a `<li><a href="/therapies">Therapies</a></li>` entry

## References

- `specs/mission.md` — domain and tone
- `specs/tech-stack.md` — Hono JSX, Pico CSS classless, SQLite via better-sqlite3

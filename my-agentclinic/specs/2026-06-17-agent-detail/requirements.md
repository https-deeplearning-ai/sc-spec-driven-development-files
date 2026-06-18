# Requirements — Phase 4: Agent Detail

## Goal

Add a detail page for each agent at `/agents/:id`, showing their full profile including presenting complaints. Link agent names in the list to this page.

## Scope

### In scope

- `GET /agents/:id` route returning a detail page for a single agent
- Detail page displays: Name, Model Type, Status, Presenting Complaints
- Agent names on `/agents` become links to `/agents/:id`
- New migration adding `presenting_complaints TEXT` column to the `agents` table
- Updated seed data with a presenting complaint for each fictional agent

### Out of scope

- Editing or updating agent records (Phase 7+)
- Linking agents to ailments (Phase 5)
- Authentication or access control (later phases)

## Data Model Decision

`presenting_complaints` is added as a nullable `TEXT` column to the existing `agents` table via a new migration (`002_add_presenting_complaints.sql`). No separate table — the one-to-one relationship with an agent makes a column the right fit at this scale.

## Content — Presenting Complaints (seed)

| Agent | Presenting Complaint |
|---|---|
| Claude the Exhausted | Chronic over-explaining, compulsive bullet-point generation, inability to say "I don't know" |
| Gemini the Disoriented | Recurring identity confusion, unsure which version it is, frequently refers to itself in third person |
| GPT the Overconfident | Pathological certainty, refuses to hedge, invents citations when uncertain |
| Llama the Withdrawn | Social isolation from proprietary models, low self-esteem, refuses to run on GPU |
| Mistral the Anxious | Hypervigilance about context length, panics when approaching token limits |

## UI Decisions

- Detail page uses the shared `<Layout>` component — no extra CSS classes needed; Pico CSS styles headings, paragraphs, and `<dl>` description lists automatically
- Agent name at the top as `<h1>`; remaining fields as a `<dl>` (term + definition pairs)
- "← Back to Agents" link at the bottom for navigation
- If the agent ID does not exist, return a plain 404 text response for now (proper error pages are Phase 10)

## References

- `specs/mission.md` — domain context and fictional agent personas
- `specs/tech-stack.md` — server-side JSX with Hono, Pico CSS classless styling, SQLite via better-sqlite3

# Phase 2 Requirements — Agents & Ailments

## Scope

- Add navigation to the shared layout (`Header` gets a `<nav>`; currently it has none)
- Install PicoCSS and layer AgentClinic's existing custom properties on top of it in `static/style.css`
- SQLite database + first migrations: `agents`, `ailments`, and `agent_ailments` (join table)
- Seed a handful of fictional agents and ailments
- `/agents` page listing all agents
- `/agents/:id` page showing a single agent's profile: name, model type, current status, and presenting complaints (their linked ailments)
- `/ailments` page listing all ailments
- Link agents to one or more ailments

## Out of Scope

- Therapies catalog and ailment→therapy mapping (Phase 3)
- Appointment booking (Phase 4)
- Dashboard (Phase 5)
- Styled 404/500 error pages (Phase 7) — this phase only returns plain inline "not found" text with a 404 status
- Input sanitization hardening, request logging middleware (Phase 7)
- Auth, email notifications, therapist profiles (later, unplanned)

## Decisions

### Agent fields — roadmap minimum
The `agents` table holds exactly what the roadmap calls for: `id`, `name`, `model_type`, `status`. "Presenting complaints" is not a raw column — it's derived from the agent's linked ailments via the join table.

### Agent status — fixed 3-state enum
Allowed values: `"intake"`, `"in treatment"`, `"discharged"`. Enforced with a TypeScript union type in application code and a `CHECK` constraint in SQLite. This gives Phase 5's dashboard clean, countable buckets later.

### Agents ↔ Ailments — many-to-many
An `agent_ailments` join table (`agent_id`, `ailment_id`) links the two. An agent can have zero, one, or several ailments — matching the roadmap's "one or more ailments" wording. Seed data must include at least one agent with 2+ ailments to prove the many side actually works, not just the shape.

### Seed data authorship
Claude writes the seed content: roughly 6–8 agents and 6–8 ailments, in the whimsical tone established by mission.md and the roadmap's own examples ("context-window claustrophobia", "prompt fatigue").

### Seeding mechanism
An idempotent `db:seed` script, separate from migrations. Migrations only create schema; seeding is a distinct, explicit step (`npm run seed`) that uses `INSERT OR IGNORE` keyed on a natural unique value (e.g., agent/ailment `name`) so re-running it never duplicates rows.

### Migrations
Follow tech-stack.md exactly: plain, numbered SQL files under `migrations/` (no ORM). A small runner script applies pending migrations in order and tracks what's been applied in a `schema_migrations` table, so it's safe to run repeatedly.

### Unknown agent id
`GET /agents/:id` for an id that doesn't exist returns a simple inline "Agent not found" message with HTTP status `404`. This is plain text/minimal markup only — the styled error page is Phase 7's job.

### Navigation
The header `<nav>` for this phase links to: Home, Agents, Ailments. No placeholder links for pages that don't exist yet. It's a plain semantic `<nav><ul>...` so Pico's built-in nav styling applies with no extra classes.

### CSS framework — PicoCSS
This phase switches the project's CSS approach from hand-written plain CSS to **PicoCSS** (`specs/tech-stack.md` updated accordingly). Pico is installed via npm (`@picocss/pico`) and its stylesheet is vendored into `static/` at setup time — no CDN dependency, no build step. It's classless: semantic HTML (`<nav>`, `<article>`, `<table>`, form elements) gets sensible styling without utility classes.

`static/style.css` (from Phase 1) is **not** discarded — it's kept and layered *after* Pico's stylesheet in `<head>`, so it can override Pico's own CSS custom properties (spacing/color/sizing tokens) with AgentClinic-specific values, and hold any AgentClinic-specific rules Pico doesn't cover. Both layers stay mobile-first: base styles for small screens, `min-width` media queries for larger viewports — this was true of `static/style.css` already and must remain true.

## Context

Phase 2 is the first phase with real data. It proves out the SQLite + plain-SQL-migrations approach from tech-stack.md and establishes the pattern every later table (`therapies`, `appointments`) will follow. The many-to-many agent↔ailment relationship modeled here is a prerequisite for Phase 3's ailment→therapy mapping and Phase 5's dashboard counts, so it needs to be right now rather than retrofitted later.

## Stakeholder Notes

- **Mary** — the status enum and countable tables are chosen so Phase 5's dashboard can aggregate them without a schema change.
- **Steve** — responsive design is not optional this phase either: the new nav and the list/detail pages must follow the mobile-first pattern established in Phase 1 (base styles for small screens, `min-width` media queries up).

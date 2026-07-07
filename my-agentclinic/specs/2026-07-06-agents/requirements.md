# Requirements — Phase 3: Agents And Ailments

## Scope

Implement full Phase 3 from the roadmap: data-backed agents and ailments with route coverage for list and detail pages.

This phase includes:

- SQLite setup via `better-sqlite3`
- Initial migration for `agents`, `ailments`, and `agent_ailments` tables
- Seed data for a small set of fictional agents
- Seed data for core ailments
- Agent-to-ailment linking records
- `GET /agents` route that renders a server-side HTML list inside the shared layout
- `GET /agents/:id` route for a single agent profile (name, model type, current status, presenting complaints, linked ailments)
- `GET /ailments` route that renders a server-side list of ailments
- PicoCSS integrated into the shared layout for baseline responsive styling

Phase 3 excludes therapies, booking flows, staff dashboard features, and hardening work from later phases.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Database | SQLite + `better-sqlite3` | Matches project stack and keeps setup lightweight |
| Migration style | Plain SQL files | Explicitly aligned to `specs/tech-stack.md` (no ORM) |
| Relationship model | `agent_ailments` join table | Supports many-to-many mapping between agents and ailments |
| Render strategy | Server-side HTML via existing layout components | Preserves architecture: no client framework |
| Styling approach | PicoCSS | Fast, accessible baseline styling without adding a client framework |
| Seed strategy | Deterministic seed script/data | Makes tests and local verification repeatable |
| Route surface | `GET /agents`, `GET /agents/:id`, `GET /ailments` | Covers full Phase 3 behavior from roadmap |

## Context

- Mission alignment: this phase introduces clinical records and concerns in a way that supports the core user journey from intake visibility to issue tracking.
- Stakeholder alignment:
  - Mary (Engineering): TypeScript + reliable, mainstream stack (Express + SQLite) remains intact.
  - Susan (Product): starts delivery of the agents domain from the planned feature set.
  - Steve (Marketing): route renders inside existing responsive layout patterns.
- Stack constraints from `specs/tech-stack.md`:
  - No ORM.
  - Server-side rendering only.
  - PicoCSS is used for baseline responsive styles in this slice.
  - Testing via Vitest + supertest.

## Out Of Scope

- Therapies catalog and recommendations mapping (Phase 4)
- Appointment booking flow (Phase 5)
- Staff dashboard management UI (Phase 6)
- Auth, reporting, and non-phase-3 hardening concerns

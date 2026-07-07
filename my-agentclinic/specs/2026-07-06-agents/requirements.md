# Requirements — Phase 3 Slice: Agents Listing

## Scope

Implement the first shippable slice of Phase 3 (Agents & Ailments): a working agents listing feature backed by SQLite.

This slice includes:

- SQLite setup via `better-sqlite3`
- Initial migration for `agents` table
- Seed data for a small set of fictional agents
- `GET /agents` route that renders a server-side HTML list inside the shared layout
- PicoCSS integrated into the shared layout for baseline responsive styling

This slice does not yet include agent profile details, ailments pages, or relational linking.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Database | SQLite + `better-sqlite3` | Matches project stack and keeps setup lightweight |
| Migration style | Plain SQL files | Explicitly aligned to `specs/tech-stack.md` (no ORM) |
| Render strategy | Server-side HTML via existing layout components | Preserves architecture: no client framework |
| Styling approach | PicoCSS | Fast, accessible baseline styling without adding a client framework |
| Seed strategy | Deterministic seed script/data | Makes tests and local verification repeatable |
| Route surface | `GET /agents` only | Small, independently shippable phase slice |

## Context

- Mission alignment: this directly supports the core audience flow by introducing real agent records in the product and moving from static pages to data-backed behavior.
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

- `GET /agents/:id` profile page
- `ailments` table and routes
- Agent-to-ailment join/linking
- Booking, dashboard, auth, and hardening concerns from later phases

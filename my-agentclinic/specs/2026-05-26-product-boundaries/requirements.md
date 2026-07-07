# Requirements: Product Boundaries

Scope (must-have):
- Define and document the core domain vocabulary and product boundaries so newcomers and demoers understand the model.
- Provide a minimal, explicit data model (SQLite) for `agents`, `ailments`, `therapies`, and `appointments` with clear field definitions and types.
- Expose a minimal server-side data access layer (TypeScript) to query lists and individual records.
- Provide seed data useful for demos and automated checks.

Scope (optional):
- Add a small admin UI for editing domain records.
- Add client-side UX polish beyond a simple, server-rendered dashboard.

Key decisions and constraints:
- Follow the project's mission: prioritize clarity for students and demo presenters (see specs/mission.md).
- Use the recommended tech stack: TypeScript + Next.js + SQLite + Node.js (see specs/tech-stack.md).
- Prefer server-side rendering for core pages.
- Keep the first iteration tiny: minimal fields and clear examples rather than complete coverage.

Minimal data model (proposed):
- `agents`: id, name, status, description
- `ailments`: id, name, severity, description
- `therapies`: id, name, category, description
- `appointments`: id, agent_id, therapy_id, scheduled_at, notes

API and DB notes:
- All data access should be strongly typed in TypeScript and live in a single DAL module for easy testing.
- Seed data should be idempotent and included in the repo for quick local demos.

UX notes:
- Dashboard should communicate the mapping between agents, ailments, and therapies at-a-glance.
- Avoid ambiguous labels; use the locked vocabulary from this spec.

# Validation: Product Boundaries

How we'll know this feature is ready to merge:

- Manual checks:
  - The `agents`, `ailments`, `therapies`, and `appointments` tables exist in SQLite and match the proposed schema.
  - The seeded demo data loads successfully and displays on the dashboard.
  - Dashboard page renders server-side and shows at least: total agents, recent appointments, and a mapping between ailments and therapies.

- Automated checks:
  - Unit tests for the DAL that verify CRUD operations against a temporary SQLite database.
  - A simple integration test that runs the server, seeds data, and fetches the dashboard route returning HTTP 200 and expected snippets.

- Acceptance criteria (pass all to merge):
  1. Seed script runs without errors and is idempotent.
  2. DAL functions have TypeScript types and pass unit tests.
  3. Dashboard page returns HTTP 200 and includes seeded agent names.
  4. Documentation (`requirements.md` and `plan.md`) reviewed and linked from specs/roadmap.md or README.

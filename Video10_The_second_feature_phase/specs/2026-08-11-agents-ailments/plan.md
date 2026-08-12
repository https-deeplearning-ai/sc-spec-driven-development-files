# Phase 2 Plan — Agents & Ailments

## Group 1 — Dependencies & Migration Infrastructure

1. Install `better-sqlite3` (pin exact version, no `^` prefix) and `@types/better-sqlite3` as a dev dependency
2. Install `@picocss/pico` (pin exact version, no `^` prefix)
3. Create a `migrations/` directory for numbered, plain SQL files
4. Write a small migration runner (`src/db/migrate.ts`) that applies pending migrations in order and records what's been applied in a `schema_migrations` table
5. Add `"migrate": "tsx src/db/migrate.ts"` to `package.json` scripts
6. Create `src/db/client.ts` exporting a singleton `better-sqlite3` `Database` instance (path e.g. `data/agentclinic.db`); add `data/` to `.gitignore` (keep the directory with a `.gitkeep`)

## Group 2 — Agents Schema & Data Access

7. `migrations/0001_create_agents.sql`: `agents` table — `id INTEGER PRIMARY KEY`, `name TEXT NOT NULL`, `model_type TEXT NOT NULL`, `status TEXT NOT NULL CHECK(status IN ('intake','in treatment','discharged'))`
8. `src/types.ts`: `Agent` type and `AgentStatus` union type (`"intake" | "in treatment" | "discharged"`)
9. `src/db/agents.ts`: typed query functions — `listAgents()`, `getAgentById(id)`

## Group 3 — Ailments Schema, Join Table & Data Access

10. `migrations/0002_create_ailments.sql`: `ailments` table — `id INTEGER PRIMARY KEY`, `name TEXT NOT NULL UNIQUE`, `description TEXT NOT NULL`
11. `migrations/0003_create_agent_ailments.sql`: `agent_ailments` join table — `agent_id INTEGER NOT NULL REFERENCES agents(id)`, `ailment_id INTEGER NOT NULL REFERENCES ailments(id)`, `UNIQUE(agent_id, ailment_id)`
12. Add `Ailment` type to `src/types.ts`
13. `src/db/ailments.ts`: `listAilments()`, `getAilmentsForAgent(agentId)`

## Group 4 — Seed Script

14. `src/db/seed.ts`: idempotent seed — inserts ~6–8 whimsical agents, ~6–8 whimsical ailments, and `agent_ailments` links (at least one agent with 2+ ailments); uses `INSERT OR IGNORE` keyed on unique `name` columns
15. Add `"seed": "tsx src/db/seed.ts"` to `package.json` scripts
16. Confirm `npm run migrate && npm run seed` works end-to-end from a clean checkout and is safe to run twice in a row

## Group 5 — Routes & Pages

17. Add `<nav>` to `src/components/Header.tsx` with links: Home, Agents, Ailments — plain semantic `<nav><ul>...</ul></nav>` so Pico styles it with no extra classes
18. `src/pages/Agents.tsx`: lists all agents (name, model type, status), each linking to its detail page; rendered inside `<Layout>`
19. `src/pages/AgentDetail.tsx`: single agent profile — name, model type, status, and its linked ailments; renders a plain "Agent not found" message when the id doesn't resolve
20. `src/pages/Ailments.tsx`: lists all ailments (name, description)
21. Register `GET /agents`, `GET /agents/:id`, `GET /ailments` in `src/app.tsx`; the agent-detail route returns HTTP 404 for an unknown id

## Group 6 — Styling (PicoCSS)

22. Copy Pico's **classless** stylesheet from `node_modules/@picocss/pico/css/pico.classless.min.css` into `static/pico.min.css` (vendored, not a CDN link) — the classless build, not the default one, since it styles bare `body > header/main/footer` directly without requiring a `.container` class
23. Update `src/components/Layout.tsx` `<head>` to link `/static/pico.min.css` **before** the existing `/static/style.css`, so AgentClinic's rules load after and can override Pico's variables
24. Trim `static/style.css` down to AgentClinic-specific concerns now that Pico's classless build supplies reset/typography/base element styles and the mobile-first width constraint: actually override Pico's `--pico-*` variables (at minimum `--pico-primary*`, for the AgentClinic brand color, light + dark), and add only the rules the classless build doesn't cover (header's brand+nav flex layout, agent-detail `<dl>` grid)
25. Verify the result stays mobile-first: Pico's classless build is mobile-first by default (base styles + `min-width` breakpoints at 576/768/1024/1280/1536px on `body > header/main/footer`); `static/style.css` doesn't need its own `min-width` query unless a rule specifically requires one

## Group 7 — Tests

26. `tests/db.test.ts`: unit tests for `listAgents`, `getAgentById`, `listAilments`, `getAilmentsForAgent`, run against a migrated + seeded temporary/in-memory test database
27. `tests/routes.agents.test.tsx`: route tests for `GET /agents` (200, contains seeded agent names) and `GET /agents/:id` (200 with ailments listed for a valid id; 404 for an unknown id)
28. `tests/routes.ailments.test.tsx`: route test for `GET /ailments` (200, contains seeded ailment names)

## Group 8 — Verify

29. Run `npm run typecheck` — must exit 0 with no errors
30. Run `npm run migrate && npm run seed` against a clean database — must exit 0; running both again must not duplicate rows or error
31. Run `npm run dev` and confirm via `curl` that `/`, `/agents`, `/agents/:id` (valid and invalid id), and `/ailments` all return the expected HTML/status, and that `/static/pico.min.css` and `/static/style.css` both serve successfully
32. Run `npm test` — must exit 0

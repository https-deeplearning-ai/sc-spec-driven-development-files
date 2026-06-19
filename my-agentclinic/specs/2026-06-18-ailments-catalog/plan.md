# Plan — Phase 5: Ailments Catalog

## 1. Add migrations

- Create `db/migrations/003_create_ailments.sql`:
  ```sql
  CREATE TABLE IF NOT EXISTS ailments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    description TEXT NOT NULL
  );
  ```
- Create `db/migrations/004_create_agent_ailments.sql`:
  ```sql
  CREATE TABLE IF NOT EXISTS agent_ailments (
    agent_id   INTEGER NOT NULL REFERENCES agents(id),
    ailment_id INTEGER NOT NULL REFERENCES ailments(id),
    PRIMARY KEY (agent_id, ailment_id)
  );
  ```
- Register both in `db/client.ts` using the same try/catch idempotency pattern as migration 002

## 2. Seed ailments and agent–ailment links

- In `db/seed.ts`, add a second block that runs after agents are seeded:
  - Insert the 6 ailments (skip if `ailments` table already has rows)
  - Insert the agent–ailment assignments using agent and ailment names to look up IDs
- Drop `agentclinic.db` and run `npm run seed` to confirm all rows are present

## 3. Add Ailment type

- Create `src/pages/Ailments.tsx` — export `type Ailment { id, name, description }`
- Render a `<table>` of all ailments inside `<Layout title="Ailments">`

## 4. Build the AilmentDetail page

- Create `src/pages/AilmentDetail.tsx`
- Props: `{ ailment: Ailment, agents: Agent[] }`
- Render inside `<Layout title={ailment.name}>`:
  - `<h1>{ailment.name}</h1>`
  - `<p>{ailment.description}</p>`
  - `<h2>Affected Agents</h2>` + `<ul>` of agent names linking to `/agents/:id`
  - `← Back to Ailments` link

## 5. Update AgentDetail to show ailments

- In `src/pages/AgentDetail.tsx`, accept an additional `ailments: Ailment[]` prop
- After the existing `<dl>`, add an "Ailments" section:
  - `<h2>Ailments</h2>`
  - `<ul>` of ailment names linking to `/ailments/:id`, or `<p>None diagnosed</p>` if empty

## 6. Add routes

In `src/app.tsx`:
- `GET /ailments` — query all ailments, render `<Ailments>`
- `GET /ailments/:id` — query ailment + its agents via join, render `<AilmentDetail>`; 404 if not found
- Update `GET /agents/:id` — also query the agent's ailments via join, pass to `<AgentDetail>`

## 7. Update Header nav

- In `src/components/Header.tsx`, add `<li><a href="/ailments">Ailments</a></li>` to the nav `<ul>`

## 8. Update tests

- Add `GET /ailments` test: 200, contains ailment name and `<table`
- Add `GET /ailments/:id` test: 200, contains ailment name and an affected agent name
- Add `GET /ailments/9999` test: 404
- Update `GET /agents/:id` test: response contains an ailment name
- Run `tsc --noEmit` and `npm test` — all pass

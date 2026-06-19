# Plan — Phase 4: Agent Detail

## 1. Add migration for presenting_complaints

- Create `db/migrations/002_add_presenting_complaints.sql`:
  ```sql
  ALTER TABLE agents ADD COLUMN presenting_complaints TEXT;
  ```
- Update `db/client.ts` migration runner to also execute `002_add_presenting_complaints.sql`
- Run `tsc --noEmit` to confirm types still resolve

## 2. Update seed data

- In `db/seed.ts`, extend each `insert.run(...)` call to include a `presenting_complaints` value for all five agents
- Add the column to the `INSERT` statement: `INSERT INTO agents (name, model_type, status, presenting_complaints) VALUES (?, ?, ?, ?)`
- Drop and re-seed the database: delete `agentclinic.db`, then run `npm run seed`
- Confirm all five rows have the complaints column populated

## 3. Build the AgentDetail page

- Create `src/pages/AgentDetail.tsx`
- Props: `{ agent: Agent }` (reuse the `Agent` type from `Agents.tsx`, extended with `presenting_complaints: string | null`)
- Render inside `<Layout title={agent.name}>`:
  - `<h1>{agent.name}</h1>`
  - `<dl>` with `<dt>/<dd>` pairs for Model Type, Status, Presenting Complaints
  - `<a href="/agents">← Back to Agents</a>` at the bottom
- No extra CSS classes needed — Pico CSS styles `<dl>` automatically

## 4. Add the /agents/:id route

- In `src/app.tsx`, add:
  ```ts
  app.get('/agents/:id', (c) => {
    const id = Number(c.req.param('id'))
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined
    if (!agent) return c.text('Agent not found', 404)
    return c.html(<AgentDetail agent={agent} />)
  })
  ```

## 5. Link agent names in the list

- In `src/pages/Agents.tsx`, wrap the name `<td>` content in an anchor:
  ```tsx
  <td><a href={`/agents/${agent.id}`}>{agent.name}</a></td>
  ```

## 6. Update tests

- In `src/app.test.tsx`, add a test for `GET /agents/:id`:
  - Asserts HTTP 200
  - Asserts the agent's name appears in the body
  - Asserts `presenting_complaints` content appears
- Add a test for a non-existent ID (e.g. `GET /agents/9999`):
  - Asserts HTTP 404
- Update the `/agents` list test to assert the name is wrapped in an `<a>` tag
- Run `tsc --noEmit` — confirm zero errors
- Run `npm test` — confirm all tests pass

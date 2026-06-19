# Plan — Phase 3: Agent List

## 1. Install SQLite dependency

- Add `better-sqlite3` and `@types/better-sqlite3` to `package.json`
- Run `npm install`
- Confirm TypeScript resolves the types: `tsc --noEmit`

## 2. Create database client and migration

- Create `db/client.ts` — opens (or creates) `agentclinic.db` with `new Database(...)`, exports a singleton `db`
- Create `db/migrations/001_create_agents.sql`:
  ```sql
  CREATE TABLE IF NOT EXISTS agents (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    model_type TEXT NOT NULL,
    status     TEXT NOT NULL
  );
  ```
- Add migration runner in `db/client.ts` that reads and executes `001_create_agents.sql` on startup

## 3. Seed the database

- Create `db/seed.ts` — checks if `agents` table is empty, then inserts the five fictional agents:
  - Claude the Exhausted / Sonnet / in treatment
  - Gemini the Disoriented / Gemini Pro / awaiting triage
  - GPT the Overconfident / GPT-4o / in treatment
  - Llama the Withdrawn / Llama 3 / discharged
  - Mistral the Anxious / Mistral 7B / new intake
- Add `"seed": "tsx db/seed.ts"` script to `package.json`
- Run `npm run seed` and confirm rows are present

## 4. Add Pico CSS to the Layout

- In `src/components/Layout.tsx`, add a `<link>` to the Pico CSS CDN stylesheet in `<head>`:
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
  ```
- Remove or keep any existing `/style.css` static link as appropriate; Pico CSS takes over baseline styling

## 5. Build the Agents page

- Create `src/pages/Agents.tsx` — accepts `{ agents: Agent[] }` props, renders a `<table>` inside `<Layout title="Agents">`
  - Three columns: Name, Model Type, Status
  - Each name is a plain `<td>` for now (links come in Phase 4)
  - No extra CSS classes needed — Pico CSS styles `<table>` automatically

## 6. Add the `/agents` route

- In `src/app.tsx`, import `db` from `db/client.ts` and `Agents` from `src/pages/Agents.tsx`
- Add `GET /agents` handler:
  ```ts
  const agents = db.prepare('SELECT * FROM agents').all()
  return c.html(<Agents agents={agents} />)
  ```

## 7. Update navigation

- In `src/components/Header.tsx`, add a Nav link: `<a href="/agents">Agents</a>`

## 8. Update tests

- In `src/app.test.tsx`, add a test for `GET /agents`:
  - Asserts HTTP 200
  - Asserts response body contains at least one seeded agent name (e.g., "Claude the Exhausted")
  - Asserts response body contains `<table>` or column headers
- Run `tsc --noEmit` — confirm zero errors
- Run `npm test` — confirm all tests pass

# Tech Stack

AgentClinic is a server-side TypeScript application. All rendering happens on the server; the browser receives plain HTML that works well and looks good on a modern browser (Steve's requirement).

This document reflects the stack already implemented in `src/` and locks in decisions for the gaps that weren't yet written down.

## Core

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Type safety end-to-end; satisfies Mary's requirement for a "popular stack based on TypeScript" |
| Runtime | Node.js | Stable, well-supported, vast ecosystem |
| Server framework | **Hono** | Lightweight, TypeScript-first, fast, excellent DX; routes and middleware feel natural |
| Templating | Hono JSX (server-side) | JSX without React overhead; components are just functions |
| CSS | Plain CSS + CSS custom properties (`static/style.css`) | No build step required; mobile-first responsive layout |

### Why Hono

- First-class TypeScript with zero config
- Built-in JSX renderer for server-side HTML
- Middleware model is simple and composable
- Runs on Node, Deno, Bun, and edge runtimes without changes

## Data

- **SQLite** via `better-sqlite3` — simple, embedded, no infrastructure to run
- Migrations are plain, hand-written `.sql` files in `src/db/migrations`, applied in order (`001_...` → `006_...`)
- **No ORM.** Decision: stay on raw SQL + prepared statements for the life of this project. The schema is small (6 tables) and teaching-project scope doesn't justify the extra abstraction and dependency weight of an ORM. Revisit only if the schema grows well past what a demo needs.
- Foreign keys and status values are enforced with SQL `CHECK`/`REFERENCES` constraints, not application code, so invalid data can't slip in even from a bug elsewhere.

## Styling

- **Framework-free.** Plain CSS with custom properties for spacing/color/sizing tokens, mobile-first (base styles for small screens, `min-width` media queries progressively enhance up).
- No CSS framework, no preprocessor, no build step. A single flat stylesheet ships to the browser. This keeps the project buildable and explainable in one sitting, which matters more here than saving a bit of hand-written CSS.

## Testing

- **Vitest** — fast, TypeScript-native, compatible with the rest of the stack
- Tests live in `tests/`, covering migrations, seeds, routes, components, and validation
- Run via `npm test`; must pass before merge

## Tooling

- `tsx` for development (run TypeScript directly, no build step needed)
- `tsc` for production builds and `npm run typecheck`
- `prettier` for formatting

## Staff Authentication

Not yet implemented — the `/dashboard` route is currently reachable by anyone who finds the URL. Decision: this is an intentional, tracked gap, not an oversight. When it's built (see roadmap), it should stay minimal and in keeping with the "no infrastructure" philosophy:

- A single shared staff login (session cookie), not per-user accounts with roles
- No external auth provider/SSO — this is a teaching artifact, not a system that needs to satisfy a real security audit
- Session state can live in SQLite alongside everything else; no new infrastructure

## Deployment Target

Decision: **a single Node.js process**, no containerization.

- `npm run build` (`tsc`) produces `dist/`; `node dist/index.js` runs it
- SQLite's database file ships alongside the app on the same filesystem — no separate database server
- No Docker, no Kubernetes, no multi-service orchestration. If this ever needs real horizontal scaling or multi-tenant hosting, that's a different project with a different mission.
- Suitable hosts: a single small VM or a "run a Node app" PaaS (e.g. Fly.io, Render). This isn't pinned to a specific provider — any host that can run `node` and persist a file is fine.

## What We Are Not Using

- No React, Vue, or Svelte — server-side rendering keeps the stack simple
- No ORM — SQL is sufficient at this scale
- No Docker — deployment is a single Node process (see above)
- No CSS framework — plain CSS, mobile-first, no build step
- No external auth provider — staff auth (when built) is a single shared login

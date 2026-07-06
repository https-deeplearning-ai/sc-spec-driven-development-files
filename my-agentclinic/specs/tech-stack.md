# Tech Stack

AgentClinic is a server-side TypeScript application. The browser receives plain HTML.

## Core

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Type safety end-to-end; satisfies Mary's requirement |
| Runtime | Node.js | Stable, well-supported, vast ecosystem |
| Server framework | **Express** | Widely known, large ecosystem, mature middleware |
| Templating | Server-side HTML (via Express) | No client-side framework overhead |
| CSS | Plain CSS + CSS custom properties | No build step required; keeps the stack simple |

## Data

- **SQLite** (via `better-sqlite3`) — embedded, no infrastructure required, ideal for this scale
- Migrations via plain SQL files; no ORM

## Testing

- **Vitest** — fast, TypeScript-native test runner
- **supertest** — HTTP integration tests against the Express app without starting a real server
- Each phase's validation criteria are encoded as Vitest tests under `src/__tests__/`
- Run with `npm test` (single pass) or `npm run test:watch` (interactive watch mode)
- CI gate: all tests must pass before a branch is merged

## Tooling

- `tsx` for development (run TypeScript directly, no build step)
- `tsc` for production builds
- `prettier` for formatting

## What We Are Not Using

- No React, Vue, or Svelte — server-side rendering only
- No ORM — plain SQL is sufficient
- No Docker — not in scope for current phases

# Tech Stack

AgentClinic is a server-side TypeScript application. All rendering happens on the server; the browser receives plain HTML that works well and looks good.

## Core

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Type safety end-to-end; satisfies Mary's requirement |
| Runtime | Node.js | Stable, well-supported, vast ecosystem |
| Server framework | **Hono** | Lightweight, TypeScript-first, fast, excellent DX; routes and middleware feel natural |
| Templating | Hono JSX (server-side) | JSX without React overhead; components are just functions |
| CSS | Plain CSS + CSS custom properties + `clamp()` | No build step required; fluid responsive layout without a framework |

## Recommended: Hono

[Hono](https://hono.dev) is chosen over Express/Fastify because:

- First-class TypeScript with zero config
- Built-in JSX renderer for server-side HTML
- Middleware model is simple and composable
- Runs on Node, Deno, Bun, and edge runtimes without changes

## Data

- **SQLite** (via `better-sqlite3`) for local development and early production — simple, embedded, no infrastructure
- Migrations via plain SQL files; no ORM to start

## Testing

- **Vitest** — fast, TypeScript-native, compatible with the rest of the stack
- Tests live in `src/**/*.test.ts` and run via `npm test`
- Used for feature validation: each feature spec ships with a corresponding Vitest suite that must pass before the feature is considered complete

## Tooling

- `tsx` for development (run TypeScript directly, no build step needed)
- `tsc` for production builds
- `prettier` for formatting

## Responsive Design

All pages must work well at any viewport width, from 320 px (small mobile) to wide desktop. The approach:

- The viewport `<meta>` tag (`width=device-width, initial-scale=1`) is present on every page via the shared `<Layout>` component.
- Spacing uses `clamp(min, fluid, max)` so gutters and padding shrink gracefully on narrow screens without discrete breakpoints.
- The `<main>` content area is capped at `60rem` and centered with `margin-inline: auto`, keeping line lengths readable on wide screens.
- Images and media use `max-width: 100%; height: auto` to prevent overflow.
- No CSS framework or media-query library is needed at this scale.

## What We Are Not Using

- No React, Vue, or Svelte — server-side rendering keeps the stack simple
- No ORM — SQL is sufficient at this scale
- No Docker — not yet; that's a later phase concern

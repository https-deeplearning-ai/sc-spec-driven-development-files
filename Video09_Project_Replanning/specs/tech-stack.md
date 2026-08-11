# Tech Stack

AgentClinic is a server-side TypeScript application. All rendering happens on the server; the browser receives plain HTML that works well and looks good.

## Core

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Type safety end-to-end; satisfies Mary's requirement |
| Runtime | Node.js | Stable, well-supported, vast ecosystem |
| Server framework | **Hono** | Lightweight, TypeScript-first, fast, excellent DX; routes and middleware feel natural |
| Templating | Hono JSX (server-side) | JSX without React overhead; components are just functions |
| CSS | Plain CSS + CSS custom properties, mobile-first and fluid | No build step required; Steve gets a modern, attractive result on any screen size |

## Recommended: Hono

[Hono](https://hono.dev) is chosen over Express/Fastify because:

- First-class TypeScript with zero config
- Built-in JSX renderer for server-side HTML
- Middleware model is simple and composable
- Runs on Node, Deno, Bun, and edge runtimes without changes

## Responsive Design

Steve needs the site to work well on any modern browser, phone or desktop, so responsive layout is a baseline requirement from the first page built, not a later polish pass:

- Every page's `<head>` includes `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — without it, mobile browsers render at a zoomed-out desktop width and none of the CSS below matters
- Spacing and layout use fluid units (`clamp()`, `%`, `rem`) rather than fixed pixel widths, so pages don't require a specific breakpoint to look correct
- No horizontal scrolling at any viewport width, from a small phone (~320px) up through desktop
- Media/breakpoint queries are added only when content genuinely needs to restructure (e.g. a nav that collapses), not as the default mechanism for "making it responsive"
- No CSS framework (Bootstrap, Tailwind) — plain CSS is enough for this scope, and keeps the "no build step" property intact

## Data

- **SQLite** (via `better-sqlite3`) for local development and early production — simple, embedded, no infrastructure
- Migrations via plain SQL files; no ORM to start

## Testing

- **Vitest** — fast, TypeScript-native, compatible with the rest of the stack
- Used to validate application behavior (routes, business logic, data access) as it's built, not just added at the end
- Exposed as a `test` script in `package.json` (`npm test` runs the suite; `npm run test:watch` for watch mode during development)

## Tooling

- `tsx` for development (run TypeScript directly, no build step needed)
- `tsc` for production builds
- `prettier` for formatting

## What We Are Not Using

- No React, Vue, or Svelte — server-side rendering keeps the stack simple
- No ORM — SQL is sufficient at this scale
- No Docker — not yet; that's a later phase concern

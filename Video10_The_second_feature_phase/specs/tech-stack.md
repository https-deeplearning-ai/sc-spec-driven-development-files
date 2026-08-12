# Tech Stack

AgentClinic is a server-side TypeScript application. All rendering happens on the server; the browser receives plain HTML that works well and looks good.

## Core

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Type safety end-to-end; satisfies Mary's requirement |
| Runtime | Node.js | Stable, well-supported, vast ecosystem |
| Server framework | **Hono** | Lightweight, TypeScript-first, fast, excellent DX; routes and middleware feel natural |
| Templating | Hono JSX (server-side) | JSX without React overhead; components are just functions |
| CSS | PicoCSS + CSS custom properties | Classless/semantic base styles out of the box; no build step (vendored static file, not a CDN dependency); mobile-first responsive layout; Steve gets a modern, attractive result on any device |

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
- Tests live alongside source files or in a `tests/` directory
- Run via `npm test`; CI must pass before merge

## Tooling

- `tsx` for development (run TypeScript directly, no build step needed)
- `tsc` for production builds
- `prettier` for formatting

## CSS Approach

**[PicoCSS](https://picocss.com)** provides the base layer: classless, semantic-HTML-first styling (sensible defaults for `<nav>`, `<article>`, form elements, etc.) without needing utility classes or a component library. It's installed via npm (`@picocss/pico`) and its CSS file is vendored into `static/` — no CDN dependency, no build step, the browser still receives flat stylesheets.

AgentClinic-specific styling layers on top in `static/style.css`, loaded after Pico's stylesheet: CSS custom properties override Pico's own variables (spacing, color, sizing tokens) for the AgentClinic brand, plus any rules Pico doesn't cover. All of it — Pico's base and the AgentClinic layer — stays mobile-first: base styles target small screens, `min-width` media queries progressively enhance for larger viewports.

## What We Are Not Using

- No React, Vue, or Svelte — server-side rendering keeps the stack simple
- No CSS utility framework (Tailwind, Bootstrap) — Pico's classless approach fits server-rendered semantic HTML better and needs no build step
- No ORM — SQL is sufficient at this scale
- No Docker — not yet; that's a later phase concern

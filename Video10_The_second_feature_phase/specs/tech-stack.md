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

**[PicoCSS](https://picocss.com)** provides the base layer, specifically its **classless build** (`pico.classless.min.css`): semantic-HTML-first styling — including the page-width/spacing constraint on `body > header/main/footer` and `min-width`-driven mobile-first breakpoints — applied directly to bare tags, with no `.container` wrapper or utility classes required. It's installed via npm (`@picocss/pico`) and vendored into `static/pico.min.css` — no CDN dependency, no build step, the browser still receives flat stylesheets. (The non-classless build was tried first and dropped: it needs a `.container` class for width constraints, which pushed AgentClinic into hand-reimplementing what the classless build already does for free.)

AgentClinic-specific styling layers on top in `static/style.css`, loaded after Pico's stylesheet: CSS custom properties override Pico's own `--pico-*` variables (currently the `--pico-primary*` family, for AgentClinic's brand color) plus any rules the classless build doesn't cover, such as the header's brand+nav flex layout. Mobile-first responsiveness itself — base styles for small screens, `min-width` media queries enhancing larger viewports — is provided by Pico's classless build; `static/style.css` only needs its own `min-width` rules if an AgentClinic-specific rule requires one.

## What We Are Not Using

- No React, Vue, or Svelte — server-side rendering keeps the stack simple
- No CSS utility framework (Tailwind, Bootstrap) — Pico's classless approach fits server-rendered semantic HTML better and needs no build step
- No ORM — SQL is sufficient at this scale
- No Docker — not yet; that's a later phase concern

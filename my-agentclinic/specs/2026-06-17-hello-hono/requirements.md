# Requirements — Phase 1: Hello Hono

## Goal

Establish the working Hono server with a single route. By the end of this phase the project runs, TypeScript compiles, and there is something real to look at in the browser.

## In Scope

- Install `hono`, `@hono/node-server`, `tsx`, and `vitest`
- Configure `tsconfig.json` for ESNext modules and Hono JSX (`jsxImportSource: hono/jsx`)
- `npm run dev` starts a local server with hot reload on port 3000
- `GET /` renders a minimal AgentClinic home page (JSX component, full HTML document)
- TypeScript compiles clean with `tsc --noEmit`
- One Vitest test covering the `/` route

## Out of Scope

- Shared layout component (Phase 2)
- CSS / styling (Phase 2)
- Database or data models (Phase 3+)
- Any route other than `/`

## Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| `/` renders a JSX component | Yes — `Home.tsx`, not a plain string | Sets the JSX pattern early; trivially simple to start |
| App split from server entry | `src/app.tsx` (routes) + `src/index.tsx` (serve) | Tests import `app` directly without starting a server |
| Layout component | Deferred to Phase 2 | Keeps this phase focused on the scaffold |
| Port | `3000` | No reason to change it yet |

## Context

This is the first shippable slice. Its only job is to prove the stack works end-to-end: TypeScript → Hono JSX → browser. Everything built in later phases depends on this foundation being solid.

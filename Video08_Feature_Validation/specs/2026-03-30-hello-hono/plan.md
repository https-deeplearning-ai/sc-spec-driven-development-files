# Phase 1 Plan — Hello Hono

## Group 1 — Package Setup

1. Install `hono` (pin exact version, no `^` prefix)
2. Install `tsx` as a dev dependency
3. Verify `tsconfig.json` has `"strict": true` and a sensible `target`/`module` for Node

## Group 2 — Application Entry Point

4. Replace `src/index.ts` placeholder with a minimal Hono app
5. Add a single `GET /` route returning `"AgentClinic is open for business"`
6. Call `serve()` to bind the app to a port (default 3000)

## Group 3 — Dev Script

7. Add `"dev": "tsx src/index.ts"` (or `tsx watch`) to `package.json` scripts
8. Add `"typecheck": "tsc --noEmit"` to `package.json` scripts

## Group 4 — Home Page

9. Create a Hono JSX component for the home page (`src/pages/Home.tsx`)
10. Page renders an `<h1>` with "AgentClinic" and a short tagline
11. Update the `GET /` route to return the rendered JSX instead of a plain string

## Group 5 — Layout Component

12. Create `src/components/Layout.tsx` as a main wrapper component using Hono JSX
13. Implement three subcomponents in separate files: `src/components/Header.tsx`, `src/components/Main.tsx`, and `src/components/Footer.tsx`
14. Layout component imports and composes these three subcomponents into a standard HTML shell (`<html>`, `<head>`, `<body>`)
15. Create `static/style.css` with base styles for the layout
16. Link the CSS file in the `<head>` of `src/components/Layout.tsx`
17. Serve the `static/` directory via `@hono/node-server/serve-static` in `src/index.tsx`
18. Update `src/pages/Home.tsx` to use the `<Layout>` component for its structure

## Group 6 — Verify

18. Run `npm run typecheck` — must exit 0 with no errors
19. Run `npm run dev` and confirm `curl localhost:3000` returns HTML containing the heading
20. Confirm `curl localhost:3000/static/style.css` returns the CSS file

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

12. Create `src/components/Layout.tsx` with a top-level shell (`<html>`, `<head>`, `<body>`); it imports `<Header>`, `<Main>`, and `<Footer>` from their own files
13. Create `src/components/Header.tsx`, `src/components/Main.tsx`, and `src/components/Footer.tsx` as separate files, one component each
14. `<head>` links to `/static/style.css`
14a. `<head>` includes `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
15. Create `static/style.css` with minimal base styles, using fluid spacing (`clamp()`) instead of fixed pixel padding so the layout doesn't require a desktop-width breakpoint to look right
16. Serve the `static/` directory via `@hono/node-server/serve-static` in `src/index.tsx`
17. Update `src/pages/Home.tsx` to use `<Layout>` and place page content inside `<Main>`

## Group 6 — Verify

18. Run `npm run typecheck` — must exit 0 with no errors
19. Run `npm run dev` and confirm `curl localhost:3000` returns HTML containing the heading
20. Confirm `curl localhost:3000/static/style.css` returns the CSS file
20a. In a real browser (or devtools device toolbar), resize from ~320px to desktop width and confirm no horizontal scrollbar appears and text stays readable

## Group 7 — Testing Setup (added retroactively)

21. Install `vitest` as a dev dependency
22. Add `"test": "vitest run"` and `"test:watch": "vitest"` to `package.json` scripts
23. Run `npm test` — must exit 0 (no test files yet is fine; a future phase adds the first suite)

# Requirements — Phase 2: Base Layout

## Goal

Introduce a shared server-side JSX layout that all routes render inside, plus foundational CSS (custom properties, reset, typography). By the end of this phase every page has a consistent chrome and the site looks intentional in a browser.

## In Scope

- `src/components/Layout.tsx` — shared JSX component wrapping every page (header, nav, main, footer)
- `public/style.css` — plain CSS with custom properties for color/spacing, a box-sizing reset, and base typography
- Static file serving via Hono's `serveStatic` middleware so the browser can load `style.css`
- `src/pages/Home.tsx` updated to render inside `Layout`
- Phase 1 Vitest test updated/extended to confirm layout chrome is present

## Out of Scope

- Any new routes (those come in Phase 3+)
- JavaScript on the client
- Database or data models
- Responsive breakpoints beyond "looks good on a laptop" (Phase 9)

## Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| CSS delivery | Static file from `public/` | No build step; browser caches it; keeps JSX clean |
| Layout wrapper | JSX component (`Layout.tsx`) | Consistent with the Hono JSX pattern established in Phase 1 |
| Nav links | Home only for now | Only one route exists; placeholders added in Phase 3+ |
| Color palette | CSS custom properties on `:root` | Single source of truth; easy to update later |

## Context

Phase 1 left the home page as a bare `<html>` document with no chrome or styling. Phase 2 makes it feel like a real application and establishes the patterns (Layout component, CSS file) that every subsequent phase will reuse.

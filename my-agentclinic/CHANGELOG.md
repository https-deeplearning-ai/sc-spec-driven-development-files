# Changelog

All notable changes to AgentClinic are recorded here, grouped by date.
This file is updated manually before each branch merge using the `update-changelog` skill.

---

## 2026-07-06

- Merged Phase 1 & 2: Express server bootstrapped with `tsx` dev server; root `/` route returns welcome message
- Created `src/app.ts` / `src/index.ts` split to keep `listen()` separate from the app for testing
- Added `src/components/header.ts`, `footer.ts`, and `layout.ts` — server-side HTML component functions
- Created `public/styles.css` with CSS custom properties; Express serves `public/` as static files
- Added `<link rel="stylesheet">` in layout; all routes render inside the shared layout
- Added Vitest + supertest integration test for `GET /`; added unit tests for layout components (11 tests total)
- Added `test` and `test:watch` scripts to `package.json`
- Expanded Testing section in `specs/tech-stack.md` to document Vitest + supertest conventions
- Refactored CSS to mobile-first with breakpoints at 640 px and 960 px
- Updated `specs/mission.md`, `specs/tech-stack.md`, `specs/roadmap.md`, and phase requirements to capture responsive design as a product requirement
- Consolidated roadmap Phases 3–5 (Agent List, Agent Detail, Ailments) into a single Phase 3 — Agents & Ailments; renumbered subsequent phases

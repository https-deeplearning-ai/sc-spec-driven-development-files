# Changelog

## 2026-08-12
- Implement MVP (Phases 3–7): therapies catalog, appointment booking, staff dashboard, accessibility polish, and hardening
- Add `therapies` and `ailment_therapies` tables + seed data; agent detail page shows recommended therapies per ailment
- Add `appointments` table, booking form on the agent detail page, and a confirmation page
- Add `/dashboard` with summary counts, read-only record tables, and appointment status transitions
- Add branded 404/500 error pages and request logging middleware
- Add MVP spec: requirements, plan, and validation for Phases 3–7
- Mark Phases 3–7 complete in roadmap.md

## 2026-03-31
- Fix three pre-merge issues from code review: FK enforcement, prepared statement placement, devDependencies
- Implement Phase 2: agents and ailments pages, SQLite migrations and seed data, PicoCSS layout
- Add Phase 2 spec: requirements, plan, and validation for Agents & Ailments
- Revise roadmap phases for clarity and scope adjustments
- Implement mobile-first CSS with custom properties and responsive media queries
- Add tests for layout and components, configure Vitest
- Implement Phase 1: Hello Hono with layout components

## 2026-03-30
- Add foundational project documentation and tech stack definition
- Add foundational project documentation and tech stack definition
- Initial project scaffold

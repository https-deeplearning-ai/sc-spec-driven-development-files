# Changelog

## 2026-08-12
- Re-create the constitution (mission.md, tech-stack.md, roadmap.md) after the spec files were lost, documenting the MVP (Phases 1-7) already in `src/` and locking in decisions for staff auth, deployment target, and the data layer
- Add Phase 8 spec: requirements, plan, and validation for Staff Authentication
- Implement Phase 8: staff_credentials + sessions tables, scrypt password hashing, SQLite-backed sessions, /login and /logout routes, requireStaffAuth middleware gating /dashboard, logout button on the dashboard, "Staff Login" link in the footer
- Mark roadmap Phase 8 complete; document STAFF_USERNAME/STAFF_PASSWORD env vars in README

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

# Roadmap

Phases are intentionally small — each one is a shippable slice of work, independently reviewable and testable.

---

## Phase 1 — Hello Hono ✅
- Install and configure Hono with `tsx` dev server
- Single `/` route returning "AgentClinic is open for business"
- Confirm TypeScript types work end-to-end

## Phase 2 — Layout, Agents & Ailments
- **Base layout**
  - Server-side JSX layout component (header, nav, main, footer)
  - Basic CSS (custom properties, reset, typography), responsive and fluid from the start — see [tech-stack.md](./tech-stack.md#responsive-design)
  - All routes render inside the shared layout
- **Agent list**
  - SQLite database + first migration (`agents` table)
  - Seed a handful of fictional agents
  - `/agents` page listing all agents
- **Agent detail**
  - `/agents/:id` page showing a single agent's profile
  - Name, model type, current status, presenting complaints
- **Ailments catalog**
  - `ailments` table + seed data (e.g., "context-window claustrophobia", "prompt fatigue")
  - `/ailments` list page
  - Link agents to one or more ailments

## Phase 3 — Therapies Catalog
- `therapies` table + seed data
- `/therapies` list page
- Map ailments → recommended therapies

## Phase 4 — Appointment Booking
- `appointments` table (agent, therapist, datetime, status)
- Form to book an appointment from an agent's detail page
- Basic validation and confirmation page

## Phase 5 — Staff Dashboard
- `/dashboard` with summary counts: agents, open appointments, ailments in-flight
- Simple table views for staff to manage records
- Mary's dashboard is now real

## Phase 6 — Polish & Accessibility
- Responsive QA pass across all pages built so far (phones, tablets, desktop) — the fluid foundation is laid in Phase 2, this phase audits every page built since then against it
- Semantic HTML audit
- Keyboard navigation and focus styles

## Phase 7 — Hardening
- Error pages (404, 500)
- Input sanitization on all forms
- Basic logging middleware

---

Later phases (not yet planned): auth, email notifications, therapist profiles, reporting.

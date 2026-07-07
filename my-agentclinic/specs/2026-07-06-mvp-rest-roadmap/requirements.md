# Requirements — MVP From Remaining Roadmap (Phases 4-8)

## Scope

Define and deliver an MVP that completes the remaining roadmap after Phase 3:

- Phase 4: Therapies catalog (`therapies` data, list route, ailment-to-therapy mapping)
- Phase 5: Appointment booking (data model, booking form flow, confirmation)
- Phase 6: Staff dashboard (summary metrics and simple record management views)
- Phase 7: Polish and accessibility audit (responsive validation, semantic markup, keyboard/focus checks)
- Phase 8: Hardening baseline (404/500 pages, input sanitization on all forms, basic logging middleware)

This MVP is considered complete when users can discover therapies, book appointments, and staff can monitor clinic state from one dashboard, with reliable and accessible behavior.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Delivery strategy | Incremental by phase with mergeable slices | Keeps risk low and PRs reviewable |
| Data store | SQLite + `better-sqlite3` | Aligned with existing stack and current implementation |
| Rendering model | Server-side HTML in Express | Avoids client framework complexity; matches current architecture |
| UI baseline | PicoCSS + minimal custom CSS | Maintains consistency and fast delivery |
| Validation strategy | Vitest + supertest for route and workflow coverage | Matches existing CI/testing approach |
| Security baseline | Sanitization + error handling + logging | Satisfies roadmap hardening scope for MVP |

## Context

- Mission alignment:
  - Agents can be matched to therapies and book care.
  - Staff can monitor and manage operations from dashboard views.
- Stakeholder alignment:
  - Mary: TypeScript reliability and dashboard operations.
  - Susan: therapies, booking, and operational flows delivered.
  - Steve: responsive, polished experience on modern browsers.
- Tech constraints (from `specs/tech-stack.md`):
  - No ORM; plain SQL migrations.
  - No client SPA framework; server-side rendering only.
  - Tests required as merge gate.

## Out Of Scope

- Authentication and authorization
- Email/SMS notifications
- Therapist profile management depth beyond what is required to support booking records
- Advanced reporting and analytics
- Infrastructure concerns outside local/CI app runtime

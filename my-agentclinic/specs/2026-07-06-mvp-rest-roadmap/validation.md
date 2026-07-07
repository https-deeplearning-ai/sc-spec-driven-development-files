# Validation — MVP From Remaining Roadmap (Phases 4-8)

## Merge Gate

The MVP is merge-ready only when all checks below pass.

## 1. Automated Test Gate

Run:

```bash
npm test
```

Expected:

- All Vitest suites pass.
- Integration tests cover:
  - `GET /therapies`
  - Appointment booking success and validation failures
  - `GET /dashboard`
  - 404/500 behavior
- No flaky tests (repeat runs remain green).

## 2. Type Safety Gate

Run:

```bash
npx tsc --noEmit
```

Expected:

- Zero TypeScript errors.

## 3. Route Contract Gate

Expected route behaviors:

- `/therapies`: returns 200 and renders seeded therapies with ailment mappings.
- `/agents/:id` booking flow: valid submissions create appointments and show confirmation.
- `/dashboard`: returns 200 and shows accurate summary counts and management tables.
- Unknown routes: return 404 page.
- Internal error path: returns 500 page without leaking sensitive internals.

## 4. Data Integrity Gate

Expected:

- Migrations create required Phase 4-6 tables and mapping tables.
- Seed routines are deterministic and idempotent.
- Foreign key relationships are enforced for mappings and appointments.
- Invalid references are rejected cleanly.

## 5. Security And Hardening Gate

Expected:

- All form inputs are validated and sanitized server-side.
- Rendered HTML escapes user-provided values.
- Logging middleware captures request method/path/status/duration.
- No runtime crashes on malformed form payloads.

## 6. UX And Accessibility Gate

Manual checks required:

- Responsive behavior on narrow/mobile and desktop widths.
- Keyboard-only navigation for nav, forms, and buttons.
- Visible focus states and semantic heading/landmark structure.
- Error messages are clear and actionable.

## MVP Done Definition

- [ ] Remaining roadmap phases (4-8) are implemented to MVP scope.
- [ ] All automated tests pass in CI/local.
- [ ] TypeScript check passes.
- [ ] Key user journeys pass manual smoke testing.
- [ ] Accessibility and hardening checks are satisfied.
- [ ] Specs and implementation are aligned and ready to merge.

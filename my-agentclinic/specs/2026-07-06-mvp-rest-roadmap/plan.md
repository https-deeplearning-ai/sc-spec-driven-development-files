# Plan — MVP From Remaining Roadmap (Phases 4-8)

## 1. Therapies Catalog (Phase 4)

1. Create `therapies` table and deterministic seed data.
2. Create mapping table between ailments and therapies (many-to-many).
3. Add repository queries for therapy listing and ailment-therapy associations.
4. Implement `GET /therapies` with semantic, readable server-rendered HTML.
5. Add tests for therapy route content and mapping visibility.

## 2. Appointment Booking (Phase 5)

1. Create `appointments` table with agent, therapist, datetime, and status fields.
2. Add booking form on `GET /agents/:id` and `POST` submit handler.
3. Validate input server-side (required fields, datetime parse, accepted status).
4. Implement confirmation page flow and persisted appointment record.
5. Add integration tests for successful and invalid booking paths.

## 3. Staff Dashboard (Phase 6)

1. Implement `GET /dashboard` summary cards: agents, open appointments, ailments in-flight.
2. Add basic table views for operational records (agents, appointments, ailments).
3. Add minimal filtering/sorting where needed for usability.
4. Ensure dashboard routes remain accessible and mobile-readable.
5. Add route and rendering tests for dashboard metrics and table presence.

## 4. Polish And Accessibility (Phase 7)

1. Audit semantic landmarks, heading order, and form labeling.
2. Verify keyboard navigation and visible focus across interactive elements.
3. Verify responsive behavior on narrow/mobile and desktop widths.
4. Refine spacing/typography consistency with PicoCSS baseline.
5. Add regression tests where practical and document manual accessibility checks.

## 5. Hardening Baseline (Phase 8)

1. Add 404 and 500 error pages using shared layout.
2. Add centralized input sanitization utilities and use on all form inputs.
3. Add basic request logging middleware with method, route, status, and latency.
4. Add test coverage for error handling and invalid-input rejection.
5. Confirm no raw unescaped user input is reflected in rendered HTML.

## 6. MVP Finalization

1. Run full test suite and TypeScript checks.
2. Perform manual smoke test across primary user journeys.
3. Ensure docs/specs are current and implementation matches accepted scope.
4. Prepare MVP release notes and merge.

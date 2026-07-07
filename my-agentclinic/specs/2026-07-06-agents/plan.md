# Plan — Phase 3: Agents And Ailments

## 1. Data Foundation

1. Add database dependency and minimal DB bootstrap module.
2. Create first SQL migration for `agents`, `ailments`, and `agent_ailments` tables.
3. Add a migration runner or startup hook to ensure schema exists locally.

## 2. Seed Data

1. Create deterministic seed SQL/script for fictional agent records.
2. Add deterministic seed records for ailments.
3. Seed many-to-many links between agents and ailments.
4. Add an idempotent way to run seeds for local development and tests.

## 3. Server Integration

1. Add data access function(s) to read all agents from SQLite.
2. Add data access function(s) for single-agent profile retrieval with linked ailments.
3. Add data access function(s) for ailments list retrieval.
4. Implement `GET /agents` route in the Express app.
5. Implement `GET /agents/:id` route with 404 handling.
6. Implement `GET /ailments` route.

## 4. Presentation Details

1. Add semantic markup for agent list items with links to details.
2. Add semantic markup for agent profile content including linked ailments.
3. Add semantic markup for ailments list and linked-agent counts.
4. Add PicoCSS to the shared layout and confirm styles apply across all Phase 3 pages.
5. Add empty-state rendering for agents and ailments lists.
6. Keep any custom CSS minimal and additive to PicoCSS defaults.

## 5. Automated Validation

1. Add/extend Vitest + supertest tests for `GET /agents`, `GET /agents/:id`, and `GET /ailments`.
2. Verify status code, content type, and seeded content for all routes.
3. Verify 404 behavior for unknown `GET /agents/:id`.
4. Keep tests deterministic by controlling migration/seed setup per test run.

## 6. Final Checks

1. Run full test suite and confirm pass.
2. Run TypeScript typecheck and resolve any errors.
3. Manually verify all three Phase 3 routes in browser.
4. Confirm feature is isolated, reviewable, and ready for PR.

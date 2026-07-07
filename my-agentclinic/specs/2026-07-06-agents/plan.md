# Plan — Phase 3 Slice: Agents Listing

## 1. Data Foundation

1. Add database dependency and minimal DB bootstrap module.
2. Create first SQL migration for `agents` table with stable schema.
3. Add a migration runner or startup hook to ensure schema exists locally.

## 2. Seed Data

1. Create deterministic seed SQL/script for fictional agent records.
2. Add an idempotent way to run seeds for local development and tests.
3. Document expected initial records for verification.

## 3. Server Integration

1. Add data access function(s) to read all agents from SQLite.
2. Implement `GET /agents` route in the Express app.
3. Render agents in server-side HTML using existing shared layout.

## 4. Presentation Details

1. Add semantic markup for agent list items (name, model type, status).
2. Add PicoCSS to the shared layout and confirm styles apply on `/agents`.
3. Add empty-state rendering if no agents exist.
4. Keep any custom CSS minimal and additive to PicoCSS defaults.

## 5. Automated Validation

1. Add/extend Vitest + supertest tests for `GET /agents`.
2. Verify status code, content type, and presence of seeded agent content.
3. Keep tests deterministic by controlling migration/seed setup per test run.

## 6. Final Checks

1. Run full test suite and confirm pass.
2. Run TypeScript typecheck and resolve any errors.
3. Confirm feature is isolated, reviewable, and ready for PR.

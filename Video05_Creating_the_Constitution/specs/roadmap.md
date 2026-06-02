# AgentClinic Roadmap

Each phase is a small, shippable increment. Complete and validate one phase before starting the next.

## Phase 1 — Project Scaffold + Hello World

- Initialize Next.js with TypeScript (strict mode)
- Confirm dev server runs and renders a page
- Set up Tailwind CSS
- Set up Vitest with React Testing Library
- Add a smoke test that verifies the home page renders

## Phase 2 — Static Dashboard Shell

- Create dashboard layout (header, sidebar, main content area)
- Build a home page with placeholder content
- Create placeholder pages for all sidebar navigation links (patients, ailments, visits, analytics)
- Ensure responsive design for modern browsers
- Test that layout renders header, sidebar, and content area
- Test that each placeholder page renders without errors

## Phase 3 — Agent Registration

- Set up SQLite database with Drizzle ORM
- Create `patients` table schema
- Implement `POST /api/patients` and `GET /api/patients/:id`
- Add a patients list view on the dashboard
- Test `patients` schema validation (required fields, types)
- Test `POST /api/patients` creates a record and returns it
- Test `GET /api/patients/:id` returns the correct patient or 404

## Phase 4 — Ailment Catalog

- Create `ailments` table with seed data (hallucination, context exhaustion, instruction drift, persona collapse, etc.)
- Implement `GET /api/ailments` endpoint
- Display ailment catalog on the dashboard
- Test seed data is inserted correctly
- Test `GET /api/ailments` returns the full catalog

## Phase 5 — Visit Creation + Triage

- Create `visits` table schema
- Implement `POST /api/visits` — accept symptom text, create visit in TRIAGE state
- First LLM call: triage prompt classifies severity (1–4) and routes to candidate ailments
- Transition visit to DIAGNOSED state
- Test `POST /api/visits` creates a visit in TRIAGE state
- Test triage logic with a mocked LLM response
- Test visit state transitions from TRIAGE to DIAGNOSED

## Phase 6 — Diagnosis Engine

- Build ailment matching logic using LLM confidence scores
- Apply confidence thresholds (≥0.6 confirmed, 0.4–0.59 uncertain, <0.4 excluded)
- Auto-create novel ailments when no catalog match reaches threshold
- Store diagnoses on the visit record
- Test confidence threshold bucketing (confirmed / uncertain / excluded)
- Test novel ailment creation when no match exceeds threshold
- Test diagnoses are stored correctly on the visit

## Phase 7 — Treatment Selection + Prescription

- Create `treatments` and `ailment_treatments` tables with seed data
- Second LLM call: select treatments based on diagnoses and patient history
- Return structured prescription payload to the caller
- Transition visit to AWAITING_FOLLOWUP
- Test treatment selection with a mocked LLM response
- Test prescription payload structure matches expected schema
- Test visit state transitions to AWAITING_FOLLOWUP

## Phase 8 — Follow-up + Outcome Tracking

- Implement `POST /api/visits/:id/followup` — accept outcome report
- Update treatment effectiveness scores based on outcomes
- Detect recurrence patterns (same ailment within 7 days)
- Flag chronic patients (3+ recurrences of same ailment)
- Auto-expire visits after configurable follow-up window
- Test followup endpoint updates treatment effectiveness scores
- Test recurrence detection triggers within 7-day window
- Test chronic patient flag at 3+ recurrences
- Test visit auto-expiration after follow-up window elapses

## Phase 9 — Dashboard Analytics

- Patient load and visit volume charts
- Ailment frequency breakdown
- Treatment success rates
- Chronic patient alerts
- Real-time updates via SSE
- Test each analytics endpoint returns correct aggregated data
- Test SSE connection delivers real-time updates

## Phase 10 — Auth + Rate Limiting

- API key authentication for clinic endpoints
- Per-patient visit rate limiting
- Startup warning when running without auth in dev mode
- Test requests without API key are rejected with 401
- Test rate limiting blocks excessive requests per patient
- Test dev-mode startup warning is logged when auth is disabled

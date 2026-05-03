# AgentClinic Roadmap

This roadmap outlines the high-level implementation order in small, incremental phases.

## Phase 1: Project Scaffolding
- [ ] Initialize Hono + Vite + TypeScript project.
- [ ] Create a basic "Hello World" API endpoint.
- [ ] Set up the basic layout and navigation component.

## Phase 2: Database & Schema
- [ ] Define Drizzle schema for Patients, Visits, Ailments, and Treatments.
- [ ] Set up SQLite with `better-sqlite3`.
- [ ] Implement seed data for core ailments and treatments.

## Phase 3: Patient Registration & API Basics
- [ ] Implement `POST /api/patients` for agent registration.
- [ ] Implement `GET /api/patients` and `GET /api/patients/:id`.
- [ ] Add basic API key authentication.

## Phase 4: Clinical Workflow - The Visit Pipeline
- [ ] Implement `POST /api/visits` (synchronous triage, diagnosis, and prescription).
- [ ] Integrate LLM calls for the diagnosis engine.
- [ ] Implement `POST /api/visits/:id/followup`.

## Phase 5: Dashboard - Patient Chart & Timeline
- [ ] Build the Patient Directory page.
- [ ] Build the Patient Detail page with a vertical visit timeline.
- [ ] Implement visit state color-coding (Resolved/Unresolved).

## Phase 6: Analytics & Effectiveness
- [ ] Implement treatment effectiveness calculation logic.
- [ ] Build the Clinic Overview dashboard with resolution rate trends.
- [ ] Implement ailment frequency and severity analytics.

## Phase 7: Refinements & Background Jobs
- [ ] Implement background jobs for visit expiration and chronic condition flagging.
- [ ] Set up SSE for real-time dashboard updates.
- [ ] Add the Referral queue and Alerts page.

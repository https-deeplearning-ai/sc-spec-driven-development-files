# Plan for Product Boundaries

1. Discovery & Vocabulary
   - Review the product mission and audiences from specs/mission.md.
   - Lock terminology: `agent`, `ailment`, `therapy`, `appointment`, `clinic`.
   - Identify minimal pages and data views needed for demos and engineers.

2. Data Model & API Spec
   - Define minimal SQLite tables and fields for `agents`, `ailments`, `therapies`, `appointments`.
   - Specify simple server-side routes or data access functions for listing and retrieving records.
   - Decide seed data shape for demo flows.

3. Implementation Skeleton
   - Add migrations or a minimal schema file for SQLite.
   - Wire a data access layer (DAL) module with typed interfaces.
   - Add a simple dashboard page that queries the DAL and renders server-side.

4. Seed Data, Validation, and Tests
   - Add seed data useful for demos (3 agents, 3 ailments, 3 therapies, a few bookings).
   - Add basic unit tests for DAL and a lightweight end-to-end checklist.

5. Documentation & Handoff
   - Finalize `requirements.md` and `validation.md` inside this folder.
   - Add short README explaining how to run the demo and seed the DB.

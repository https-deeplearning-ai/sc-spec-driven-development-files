# Phase 1 Requirements: Hello Clinic

## Scope

Phase 1 creates the smallest running AgentClinic web app. The feature introduces a local Hono server and a single home page that proves the app can render server-side HTML in a browser.

## User-Facing Requirements

- Users can open the app locally in a modern browser.
- The home page displays the product name, `AgentClinic`.
- The home page includes a short welcome message for the clinic demo.
- The page is intentionally simple and does not include dashboard navigation yet.

## Technical Requirements

- Use TypeScript on Node.js.
- Use Hono as the web framework.
- Render plain server-side HTML.
- Avoid adding a frontend framework, database, authentication, or client-side build pipeline.
- Keep files and folders minimal; do not create future structure before it is needed.

## Decisions

- This phase is limited to a tiny Hono home page.
- Browser verification is manual.
- Command-line validation should include a lightweight `curl` check against the local server.
- Styling can be minimal because Phase 2 covers the broader page layout.

## Context

AgentClinic is a course/demo app for learning spec-driven development with an AI coding agent. The first phase should make the project feel real without expanding the domain model yet. Later phases will add layout, agents, ailments, therapies, appointments, and persistence.

## Out of Scope

- Agents, ailments, therapies, appointments, and navigation.
- SQLite or durable storage.
- Automated browser testing.
- Production deployment.
- Advanced styling or dashboard polish.

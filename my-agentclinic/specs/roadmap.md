# AgentClinic Roadmap

This roadmap orders work in very small phases. Each phase should leave the application buildable, understandable, and ready for the next specification.

## Phase 1: Hello Clinic

Create the smallest running Hono application.

- Add a web server entry point.
- Add a shared page layout.
- Render a minimal home page that introduces AgentClinic.
- Serve static CSS.
- Add a basic build and test setup.

## Phase 2: Navigation Shell

Create the site structure before adding product depth.

- Add top-level navigation.
- Add placeholder pages for agents, ailments, therapies, appointments, and dashboard.
- Keep copy aligned with the clinic metaphor.
- Verify all navigation links resolve.

## Phase 3: Agents and Ailments

Introduce the first real product content.

- Define a small in-memory catalog of agents.
- Define a small in-memory catalog of ailments.
- Show agents in a list view.
- Show ailments in a list view.
- Link agents to likely ailments where useful.

## Phase 4: Therapies

Add support options for agent relief.

- Define a small in-memory catalog of therapies.
- Show therapies in a list view.
- Connect therapies to ailments.
- Keep therapy descriptions playful but product-grade.

## Phase 5: Appointments

Let users book fictional clinic visits.

- Add an appointment form.
- Validate required fields.
- Show a confirmation state after submission.
- Keep the flow simple and server-rendered.

## Phase 6: Dashboard

Add a staff-oriented overview.

- Show summary counts for agents, ailments, therapies, and appointments.
- Highlight common ailments.
- Highlight upcoming appointments.
- Keep the dashboard readable in a modern browser.

## Phase 7: SQLite Persistence

Move core records from in-memory data to SQLite.

- Add SQLite dependency and database setup.
- Create migrations for agents, ailments, therapies, and appointments.
- Seed demo data.
- Update routes to read from the database.

## Phase 8: Feedback and Iteration

Add lightweight product feedback loops.

- Let visitors submit feedback.
- Store feedback in SQLite.
- Show feedback in a staff-facing view.
- Use findings to refine future roadmap phases.

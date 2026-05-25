# AgentClinic Roadmap

## Phase 1: Hello Clinic

Create the smallest running Hono server.

- Add a local web server.
- Render a simple AgentClinic home page.
- Show the product name and a short welcome message.
- Verify the app opens in a browser.

## Phase 2: Basic Page Layout

Make the demo look like a small clinic dashboard.

- Add shared HTML layout helpers.
- Add CSS for typography, spacing, and navigation.
- Create links for Agents, Ailments, Therapies, and Appointments.
- Keep all pages server-rendered.

## Phase 3: Agents

Introduce AI agents as clinic patients.

- Create a small static list of agents.
- Show agent name, model, status, and owner.
- Add an agent detail page.
- Keep the data in code for now.

## Phase 4: Ailments

Show the problems agents come in with.

- Create a static ailment list.
- Include name, severity, and description.
- Link ailments to affected agents when useful.
- Make the page easy to scan during a demo.

## Phase 5: Therapies

Add simple treatments for common agent ailments.

- Create a static therapy list.
- Show therapy name, purpose, and matching ailments.
- Add therapy details.
- Keep therapy language playful but useful.

## Phase 6: Appointments

Let users book a simple appointment.

- Add an appointment form.
- Capture agent, ailment, date, and notes.
- Show submitted appointments in memory.
- Validate required fields.

## Phase 7: SQLite Persistence

Move demo data into a local database.

- Add SQLite.
- Create tables for agents, ailments, therapies, and appointments.
- Seed the database with demo data.
- Replace in-memory reads with database queries.

## Phase 8: Demo Polish

Make the app reliable and attractive for course demos.

- Improve empty states and error messages.
- Add small visual details that support the clinic theme.
- Check pages in a modern browser at desktop and mobile widths.
- Update README instructions for running the project.

## Phase 9: Validation Pass

Confirm the project matches the constitution.

- Verify each main workflow manually.
- Check that the implementation still fits the simple course/demo scope.
- Record any follow-up ideas without expanding the MVP.

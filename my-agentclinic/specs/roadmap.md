# Roadmap

Build AgentClinic in very small phases so each step is easy to verify.

1. Define the product boundaries.
   - Confirm the core audiences, concepts, and success criteria.
   - Lock the vocabulary for agents, ailments, therapies, and appointments.

2. Set up the application skeleton.
   - Create the Next.js app structure.
   - Add the shared layout, navigation, and basic styling.

3. Add the domain data model.
   - Define SQLite tables for agents, ailments, therapies, and bookings.
   - Wire a minimal data access layer.

4. Build the first dashboard view.
   - Show a simple overview of clinic status.
   - Make the page useful for engineers and demo presenters.

5. Implement agent and appointment flows.
   - Add pages for listing agents.
   - Add basic booking and detail views.

6. Add therapies and ailments management.
   - Connect ailments to therapies.
   - Make the records easy to browse and update.

7. Polish for presentation quality.
   - Improve the visual design.
   - Check modern browser behavior and tighten the demo experience.

8. Harden and document.
   - Add validation, seed data, and lightweight tests.
   - Document the specs so future changes stay aligned with the constitution.
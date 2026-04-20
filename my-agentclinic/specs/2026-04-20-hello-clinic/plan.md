# Plan: Hello Clinic

1. Project setup
   1. Add the Hono runtime dependencies required to run a Node server.
   2. Add development dependencies needed for route-level testing.
   3. Update `package.json` scripts for development, build, typecheck, and tests.
   4. Keep TypeScript configuration compatible with server-rendered TypeScript.

2. Server entry point
   1. Replace the placeholder `src/index.ts` with a Hono application.
   2. Export the app for tests.
   3. Start the Node server from the entry point for local development.
   4. Serve static assets from the chosen static directory.

3. Shared layout
   1. Add a shared layout that provides document structure, header, main content area, and footer.
   2. Keep the layout reusable for future server-rendered pages.
   3. Include a clear document title, accessible landmarks, and shared page chrome.
   4. Avoid adding navigation links or placeholder pages that belong to later roadmap phases.

4. Minimal AgentClinic home page
   1. Add a minimal home page route at `/`.
   2. Render a concise AgentClinic introduction that names the fictional clinic.
   3. Introduce the core clinic metaphor: AI agents are patients recovering from human-induced stress.
   4. Keep copy satirical, clinically serious, and clearly fictional.
   5. Avoid product-depth sections for agents, ailments, therapies, appointments, or dashboard features.

5. Static styling
   1. Add a single static stylesheet.
   2. Style the minimal home page for readability, clear hierarchy, and a modern browser demo.
   3. Keep selectors simple and maintainable for future phases.
   4. Verify the stylesheet is linked and served correctly.

6. Tests and validation commands
   1. Add basic tests that exercise the home page route.
   2. Assert the home page returns a successful response.
   3. Assert the response includes minimal AgentClinic introductory content.
   4. Ensure `npm run build`, `npm run typecheck`, and `npm test` are documented and pass.

7. Documentation and cleanup
   1. Keep implementation aligned with `specs/mission.md` and `specs/tech-stack.md`.
   2. Avoid unrelated changes to later roadmap phases.
   3. Confirm generated files and scripts are understandable for course learners.
   4. Update roadmap status only after implementation and validation are complete.

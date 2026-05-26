# Phase 1 Plan: Hello Clinic

1. Project Baseline
   - Confirm the existing project structure, scripts, and TypeScript setup.
   - Add only the dependencies and files needed to run a tiny Hono server.
   - Keep the implementation small enough to explain during a course demo.

2. Hono Server
   - Create the smallest server entry point for AgentClinic.
   - Register a home route at `/`.
   - Return server-rendered HTML from the route.

3. Home Page
   - Show the product name, `AgentClinic`.
   - Show a short friendly welcome message.
   - Render the page with a main layout made from separate header, main, and footer component modules.
   - Add a layout module that owns the shared HTML document shell and composes header, page content, and footer.
   - Keep the server entry point focused on route wiring and choosing the page content.
   - Move page styling into a standalone CSS file.
   - Link the CSS file from the server-rendered HTML and serve it through the Hono app.
   - Keep styling minimal unless the existing project already has a simple pattern.

4. Local Run Flow
   - Add or confirm a local command for starting the app.
   - Ensure the app listens on a predictable local port.
   - Keep browser verification manual and easy to demonstrate.

5. Verification
   - Run the TypeScript build or equivalent project check.
   - Start the server locally.
   - Verify the home route with a lightweight `curl` request.

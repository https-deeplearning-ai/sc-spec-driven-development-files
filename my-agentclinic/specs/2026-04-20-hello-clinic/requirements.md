# Requirements: Hello Clinic

## Scope

Phase 1 creates the smallest running AgentClinic application with a minimal home page.

Included:

- Add a Hono web server entry point.
- Add a shared page layout for consistent document structure.
- Render a minimal home page at `/` that introduces AgentClinic.
- Serve static CSS for the initial visual treatment.
- Add basic build and test setup so the phase is verifiable.

Not included:

- Additional product routes beyond the home page.
- Product-depth sections for agents, ailments, therapies, appointments, or dashboard data.
- SQLite persistence, migrations, or seed data.
- Client-side JavaScript, hydration, authentication, billing, or deployment work.

## Decisions

- Use the existing project direction from `specs/tech-stack.md`: TypeScript, Node.js, Hono, server-rendered HTML, and static CSS.
- Keep dependencies minimal and justified; add only the packages needed for Hono runtime and basic testing.
- Prefer explicit, course-friendly modules over clever shortcuts.
- Use shared layout structure early so future phases can add pages without duplicating shell markup.
- Keep the first home page intentionally minimal: identify AgentClinic, establish the fictional clinic premise, and avoid later-phase product depth.
- Keep tests focused on observable behavior: the app renders the home page and serves the expected response.

## Context

AgentClinic is a fictional clinic where AI agents recover from the strain of working with humans. The content should play the clinical premise straight while remaining clearly satirical.

The primary audience is developers learning spec-driven development with AI coding agents. Implementation should be readable, idiomatic TypeScript that teaches the stack without unnecessary abstraction.

The first phase should leave the application buildable, testable, and demoable in a modern browser from the minimal AgentClinic home page.

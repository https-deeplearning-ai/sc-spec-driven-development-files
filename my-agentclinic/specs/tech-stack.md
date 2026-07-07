# Tech Stack

AgentClinic should use a modern, popular TypeScript stack with server-side rendering and a simple data layer.

Recommended stack:

- TypeScript for all application code.
- Next.js as the primary framework, so we get React plus server-side TypeScript in one popular stack.
- React for the UI layer.
- SQLite for local, lightweight persistence.
- Node.js as the runtime.

Why this stack:

- It is reliable and widely understood by engineers.
- It supports a polished browser experience for marketing and demos.
- It keeps the app simple enough for spec-driven development and small incremental changes.
- SQLite keeps the early implementation lightweight while still supporting structured data for agents, ailments, therapies, and bookings.

Implementation guidance:

- Prefer server-side rendering for core pages.
- Keep the dashboard clear and fast.
- Model the domain explicitly so the clinic concepts stay readable in code and specs.
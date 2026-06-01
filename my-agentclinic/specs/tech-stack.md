# AgentClinic Tech Stack

## Direction

AgentClinic will use a popular server-side TypeScript stack that supports a reliable web app, API-style routes, reusable UI components, tests, and a simple local database.

## Runtime

- Language: TypeScript
- Runtime: Node.js
- Package manager: npm
- Initial build command: `npm run build`

## Web Framework

Use Hono for the server-side TypeScript application.

Hono is a good fit for the early phases because it is small, fast, and easy to reason about. It can serve HTML, expose route handlers, and keep the starter project lightweight while still feeling like a real web application.

## UI Approach

- Render server-side HTML from TypeScript route handlers.
- Use shared layout components for header, main content, and footer.
- Keep styling in static CSS.
- Avoid client-side JavaScript until a feature explicitly needs it.

## Data Storage

Use SQLite for local persistence.

SQLite is enough for the first product phases because it is simple to run locally, easy to inspect, and appropriate for course demos. Schema changes should be managed with explicit migration files once persistent data is introduced.

## Testing

- Use Vitest for unit and route tests.
- Add tests alongside each implementation phase.
- Prefer testing behavior at route and component boundaries instead of testing incidental implementation details.

## Quality Standards

- Keep TypeScript strict enough to catch common mistakes.
- Use small modules with clear ownership.
- Prefer explicit errors over silent failures.
- Keep dependencies minimal and justified.
- Keep the stack understandable for course students and conference demo developers.

## Deferred Decisions

- Production hosting provider
- Authentication
- Advanced dashboard interactivity
- Database ORM or query builder
- Background jobs and notifications

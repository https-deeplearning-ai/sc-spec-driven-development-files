# AgentClinic Tech Stack

## Principles

The stack should be simple, TypeScript-first, and friendly for course exercises. Prefer tools that are easy to explain, quick to run locally, and common enough that students can reuse the patterns later.

## Recommended Stack

| Layer | Choice | Reason |
| --- | --- | --- |
| Language | TypeScript | Gives the project type safety while staying close to modern JavaScript. |
| Runtime | Node.js | Familiar runtime for server-side TypeScript demos. |
| Web Framework | Hono | Lightweight, fast, and easy to understand for building small HTTP apps. |
| Rendering | Server-rendered HTML | Keeps the first demo simple without needing a frontend build pipeline. |
| Styling | Plain CSS | Easy to inspect and modify during a course. |
| Data Storage | In-memory data first | Supports very small learning steps before persistence is introduced. |
| Future Persistence | SQLite | Simple local database when the demo needs durable agents, ailments, therapies, and appointments. |
| Build Tooling | TypeScript compiler | The current project already builds with `tsc`. Add more tooling only when needed. |

## Application Structure

Start with a small server entry point and grow the structure as features appear:

```text
src/
  index.ts
  data/
  views/
  routes/
  styles/
```

Do not create folders before they have a clear purpose. The project should evolve from simple to structured as the roadmap advances.

## Development Expectations

- Keep pages usable in a modern browser.
- Prefer readable server-side TypeScript over clever abstractions.
- Keep feature code close to the route or view until repetition proves a helper is useful.
- Use static demo data before adding database complexity.
- Add SQLite only after the core domain is visible in the UI.

## Deferred Choices

These can wait until later phases:

- Client-side framework.
- Authentication.
- API clients.
- Database migrations.
- Automated UI testing.
- Deployment platform.

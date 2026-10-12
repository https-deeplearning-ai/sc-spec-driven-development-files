# Tech Stack

AgentClinic is a full-stack TypeScript application. Every choice below favors popular, well-documented tools (Mary), a polished UI (Steve) and fast iteration in small phases.

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript (strict mode) | One language across server and client, with type safety end to end. |
| Framework | Next.js (App Router) | The most popular full-stack React framework. Server components and server actions mean we don't need a separate API layer. |
| Database | SQLite via `better-sqlite3` | Zero setup and file-based, which is reliable for a single-server app and easy to reset during demos. |
| ORM / migrations | Drizzle ORM + `drizzle-kit` | A type-safe schema in TypeScript, lightweight, with SQL-like queries and generated migrations. |
| Styling | Tailwind CSS | Utility-first styling that gives fast, consistent and responsive layouts. |
| UI components | shadcn/ui (Radix primitives) | Accessible, attractive dashboard building blocks: tables, cards, dialogs, forms and a calendar for booking. |
| Forms & validation | React Hook Form + Zod | One schema validates both the client form and the server action. |
| Unit testing | Vitest | Fast, TypeScript-native tests for domain logic. |
| End-to-end testing | Playwright | Tests the key user flows in modern browsers (Chromium, Firefox, WebKit). |
| Linting / formatting | ESLint + Prettier | Keeps the code consistent. |
| Package manager | npm | Already in use in this repo. |

## Conventions

- Server-side data access happens only in server components and server actions. The client never talks to SQLite directly.
- The Drizzle schema lives in `src/db/schema.ts`, and a seed script fills the database with satirical demo data (patients, ailments and therapies).
- The SQLite database file is git-ignored and recreated by `npm run db:reset`.
- The app targets current evergreen browsers. We don't support legacy browsers.

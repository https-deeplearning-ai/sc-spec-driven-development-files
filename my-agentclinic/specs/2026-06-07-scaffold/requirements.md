# Requirements — Phase 1: Scaffold

## Scope

Transform the bare `npm init` project into a runnable Next.js 15 app with correct structure and zero features. Every subsequent phase builds on this foundation.

## What is in scope

- Install and configure Next.js 15, React 19, Tailwind CSS, TypeScript (strict mode)
- All required config files: `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`
- Root layout (`app/layout.tsx`) with minimal brand: one Google Font wired through Tailwind, Tailwind color tokens for the clinic palette — no nav, no footer
- Global styles (`app/globals.css`) with Tailwind base/components/utilities
- Domain types in `lib/types.ts`: `Ailment`, `Therapy`, `Agent`, `Appointment`
- Minimal seed data in `lib/data.ts`: 3–5 items per type, enough to populate every page stub without gaps
- Stub pages for all routes (placeholder `<h1>` content only, no real UI):
  - `/` — marketing landing
  - `/ailments` — ailments list
  - `/ailments/[id]` — ailment detail
  - `/therapies` — therapies list
  - `/therapies/[id]` — therapy detail
  - `/appointments` — appointments list
  - `/appointments/new` — booking form
  - `/dashboard` — staff dashboard

## What is out of scope

- SQLite / `lib/db.ts` — data access layer is deferred to Phase 7
- Nav bar, footer, or any shared UI component — deferred to Phase 2
- Any real page content, styling, or interactivity — each phase owns its own feature

## Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Brand in Phase 1 | Font + Tailwind color tokens only | Gives all later phases a consistent baseline without designing ahead of feature work |
| Seed data depth | 3–5 items per type | Enough for meaningful page stubs; content is placeholder, not final copy |
| Data layer | `lib/data.ts` TypeScript arrays | SQLite adds infra complexity Phase 1 doesn't need; Phase 7 replaces this |
| Route grouping | `(portal)` group for agent-facing routes | Matches the folder structure in `specs/tech-stack.md` |
| Component library | None — hand-rolled Tailwind | Per `specs/tech-stack.md` |

## Context

AgentClinic's audience includes conference demo attendees and course students. A scaffold that boots cleanly and shows all routes is the minimum bar — it lets any subsequent phase be developed and demoed in isolation. The warm/absurdist tone from `specs/mission.md` should inform even placeholder copy (e.g. stub headings, not Lorem ipsum).

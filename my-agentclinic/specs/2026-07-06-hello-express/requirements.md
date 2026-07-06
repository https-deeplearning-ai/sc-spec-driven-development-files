# Requirements — Phase 1: Hello Express

## Scope

Install and configure Express with a `tsx` dev server. Add a single `/` route that returns the string `"AgentClinic is open for business"`. Confirm TypeScript types work end-to-end.

This is the smallest possible slice of a working web server — nothing beyond the single root route.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Port | `3000` | Simple local default; no env file needed yet |
| Dev runner | `tsx --watch` | No build step in development; satisfies Mary's TypeScript requirement |
| Environment config | None (hardcoded port) | `.env` / `dotenv` not in scope for this phase |
| Templating | None | Plain `res.send()` string; layout comes in Phase 2 |
| Middleware | None | No middleware in scope; that's Phase 10 |

## Context

- **Mission alignment:** AgentClinic is a server-side TypeScript application; Express is the chosen framework (see `specs/tech-stack.md`).
- **Stakeholder:** Mary wants a reliable site on a popular TypeScript stack — this phase lays that foundation.
- **Stakeholder:** Steve requires the UI to be responsive across screen sizes; mobile-first CSS is applied from the base layout onward.
- **Stack constraints:** No React, no ORM, no Docker. Plain Node.js + Express + TypeScript only. CSS uses custom properties and media queries — no framework.

## Out of Scope

- HTML layout / shared template (Phase 2)
- Database / SQLite (Phase 3)
- Any additional routes beyond `/`
- `.env` file or environment variable handling
- Error pages or logging middleware

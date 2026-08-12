# Phase 1 Requirements — Hello Hono

## Scope

Install and configure Hono with a `tsx` dev server. Expose a single `/` route that renders a minimal HTML home page via Hono JSX. Confirm TypeScript types work end-to-end.

## Out of Scope

- No shared layout or navigation (Phase 2)
- No database or additional routes
- No CI/CD pipeline

> **Update:** Vitest was originally deferred to a later phase, but the test framework has since been set up (see [tech-stack.md](../tech-stack.md)) and now applies retroactively to this phase — see the updated [plan](./plan.md) and [validation](./validation.md).

## Decisions

### Pin Hono version
Record the exact Hono version in `package.json` with no range prefix (e.g., `"hono": "4.x.y"`). Future phases must not silently upgrade without deliberate review.

### Enforce strict TypeScript
`tsconfig.json` must include `"strict": true`. This is non-negotiable from the first commit so the codebase never accumulates loose types.

### Responsive layout from the start
`static/style.css` must not use fixed pixel widths or breakpoints that assume a desktop viewport. Header/footer padding and page margins scale fluidly (e.g. `clamp()`) so the page reads well from a small phone up to a wide desktop with no horizontal scrolling. `Layout.tsx` must include a `<meta name="viewport">` tag — this is what makes the fluid CSS actually apply on mobile browsers instead of being auto-scaled down. See [tech-stack.md](../tech-stack.md) for the full rationale.

## Context

This phase exists to prove the baseline works: Node runs TypeScript, Hono serves a response, and the dev loop is functional. Nothing more.

The home page should render an `<h1>` containing "AgentClinic" and a short tagline that reflects the mission. The route returns HTML, not a plain string — Hono JSX handles the rendering.

This is the first visible page a developer sees when they clone and run the project.

## Stakeholder Notes

- **Mary** needs TypeScript end-to-end (satisfied by `strict: true` + successful `tsc --noEmit`)
- **Steve** wants a site that "works well with a modern browser" — the layout and CSS built in this phase are the foundation every later page inherits, so responsive behavior starts here rather than being bolted on in the Phase 6 polish pass

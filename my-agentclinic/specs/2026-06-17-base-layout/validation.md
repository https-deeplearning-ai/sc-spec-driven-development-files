# Validation — Phase 2: Base Layout

Phase 2 is complete and ready to merge when **all** of the following are true.

## Checklist

- [ ] `npm run dev` starts without errors
- [ ] `GET /` returns HTTP 200 and body contains "AgentClinic is open for business"
- [ ] `GET /` response contains `<header>`, `<nav>`, `<footer>` (shared layout present)
- [ ] `GET /style.css` returns HTTP 200 with CSS content
- [ ] `tsc --noEmit` passes with zero errors
- [ ] `npm test` passes — all assertions green
- [ ] Page confirmed visually in a browser: header, nav, main, and footer are visible and styled

## How to Check

```bash
npm run dev

# Confirm home page with layout
curl -s http://localhost:3000/ | grep -E '<header|<nav|<footer'

# Confirm CSS is served
curl -s http://localhost:3000/style.css | head -5

# Type check and tests
npm run typecheck && npm test
```

## Definition of Done

All seven checklist items are green. No TypeScript errors. No failing tests. Every subsequent phase can add new pages by wrapping content in `Layout` without touching HTML boilerplate.

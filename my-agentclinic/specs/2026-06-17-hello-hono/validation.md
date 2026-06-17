# Validation — Phase 1: Hello Hono

Phase 1 is complete and ready to merge when **all** of the following are true.

## Checklist

- [ ] `npm run dev` starts without errors
- [ ] `GET /` returns HTTP 200 and body contains "AgentClinic is open for business"
- [ ] `tsc --noEmit` passes with zero errors
- [ ] `npm test` passes — Vitest test for the `/` route asserts status 200 and expected content
- [ ] Page confirmed visually in a browser

## How to Check

```bash
# Start the dev server
npm run dev

# In another terminal — confirm the route responds
curl -s http://localhost:3000/ | head -20

# Type check
npx tsc --noEmit

# Run tests
npm test
```

## Definition of Done

All five checklist items are green. No TypeScript errors. No failing tests. The branch is rebased on main and the PR description references this validation checklist.

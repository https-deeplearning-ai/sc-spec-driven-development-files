# Validation — Phase 3: Agent List

Phase 3 is complete and ready to merge when **all** of the following are true.

## Checklist

- [ ] `npm install` completes with no errors; `better-sqlite3` is in `node_modules`
- [ ] `tsc --noEmit` passes with zero TypeScript errors
- [ ] `npm run seed` runs without error and populates the `agents` table
- [ ] `npm run dev` starts without errors
- [ ] `GET /agents` returns HTTP 200
- [ ] `GET /agents` response body contains all five seeded agent names
- [ ] `GET /agents` response body contains a `<table>` with Name, Model Type, and Status columns
- [ ] `GET /` still returns HTTP 200 with layout chrome (no regression)
- [ ] The Header nav includes a link to `/agents`
- [ ] The HTML `<head>` includes a `<link>` to the Pico CSS CDN stylesheet
- [ ] `npm test` passes — all assertions green

## How to Check

```bash
# Install and type check
npm install && npm run typecheck

# Seed the database
npm run seed

# Start dev server
npm run dev

# Confirm agents page
curl -s http://localhost:3000/agents | grep -E 'Claude the Exhausted|Gemini the Disoriented'

# Confirm table structure
curl -s http://localhost:3000/agents | grep -i '<table'

# Confirm Pico CSS is linked
curl -s http://localhost:3000/ | grep -i 'picocss\|pico.min.css'

# Confirm home page regression-free
curl -s http://localhost:3000/ | grep -E '<header|<nav|<footer'

# Full test suite
npm run typecheck && npm test
```

## Definition of Done

All eleven checklist items are green. No TypeScript errors. No failing tests. The `/agents` page is visible and correct in a browser — five agents listed in a table with Name, Model Type, and Status columns. The Header nav link routes to it. Phase 4 can add `/agents/:id` without any schema changes.

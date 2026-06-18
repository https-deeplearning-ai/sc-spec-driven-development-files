# Validation — Phase 4: Agent Detail

## Automated checks

- [ ] `tsc --noEmit` passes with zero errors
- [ ] `npm test` passes — all existing tests still green, new tests added:
  - `GET /agents/:id` returns 200 and includes the agent name and presenting complaint
  - `GET /agents/9999` returns 404
  - `GET /agents` response contains `<a href="/agents/` (names are now links)

## Manual checks

- [ ] `npm run seed` completes without error after dropping the old database
- [ ] `GET /agents` — all five agent names are clickable links
- [ ] Clicking a name navigates to `/agents/:id` and shows the correct agent
- [ ] Detail page shows: name (h1), model type, status, and presenting complaints
- [ ] "← Back to Agents" link returns to the list
- [ ] `GET /agents/9999` returns a 404 plain-text response, not a crash

## Definition of done

All automated and manual checks pass. The feature can be reviewed and merged without touching any other phase's scope.

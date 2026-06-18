# Validation — Phase 5: Ailments Catalog

## Automated checks

- [ ] `tsc --noEmit` passes with zero errors
- [ ] `npm test` passes — all existing tests green, new tests added:
  - `GET /ailments` returns 200 and contains `<table` and at least one ailment name
  - `GET /ailments/:id` returns 200 and contains the ailment name and an affected agent name
  - `GET /ailments/9999` returns 404
  - `GET /agents/:id` response contains an ailment name for that agent

## Manual checks

- [ ] `npm run seed` completes without error on a fresh database
- [ ] Header nav shows Home, Agents, Ailments links
- [ ] `/ailments` lists all 6 ailments with descriptions
- [ ] Clicking an ailment name navigates to `/ailments/:id`
- [ ] Ailment detail shows the ailment name, description, and a list of affected agents
- [ ] Each agent name on the ailment detail links back to `/agents/:id`
- [ ] `/agents/:id` shows an Ailments section with that agent's ailments linked to `/ailments/:id`
- [ ] An agent with no ailments shows "None diagnosed"
- [ ] `GET /ailments/9999` returns a plain-text 404

## Definition of done

All automated and manual checks pass. No phase 4 functionality is broken.

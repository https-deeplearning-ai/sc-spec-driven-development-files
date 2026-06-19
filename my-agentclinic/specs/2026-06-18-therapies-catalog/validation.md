# Validation — Phase 6: Therapies Catalog

## Automated checks

- [ ] `tsc --noEmit` passes with zero errors
- [ ] `npm test` passes — all existing tests green, new tests added:
  - `GET /therapies` returns 200 and contains `<table` and at least one therapy name
  - `GET /therapies/:id` returns 200 and contains the therapy name and a linked ailment
  - `GET /therapies/9999` returns 404
  - `GET /ailments/:id` response now contains a recommended therapy name

## Manual checks

- [ ] `npm run seed` completes without error on a fresh database
- [ ] Header nav shows Home, Agents, Ailments, Therapies
- [ ] `/therapies` lists all 6 therapies with descriptions; names are links
- [ ] Clicking a therapy name navigates to `/therapies/:id`
- [ ] Therapy detail shows name, description, and a "Treats" list of ailments
- [ ] Each ailment name on the therapy detail links to `/ailments/:id`
- [ ] `/ailments/:id` shows a "Recommended Therapies" section with linked therapy names
- [ ] An ailment with no therapies shows "None recommended"
- [ ] `GET /therapies/9999` returns a plain-text 404

## Definition of done

All automated and manual checks pass. No phase 5 functionality is broken.

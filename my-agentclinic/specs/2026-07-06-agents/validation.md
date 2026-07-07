# Validation — Phase 3: Agents And Ailments

## Merge Gate

This feature is ready to merge only when all checks below pass.

## 1. Automated Tests (Required)

Run:

```bash
npm test
```

Expected:

- Vitest completes with zero failures.
- Integration tests covering `GET /agents` pass.
- Assertions verify the response includes seeded agent data.

## 2. Route Contract Check

Test expectations for `GET /agents`:

- Returns HTTP 200.
- Returns HTML response rendered through shared layout.
- Includes at least one known seeded agent name.
- Includes links to agent detail routes.

Test expectations for `GET /agents/:id`:

- Returns HTTP 200 for known IDs.
- Renders model type, status, presenting complaints, and linked ailments.
- Returns HTTP 404 with clear not-found messaging for unknown IDs.

Test expectations for `GET /ailments`:

- Returns HTTP 200.
- Includes seeded ailment names and descriptions.
- Includes a linked-agent count for each ailment.

Layout expectations across Phase 3 routes:

- Includes PicoCSS stylesheet reference in rendered HTML layout.
- Renders inside shared layout shell.

## 3. Data Setup Reliability

Expected:

- Migration creates `agents`, `ailments`, and `agent_ailments` tables without manual DB edits.
- Seed process is repeatable and does not create uncontrolled duplicates.
- Seeded links between agents and ailments are present.
- Local fresh setup can reach working `/agents`, `/agents/:id`, and `/ailments` routes from scratch.

## 4. Type Safety And Build Hygiene

Run:

```bash
npx tsc --noEmit
```

Expected:

- TypeScript reports zero errors.

## 5. Manual Spot Check

Run app and open `/agents`, `/agents/1`, and `/ailments` in a browser.

Expected:

- Page renders inside existing shared layout.
- PicoCSS baseline typography/spacing is visibly applied.
- List and detail content are readable on desktop and narrow/mobile widths.
- No runtime errors in server output during route handling.

## Done Definition

- [ ] All required automated tests pass.
- [ ] Phase 3 route contracts are satisfied (`/agents`, `/agents/:id`, `/ailments`).
- [ ] Migration and seed flow are reliable.
- [ ] TypeScript check passes.
- [ ] Manual browser verification passes.
- [ ] PicoCSS is integrated and rendering correctly.
- [ ] Branch is ready for review and merge.

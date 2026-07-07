# Validation — Phase 3 Slice: Agents Listing

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
- Includes PicoCSS stylesheet reference in rendered HTML layout.
- Handles empty dataset gracefully (if seed disabled/cleared) with a clear empty-state message.

## 3. Data Setup Reliability

Expected:

- Migration creates `agents` table without manual DB edits.
- Seed process is repeatable and does not create uncontrolled duplicates.
- Local fresh setup can reach a working `/agents` route from scratch.

## 4. Type Safety And Build Hygiene

Run:

```bash
npx tsc --noEmit
```

Expected:

- TypeScript reports zero errors.

## 5. Manual Spot Check

Run app and open `/agents` in a browser.

Expected:

- Page renders inside existing shared layout.
- PicoCSS baseline typography/spacing is visibly applied.
- List content is readable on desktop and narrow/mobile widths.
- No runtime errors in server output during route handling.

## Done Definition

- [ ] All required automated tests pass.
- [ ] `/agents` route contract is satisfied.
- [ ] Migration and seed flow are reliable.
- [ ] TypeScript check passes.
- [ ] Manual browser verification passes.
- [ ] PicoCSS is integrated and rendering correctly.
- [ ] Branch is ready for review and merge.

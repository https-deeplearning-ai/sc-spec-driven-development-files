---
name: update-changelog
description: "Update CHANGELOG.md before merging a branch. Use when: about to merge, updating changelog, recording changes, pre-merge checklist. Reads git log since the last changelog date, groups commits by date, synthesizes human-readable bullets, and prepends new date sections to CHANGELOG.md."
argument-hint: "Optional: branch name or date range to summarise (defaults to commits since last changelog entry)"
user-invocable: true
disable-model-invocation: false
---

# Update Changelog

Maintain `CHANGELOG.md` in the project root. Invoke this skill manually before every branch merge.

## When to Use

- You are about to merge a feature branch into `main`
- The user says "update the changelog", "log these changes", or "pre-merge"

## Procedure

### 1. Read the existing changelog

Read `CHANGELOG.md`. Note the most recent date heading (format `## YYYY-MM-DD`).

### 2. Gather commits since that date

Run:

```bash
git log --format="%ad %s" --date=short
```

Collect every commit whose date is **after** the most recent date heading already in the changelog. If `CHANGELOG.md` has no entries yet, include all commits that touch files inside this project.

### 3. Group by date

Group the commits chronologically by their `%ad` date. Each unique date becomes a `## YYYY-MM-DD` section.

### 4. Synthesise bullets

For each date group, write concise, human-readable bullet points that describe **what changed and why** — do not copy commit messages verbatim. Merge closely related commits into a single bullet. Aim for 1–3 sentences per bullet. Omit merge commits and fixup/chore noise unless they carry meaningful information.

Good bullet: `- Added Vitest + supertest integration test for GET /; all routes now covered by automated tests`
Bad bullet:  `- feat: add test`

### 5. Prepend to CHANGELOG.md

Insert the new date section(s) **immediately after the header block** (the intro paragraph and `---` divider), keeping newer dates at the top. Do not remove or reorder existing entries.

Format:

```markdown
## YYYY-MM-DD

- Bullet one
- Bullet two
```

### 6. Confirm

Print a short summary of how many new bullets were added and under which date(s). Do not commit the changelog automatically — leave that to the user's normal commit flow.

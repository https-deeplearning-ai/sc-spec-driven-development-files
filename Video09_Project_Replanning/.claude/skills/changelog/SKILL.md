---
name: changelog
description: Maintains CHANGELOG.md in the project root with one "## YYYY-MM-DD" heading per date and bullet points summarizing that day's commits, newest date first. Bootstraps the file from full git history if it doesn't exist yet; otherwise adds entries for commits on the current branch that aren't on main yet (i.e., what's about to be merged). Invoked manually, before merging a branch. Trigger when the user says "changelog", "update the changelog", or invokes /changelog.
---

# Changelog

## Workflow

### 1. Check whether CHANGELOG.md exists at the project root

```
test -f CHANGELOG.md
```

The project root is the directory this skill and `CHANGELOG.md` live in — if the repo is a monorepo (other unrelated projects as sibling directories under the same `.git`), every `git log` in this skill must be scoped to this directory with `-- .`, run from the project root. Otherwise the changelog fills up with unrelated history from other projects in the repo.

### 2. If it does NOT exist — bootstrap from full history

Pull the whole history reachable from `HEAD` for this project's own path, oldest noise stripped out:

```
git log --no-merges --date=short --pretty=format:"%ad%x09%s" -- .
```

Group the lines by date and write `CHANGELOG.md` using the [file format](#file-format) below — one `## YYYY-MM-DD` heading per unique date, newest date first, one bullet per commit in that date's `git log` order (see [bullet style](#bullet-style)). Start the file with a top-level `# Changelog` title.

### 3. If it DOES exist — add entries for what's about to merge

This skill is invoked manually, right before merging the current branch, so it should only cover commits that aren't reflected on `main` yet:

```
git log --no-merges --date=short --pretty=format:"%ad%x09%s" main..HEAD -- .
```

(If this repo's default branch isn't `main`, use that branch instead.)

- If this is empty — nothing ahead of `main`, or you're already on `main` — tell the user there's nothing new to log and stop. Don't touch the file.
- Otherwise, group the results by date. For each date:
  - If a `## YYYY-MM-DD` heading for that date already exists in `CHANGELOG.md`, append the new bullets under it. Skip any bullet whose text is already present there, so re-running the skill on the same branch is idempotent rather than duplicating entries.
  - If no heading for that date exists, insert a new `## YYYY-MM-DD` section. Sections are newest-first, so insert it directly above the first existing heading with an earlier date (or at the end of the file if every existing heading is newer).

### 4. Bullet style

- One bullet per commit, in the commit's own order.
- Use the commit subject line, lightly cleaned up: strip a leading Conventional-Commit-style prefix (`feat:`, `fix:`, `chore:`, etc.) if present, capitalize the first letter, drop a trailing period. Don't invent detail the commit message doesn't contain — if a subject is genuinely uninformative (e.g. "wip", "fix stuff"), you may open `git show --stat` on it to write an accurate one-line summary instead of guessing.
- Merge commits are excluded by `--no-merges` — they're noise, not user-facing changes.

### 5. Leave it for review

- Only edit `CHANGELOG.md`. Do not `git add` or `git commit` it — the user reviews the diff and commits it themselves as part of the merge.
- Report back which date(s) got new entries and how many bullets were added (or that there was nothing new).

## File format

```markdown
# Changelog

## 2026-08-11
- Did something
- Did something else

## 2026-08-05
- Earlier work
```

Newest date first, within a date newest commit first. Use this exact structure for both the initial bootstrap and every later update, so the file stays consistent no matter which path wrote it.

---
name: changelog-manager
description: Manage CHANGELOG.md based on git history. Use this to create or update the project changelog with date-based headings and commit messages as bullets.
---

# Changelog Manager

This skill automates the maintenance of `CHANGELOG.md` by synchronizing it with the project's git history.

## Workflow

1. **Invoke the update script**:
   Run the bundled script to synchronize `CHANGELOG.md` with git commits.
   
   ```bash
   node scripts/update_changelog.cjs
   ```

2. **Verify changes**:
   Check `CHANGELOG.md` to ensure the entries are correctly grouped by date and accurately reflect the recent work.

3. **Commit the update**:
   The skill modifies `CHANGELOG.md` directly. Remember to stage and commit this file if you are preparing for a merge.

## Details

- **Headings**: Uses `## YYYY-MM-DD` for daily groupings.
- **Bullets**: Each commit subject is added as a bullet point.
- **Initial Creation**: If `CHANGELOG.md` does not exist, the script will generate it from the entire git history.
- **Updates**: Re-running the script will refresh the file with any new commits since the last run.

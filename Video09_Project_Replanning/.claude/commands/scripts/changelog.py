#!/usr/bin/env python3
"""Maintain CHANGELOG.md from git commit history."""

import subprocess
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path


def git_log(since_date=None):
    """Return commits as {date: [subject, ...]} ordered newest-first."""
    cmd = ["git", "log", "--format=%ad|%s", "--date=short"]
    if since_date:
        cmd.append(f"--after={since_date}")
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    by_date = defaultdict(list)
    for line in result.stdout.strip().splitlines():
        if "|" in line:
            date, subject = line.split("|", 1)
            by_date[date.strip()].append(subject.strip())
    return by_date


def last_date_in_changelog(path):
    """Return the first ## YYYY-MM-DD heading found, or None."""
    for line in path.read_text().splitlines():
        if line.startswith("## "):
            candidate = line[3:].strip()
            try:
                datetime.strptime(candidate, "%Y-%m-%d")
                return candidate
            except ValueError:
                continue
    return None


def render_sections(by_date):
    lines = []
    for date in sorted(by_date, reverse=True):
        lines.append(f"\n## {date}\n")
        for subject in by_date[date]:
            lines.append(f"- {subject}\n")
    return lines


def main():
    changelog = Path("CHANGELOG.md")

    if not changelog.exists():
        by_date = git_log()
        if not by_date:
            print("No commits found — nothing to write.")
            sys.exit(0)
        content = ["# Changelog\n"] + render_sections(by_date)
        changelog.write_text("".join(content))
        total = sum(len(v) for v in by_date.values())
        print(f"Created CHANGELOG.md with {total} entries across {len(by_date)} date(s).")
    else:
        last = last_date_in_changelog(changelog)
        by_date = git_log(since_date=last)
        # --after is exclusive, but drop last date if present to be safe
        by_date.pop(last, None)
        if not by_date:
            print("No new commits since last entry — CHANGELOG.md is up to date.")
            sys.exit(0)
        existing = changelog.read_text()
        lines = existing.splitlines(keepends=True)
        # Insert new sections after the title line
        insert_at = 1 if lines and lines[0].startswith("# ") else 0
        updated = "".join(lines[:insert_at] + render_sections(by_date) + lines[insert_at:])
        changelog.write_text(updated)
        total = sum(len(v) for v in by_date.values())
        print(f"Added {total} new entries to CHANGELOG.md.")


if __name__ == "__main__":
    main()

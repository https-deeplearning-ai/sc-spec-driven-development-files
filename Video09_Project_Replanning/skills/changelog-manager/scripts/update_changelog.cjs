const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHANGELOG_PATH = path.join(process.cwd(), 'CHANGELOG.md');

function getGitCommits() {
    try {
        // Get commits with date and subject
        const output = execSync('git log --pretty=format:"%ad|%s" --date=short').toString();
        return output.split('\n').filter(line => line.trim()).map(line => {
            const [date, subject] = line.split('|');
            return { date, subject };
        });
    } catch (e) {
        console.error("Error running git log. Is this a git repository?");
        process.exit(1);
    }
}

function formatChangelog(commitsByDate) {
    let content = '# CHANGELOG\n\n';
    const sortedDates = Object.keys(commitsByDate).sort((a, b) => new Date(b) - new Date(a));
    
    for (const date of sortedDates) {
        content += `## ${date}\n`;
        commitsByDate[date].forEach(subject => {
            content += `- ${subject}\n`;
        });
        content += '\n';
    }
    return content.trim() + '\n';
}

function updateChangelog() {
    const commits = getGitCommits();
    const commitsByDate = {};

    commits.forEach(({ date, subject }) => {
        if (!commitsByDate[date]) {
            commitsByDate[date] = [];
        }
        // Avoid duplicate subjects on same date (simplistic)
        if (!commitsByDate[date].includes(subject)) {
            commitsByDate[date].push(subject);
        }
    });

    if (!fs.existsSync(CHANGELOG_PATH)) {
        console.log("CHANGELOG.md not found. Generating from git history...");
        const content = formatChangelog(commitsByDate);
        fs.writeFileSync(CHANGELOG_PATH, content);
        console.log("✅ Created CHANGELOG.md");
    } else {
        console.log("Updating existing CHANGELOG.md...");
        // For simplicity in this skill, we'll re-generate it to ensure consistency with git
        // A more advanced version would parse existing and append only new ones.
        // But the requirement says "examine git commits and add bullets for each date".
        const content = formatChangelog(commitsByDate);
        fs.writeFileSync(CHANGELOG_PATH, content);
        console.log("✅ Updated CHANGELOG.md");
    }
}

updateChangelog();

---
description: Download CodeRabbit AI review comments for a Pull Request
---

<pr>--pr</pr>

## Download PR Reviews

This command downloads CodeRabbit AI review comments from a GitHub Pull Request and organizes them by severity for systematic resolution.

**This command works from any directory** - it will save reviews to the current working directory's `.reviews/` folder.

## How Claude Code Executes This

When you run `/download --pr 123`, Claude Code will:

1. Find the installed `pr-reviewer` skill location
2. Execute the download script from the skill directory
3. Save output to **your current working directory** (the repo you're working on)

## Command

```bash
# Execute from skill location, save to current working directory
CWD=$(pwd) node ~/.claude/plugins/pr-reviewer/skills/pull-request-skill/run.js download <pr>

# Or without PR number (auto-detect latest)
CWD=$(pwd) node ~/.claude/plugins/pr-reviewer/skills/pull-request-skill/run.js download
```

**Note:** The exact path may vary depending on where Claude Code installs plugins. Claude will handle finding the correct path automatically.

## Prerequisites

1. **GitHub Personal Access Token**

   The skill needs a `.env` file in its installation directory with your GitHub token:

   ```bash
   # Location: ~/.claude/plugins/pr-reviewer/skills/pull-request-skill/.env
   GITHUB_TOKEN=ghp_your_personal_access_token_here
   OUTPUT_DIR=./.reviews
   LOG_LEVEL=info
   PR_REVIEW_TZ=America/Sao_Paulo
   ```

   Generate token at: https://github.com/settings/tokens
   Required scopes: `repo` (full repository access)

2. **Dependencies**

   Dependencies will be auto-installed on first run. To install manually:

   ```bash
   cd ~/.claude/plugins/pr-reviewer/skills/pull-request-skill
   bun install
   ```

## Output Structure

The command creates a directory structure in **your repo's** `.reviews/reviews-pr-<pr>/`:

```
your-repo/
└── .reviews/                           # Created in YOUR working directory
    └── reviews-pr-123/
        ├── summary.md                  # 📊 Overview with statistics
        ├── pr-review-combined.log      # 📋 Full execution logs
        ├── pr-review-error.log         # ⚠️ Error logs only
        ├── issues/                     # 🔧 Resolvable issues (threads)
        │   ├── issue_001_critical_unresolved.md
        │   ├── issue_002_major_unresolved.md
        │   └── issue_003_trivial_resolved.md
        └── comments/                   # 💬 General comments
            ├── comment_001.md
            └── comment_002.md
```

## Issue Severity Levels

Issues are automatically categorized by severity:

- **🔴 Critical**: Serious problems requiring immediate attention
- **🟠 Major**: Important issues affecting functionality
- **🔵 Trivial**: Minor issues and style improvements

## Next Steps

After downloading reviews:

1. **Review the summary**: Check `.reviews/reviews-pr-<pr>/summary.md`
2. **Start fixing issues**: Use the `/fix` command
3. **Track progress**: Issues are marked as resolved/unresolved

## Environment Variables

- `GITHUB_TOKEN` (required): GitHub Personal Access Token
- `OUTPUT_DIR` (optional): Output directory relative to working dir (default: `./.reviews`)
- `CWD` (optional): Override working directory (default: current directory)
- `LOG_LEVEL` (optional): Logging level - `error`, `warn`, `info`, `debug` (default: `info`)
- `PR_REVIEW_TZ` (optional): Timezone for dates (default: system timezone)

## Examples

```bash
# Download PR #123 - saves to current directory's .reviews/
/download --pr 123

# Download latest open PR
/download

# With debug logging
LOG_LEVEL=debug /download --pr 123

# Save to custom directory
OUTPUT_DIR=./my-reviews /download --pr 123
```

## Troubleshooting

**"GITHUB_TOKEN is not set"**
- Create `.env` file in the skill's installation directory
- Path: `~/.claude/plugins/pr-reviewer/skills/pull-request-skill/.env`

**"No CodeRabbit AI comments found"**
- CodeRabbit hasn't reviewed the PR yet
- Check if PR has comments from `@coderabbitai[bot]`

**"Repository information could not be parsed"**
- Verify you're in a git repository
- Check git remote: `git remote -v`
- Remote must be: `https://github.com/owner/repo.git`

## See Also

- `/fix` - Fix issues from a downloaded PR review
- `/status` - Check status of PR reviews

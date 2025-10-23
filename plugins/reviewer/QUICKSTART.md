# Pull Request Skill - Quick Start Guide

Get started with the Pull Request skill in under 5 minutes!

## Prerequisites

- ✅ Git repository with GitHub remote
- ✅ Bun installed ([Install Bun](https://bun.sh))
- ✅ GitHub Personal Access Token ([Create Token](https://github.com/settings/tokens))

## Setup (2 minutes)

### 1. Configure GitHub Token

```bash
cd plugins/reviewer/skills/pull-request-skill

# Copy example and edit
cp .env.example .env

# Add your GitHub token to .env
echo "GITHUB_TOKEN=ghp_your_token_here" >> .env
```

### 2. Test Installation

```bash
# This will auto-install dependencies
node run.js --help
```

You should see the help message. Done! ✨

## Basic Usage (3 minutes)

### Download PR Reviews

```bash
# Download latest open PR
node run.js download

# Or download specific PR
node run.js download 123
```

Output will be in `.reviews/reviews-pr-XXX/`

### Review Issues

```bash
# Check summary
cat .reviews/reviews-pr-123/summary.md

# Read all critical issues
../read-pr-issues.sh --pr 123 --type critical --all
```

### Fix Issues

Use the `/fix` command in Claude Code:

```
/fix --pr 123 --type critical --from 1
```

### Mark as Resolved

After fixing issues:

```bash
../resolve-pr-issues.sh --pr-dir ../../.reviews/reviews-pr-123 --from 1 --to 5
```

## Typical Workflow

1. **Download** → `node run.js download`
2. **Review** → Check `summary.md`
3. **Fix** → Use `/fix` command
4. **Resolve** → Run `resolve-pr-issues.sh`
5. **Commit** → Git commit your fixes

## Next Steps

- 📖 Read the full [README.md](README.md)
- 🔧 Check available [commands](commands/)
- 💡 See [troubleshooting](README.md#troubleshooting)

## Common Issues

**"Bun not found"**
```bash
curl -fsSL https://bun.sh/install | bash
```

**"GITHUB_TOKEN not set"**
```bash
echo "GITHUB_TOKEN=ghp_your_token" > .env
```

**Need help?** Check the [README](README.md) for detailed documentation.

---

Happy reviewing! 🎉

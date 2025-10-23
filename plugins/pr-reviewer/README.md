# Pull Request Review Skill

A Claude Code skill for managing CodeRabbit AI review comments on GitHub Pull Requests. This skill automatically downloads, organizes, and helps resolve PR review feedback systematically.

## 🚀 Features

- ✅ **Auto-download PR reviews** - Fetch CodeRabbit comments from any PR
- ✅ **Severity-based organization** - Issues categorized as Critical/Major/Trivial
- ✅ **Systematic resolution** - Track and resolve issues one by one
- ✅ **GitHub integration** - Auto-resolve threads using GitHub CLI
- ✅ **Progress tracking** - Clear overview of resolved vs unresolved issues
- ✅ **Auto-installation** - Dependencies installed automatically on first run
- ✅ **Flexible configuration** - Environment-based settings

## 📦 Installation

### 1. Install the Skill

Copy this plugin to your Claude Code plugins directory or install from marketplace.

### 2. Initial Setup

```bash
cd plugins/pr-reviewer/skills/pull-request-skill

# Create .env file
cp .env.example .env

# Edit .env and add your GitHub token
# Get token from: https://github.com/settings/tokens
# Required scope: repo (full repository access)
```

### 3. Install Dependencies

Dependencies are auto-installed on first run. To install manually:

```bash
cd plugins/pr-reviewer/skills/pull-request-skill
bun install
```

## 🎯 Usage

### Available Commands

This skill provides three slash commands:

#### `/download` - Download PR Reviews

Download CodeRabbit AI review comments for a Pull Request:

```bash
# Download specific PR
cd plugins/pr-reviewer/skills/pull-request-skill
node run.js download 123

# Download latest open PR (auto-detect)
node run.js download
```

#### `/fix` - Fix Issues

Systematically fix issues from a downloaded PR review:

```bash
# First, review what needs to be fixed
./plugins/pr-reviewer/skills/pull-request-skill/read-pr-issues.sh --pr 123 --type critical --all

# Fix issues using Claude Code
# Use /fix command with appropriate parameters

# After fixing, resolve the issues
./plugins/pr-reviewer/skills/pull-request-skill/resolve-pr-issues.sh --pr-dir .reviews/reviews-pr-123 --from 1 --to 5
```

#### `/status` - Check Status

View current status of PR review issues:

```bash
# View summary
cat ai-docs/reviews-pr-123/summary.md

# Count unresolved issues
find ai-docs/reviews-pr-123/issues -name "*_unresolved.md" | wc -l
```

### Typical Workflow

1. **Download reviews**:

   ```bash
   cd plugins/pr-reviewer/skills/pull-request-skill
   node run.js download 123
   ```

2. **Review issues**:

   ```bash
   # Check summary
   cat .reviews/reviews-pr-123/summary.md

   # Read critical issues
   ./plugins/pr-reviewer/skills/pull-request-skill/read-pr-issues.sh --pr 123 --type critical --all
   ```

3. **Fix issues systematically**:

   - Start with critical issues (🔴)
   - Move to major issues (🟠)
   - Finish with trivial issues (🔵)

4. **Resolve threads**:

   ```bash
   ./plugins/pr-reviewer/skills/pull-request-skill/resolve-pr-issues.sh --pr-dir .reviews/reviews-pr-123 --from 1 --to 10
   ```

5. **Commit changes**:
   ```bash
   git commit -am "fix(repo): resolve PR #123 issues [batch 1-10]"
   ```

## 📁 Output Structure

```
.reviews/
└── reviews-pr-123/
    ├── summary.md                          # 📊 Overview with stats
    ├── pr-review-combined.log              # 📋 Full logs
    ├── pr-review-error.log                 # ⚠️ Error logs
    ├── issues/                             # 🔧 Resolvable issues
    │   ├── issue_001_critical_unresolved.md
    │   ├── issue_002_major_unresolved.md
    │   ├── issue_003_trivial_resolved.md
    │   └── ...
    └── comments/                           # 💬 General comments
        ├── comment_001.md
        ├── comment_002.md
        └── ...
```

## ⚙️ Configuration

Create a `.env` file in `skills/pull-request-skill/`:

```bash
# Required
GITHUB_TOKEN=ghp_your_personal_access_token_here

# Optional
OUTPUT_DIR=./.reviews                   # Output directory (default: ./.reviews)
LOG_LEVEL=info                          # Logging: error, warn, info, debug
PR_REVIEW_TZ=America/Sao_Paulo          # Timezone for dates
```

## 🔧 Helper Scripts

### read-pr-issues.sh

Display issues in a clean, readable format:

```bash
# All issues
./read-pr-issues.sh --pr 123 --type issue --all

# Specific range
./read-pr-issues.sh --pr 123 --type issue --from 1 --to 10

# By severity
./read-pr-issues.sh --pr 123 --type critical --all
./read-pr-issues.sh --pr 123 --type major --all
./read-pr-issues.sh --pr 123 --type trivial --all
```

### resolve-pr-issues.sh

Resolve issues and update GitHub threads:

```bash
# Resolve specific range
./resolve-pr-issues.sh --pr-dir .reviews/reviews-pr-123 --from 1 --to 10

# Resolve all unresolved issues
./resolve-pr-issues.sh --pr-dir .reviews/reviews-pr-123 --all
```

## 🐛 Troubleshooting

### "GITHUB_TOKEN is not set"

Create `.env` file with your token:

```bash
cd plugins/pr-reviewer/skills/pull-request-skill
echo "GITHUB_TOKEN=ghp_your_token" > .env
```

### "Bun is not installed"

Install Bun from https://bun.sh:

```bash
curl -fsSL https://bun.sh/install | bash
```

### "No CodeRabbit AI comments found"

- CodeRabbit hasn't reviewed the PR yet
- Wait a few minutes and try again
- Check if PR has comments from `@coderabbitai[bot]`

### "Repository information could not be parsed"

- Verify you're in a git repository
- Check git remote: `git remote -v`
- Remote must be GitHub: `https://github.com/owner/repo.git`

## 📚 Learn More

- **GitHub Token**: https://github.com/settings/tokens
- **GitHub CLI**: https://cli.github.com
- **Bun Runtime**: https://bun.sh
- **CodeRabbit AI**: https://coderabbit.ai

## 🤝 Contributing

To improve this skill:

1. Report bugs with full logs (`LOG_LEVEL=debug`)
2. Suggest features with use cases
3. Submit PRs with tests
4. Update documentation

## 📝 License

MIT License - See LICENSE file for details

---

**Made for Claude Code** 🤖 | **Powered by Bun** ⚡

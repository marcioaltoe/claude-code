# Git Workflow Plugin

**Agent-based git automation with Haiku for fast, efficient operations**

## Overview

The Git Workflow Plugin provides streamlined git commands that leverage specialized agents running on Claude Haiku for fast, token-efficient automation. Instead of manual git operations, use simple slash commands that delegate to purpose-built agents.

## Architecture

This plugin uses an **agent-based architecture**:

- **Commands** (`/commit`, `/commit-push-pr`, `/clean`) - Simple dispatchers that invoke agents
- **Agents** (`git-commit-agent`, `git-pr-creation-agent`, `git-clean-agent`) - Specialized workers running on Haiku
- **Benefits**:
  - ⚡ **Fast**: Haiku agents complete tasks quickly
  - 💰 **Economical**: Lower token costs with Haiku
  - 🎯 **Focused**: Each agent has a single, well-defined responsibility
  - 🔄 **Parallel-ready**: Agents can run concurrently

## Commands

### `/git:commit`

Creates a git commit with conventional commit message.

**What it does:**
1. Analyzes staged and unstaged changes
2. Generates conventional commit message
3. Stages relevant files
4. Creates the commit

**Usage:**

```bash
/git:commit
```

**Example:**

```bash
# Make some changes
# Then:
/git:commit

# Agent analyzes changes and creates:
# feat(auth): add JWT authentication
```

**Delegates to**: `git-commit-agent` (Haiku)

---

### `/git:commit-push-pr`

Complete workflow: commit → push → create PR to dev branch.

**What it does:**
1. Creates conventional commit
2. Pushes to origin
3. Creates comprehensive PR with summary and test plan

**Usage:**

```bash
/git:commit-push-pr
```

**Example:**

```bash
# Complete your feature
# Then:
/git:commit-push-pr

# Agents will:
# 1. Commit your changes
# 2. Push to remote
# 3. Create PR with detailed description
# 4. Return PR URL
```

**Delegates to**: `git-commit-agent` + `git-pr-creation-agent` (Haiku)

**Requirements**:
- GitHub CLI (`gh`) installed and authenticated
- Repository with remote named `origin`

---

### `/git:clean`

Cleans up local branches deleted from remote.

**What it does:**
1. Identifies branches marked as `[gone]`
2. Removes associated worktrees
3. Deletes stale branches

**Usage:**

```bash
/git:clean
```

**Example:**

```bash
# After PRs are merged
/git:clean

# Agent reports:
# Processing branch: feature/old-feature
#   Removing worktree: /path/to/worktree
#   Deleting branch: feature/old-feature
```

**Delegates to**: `git-clean-agent` (Haiku)

---

## Agent Details

### git-commit-agent

**Model**: Claude Haiku
**Purpose**: Create conventional commits

**Process**:
1. `git status` - See changes
2. `git diff HEAD` - Understand modifications
3. `git add .` - Stage files
4. `git commit -m "<type>(<scope>): <subject>"` - Create commit
5. `git status` - Verify success

**Conventional Commit Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code restructuring
- `perf` - Performance improvement
- `test` - Tests
- `chore` - Build/tooling changes
- `ci` - CI/CD changes
- `build` - Build system changes

---

### git-pr-creation-agent

**Model**: Claude Haiku
**Purpose**: Create comprehensive PRs

**Process**:
1. `gh auth status` - Verify authentication
2. `git branch --show-current` - Get current branch
3. `git log dev..HEAD` - Analyze commits
4. Generate title + body
5. `gh pr create` - Create PR

**PR Structure**:
```markdown
## Summary
[2-3 sentences]

## Key Features
- Feature 1
- Feature 2

## Changes Included
**New Features:**
- ✅ Description

**Bug Fixes:**
- ✅ Description

## Technical Details
**Endpoints/Changes:**
- List of changes

**Database Changes:**
- Schema updates

**Configuration Updates:**
- Environment variables
```

---

### git-clean-agent

**Model**: Claude Haiku
**Purpose**: Clean up stale branches

**Process**:
1. `git branch -v` - List branches
2. `git worktree list` - Find worktrees
3. Remove worktrees for `[gone]` branches
4. `git branch -D` - Delete stale branches
5. Report results

**Safe operation**: Only removes branches already deleted on remote

---

## Conventional Commits

All commits follow the **Conventional Commits** specification:

```
<type>(<scope>): <subject>
```

**Rules**:
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at end
- Max 72 characters
- Scope is optional but recommended

**Examples**:
```bash
feat(auth): add password hashing with bcrypt
fix(api): handle null user ID in session validation
refactor(db): extract query builders into utilities
test(user): add integration tests for profile updates
docs(readme): update installation instructions
```

---

## Workflow Patterns

### Quick Commit

```bash
# Write code
/git:commit
# Continue development
```

### Feature Branch

```bash
# Develop feature with multiple commits
/git:commit  # First commit
# More changes
/git:commit  # Second commit
# Ready for review
/git:commit-push-pr
```

### Maintenance

```bash
# After several PRs merged
/git:clean
# Clean workspace ready
```

---

## Best Practices

### Using `/git:commit`
- Let the agent analyze and generate commit messages
- Trust the conventional commit format
- Use for routine commits during development
- Review suggested message before confirming

### Using `/git:commit-push-pr`
- Use when feature is complete and tested
- Agent analyzes full branch history for PR description
- Review PR description and edit if needed
- Minimizes context switching

### Using `/git:clean`
- Run periodically after merging PRs
- Safe to run - only removes remote-deleted branches
- Keeps local branch list clean
- Helps maintain tidy repository

---

## Requirements

- **Git** - Installed and configured
- **GitHub CLI (`gh`)** - For `/git:commit-push-pr` command
  - Install: `brew install gh` (macOS) or see [GitHub CLI](https://cli.github.com/)
  - Authenticate: `gh auth login`
- **Repository** - Git repository with remote

---

## Troubleshooting

### `/git:commit` creates empty commit

**Issue**: No changes to commit

**Solution**:
- Ensure you have unstaged or staged changes
- Run `git status` to verify

### `/git:commit-push-pr` fails to create PR

**Issue**: `gh pr create` command fails

**Solution**:
- Install GitHub CLI: `brew install gh`
- Authenticate: `gh auth login`
- Ensure repository has GitHub remote

### `/git:clean` doesn't find branches

**Issue**: No branches marked as `[gone]`

**Solution**:
- Run `git fetch --prune` to update remote tracking
- Branches must be deleted from remote

---

## File Structure

```
git/
├── .claude-plugin/
│   └── plugin.json
├── agents/                    # Haiku agents (NEW!)
│   ├── git-commit-agent.md
│   ├── git-pr-creation-agent.md
│   └── git-clean-agent.md
├── commands/                  # Dispatchers
│   ├── commit.md
│   ├── commit-push-pr.md
│   └── clean.md
└── README.md (this file)
```

---

## Why Agent-Based?

**Previous Architecture** (Skills):
- Commands invoked skills directly
- Ran on main Sonnet model
- Higher token costs
- Slower execution

**New Architecture** (Agents):
- Commands dispatch to specialized agents
- Agents run on Haiku (fast + economical)
- Clear separation of concerns
- Parallel execution ready
- Lower operational costs

---

## Tips

- **Combine workflows**: Use `/git:commit` during development, `/git:commit-push-pr` when ready
- **Trust the agents**: Haiku agents are optimized for git operations
- **Regular cleanup**: Run `/git:clean` weekly
- **Review before pushing**: Always verify commit messages and changes

---

## Version

2.0.0 - Agent-based architecture

## Migration from 1.x

If you were using the previous skills-based version:

- **No changes needed** - Commands work the same way
- **Behind the scenes** - Now using faster Haiku agents
- **Benefits** - Faster execution, lower costs
- **Deprecated** - `skills/` directory (moved to `skills.deprecated/`)

---

## Author

**Marcio Altoé**
Email: marcio.altoe@gmail.com

## License

MIT

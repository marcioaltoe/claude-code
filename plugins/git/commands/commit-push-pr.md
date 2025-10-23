---
allowed-tools: Bash(git checkout:*), Bash(git add:*), Bash(git status:*), Bash(git push:*), Bash(git commit:*), Bash(gh pr create:*), Bash(git diff:*), Bash(git branch:*), Bash(git log:*)
description: Quick workflow - commit, push, and create PR to dev
---

## Task

Complete git workflow: stage → commit → push → PR to dev branch

## Context

- Status: !`git status`
- Diff: !`git diff HEAD`
- Branch: !`git branch --show-current`
- Commits: !`git log dev..HEAD --oneline`

## Execution

**Execute in single message:**

1. Create feature branch if on main/dev: `git checkout -b feature/descriptive-name`
2. Stage: `git add .` or specific files
3. Commit: `<type>(<scope>): <subject>` (conventional format)
4. Push: `git push -u origin <branch-name>`
5. PR: `gh pr create --base dev --title "title" --body "summary"`

**Execute directly - no explanations.**

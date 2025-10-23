---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git branch:*)
description: Quick commit command - stages changes and creates commit with conventional commit format
---

## Task

Create a git commit with conventional commit message format: `<type>(<scope>): <subject>`

**Types**: feat, fix, docs, style, refactor, perf, test, chore, ci, build

## Context

- Status: !`git status`
- Diff: !`git diff HEAD`
- Branch: !`git branch --show-current`

## Execution

1. Stage files if needed (`git add .` or specific files)
2. Analyze changes and determine appropriate type/scope
3. Create commit with format: `<type>(<scope>): <subject>`
   - Use imperative mood ("add" not "added")
   - Don't capitalize first letter
   - No period at end
   - Max 72 characters

**Execute directly - no explanations, just commit.**

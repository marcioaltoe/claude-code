---
description: Quick workflow - commit, push, and create PR to dev
---

Complete git workflow: stage → commit → push → PR to dev branch.

Execute in TWO steps:

## Step 1: Commit and Push

Use the Task tool to invoke the git-commit-agent:

```
subagent_type: general-purpose
description: Commit and push changes
prompt: Use the git-commit-agent from plugins/git/agents/git-commit-agent.md to:
1. Create a conventional commit
2. Push to origin with: git push -u origin $(git branch --show-current)
Report the commit message and push status.
```

## Step 2: Create PR

After Step 1 completes, use the Task tool to invoke the git-pr-creation-agent:

```
subagent_type: general-purpose
description: Create pull request
prompt: Use the git-pr-creation-agent from plugins/git/agents/git-pr-creation-agent.md to create a comprehensive PR to the dev branch. Return the PR URL.
```

The agents will handle the entire workflow automatically.

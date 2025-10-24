---
description: Quick commit command - stages changes and creates commit with conventional commit format
---

Create a git commit by delegating to the git-commit-agent.

Use the Task tool to invoke the git-commit-agent:

```
subagent_type: general-purpose
description: Create git commit
prompt: Use the git-commit-agent from plugins/git/agents/git-commit-agent.md to create a conventional commit. Analyze changes, stage files, and create the commit. Report the commit message and status.
```

The agent will handle the entire commit process automatically.

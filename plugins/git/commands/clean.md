---
description: Cleans up all git branches marked as [gone] (branches that have been deleted on the remote but still exist locally), including removing associated worktrees.
---

Clean up stale local branches by delegating to the git-clean-agent.

Use the Task tool to invoke the git-clean-agent:

```
subagent_type: general-purpose
description: Clean up gone branches
prompt: Use the git-clean-agent from plugins/git/agents/git-clean-agent.md to remove all local branches marked as [gone] and their associated worktrees. Report what was cleaned up.
```

The agent will handle the entire cleanup process automatically.

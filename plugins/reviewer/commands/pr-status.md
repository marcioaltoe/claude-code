---
description: Check status of PR review issues
---

<pr>--pr</pr>

## Check PR Review Status

This command displays a summary of the current status of issues for a Pull Request review.

## Usage

```bash
# View summary file for a PR
cat .reviews/reviews-pr-<pr>/summary.md

# Count unresolved issues
find .reviews/reviews-pr-<pr>/issues -name "*_unresolved.md" | wc -l

# Count resolved issues
find .reviews/reviews-pr-<pr>/issues -name "*_resolved.md" | wc -l

# List unresolved critical issues
ls .reviews/reviews-pr-<pr>/issues/*_critical_unresolved.md

# List unresolved major issues
ls .reviews/reviews-pr-<pr>/issues/*_major_unresolved.md

# List unresolved trivial issues
ls .reviews/reviews-pr-<pr>/issues/*_trivial_unresolved.md
```

## Summary File

The `summary.md` file contains:

- **Total Issues**: Breakdown by severity (Critical/Major/Trivial)
- **Resolution Status**: Resolved vs Unresolved counts
- **Issue Links**: Direct links to each issue file
- **File Locations**: Code locations for each issue

## Progress Tracking

The summary is automatically updated when you:

1. Download PR reviews (`/reviewer:download-issues`)
2. Resolve issues using the resolve script

## Example Output

```markdown
# PR Review #123 - CodeRabbit AI Export

## Summary

- **Issues (resolvable review comments):** 15
  - 🔴 Critical: 3
  - 🟠 Major: 7
  - 🔵 Trivial: 5
- **Comments (simple, not resolvable):** 8
  - **Resolved issues:** 10 ✓
  - **Unresolved issues:** 5

**Generated on:** 2025-01-15 14:30:00 America/Sao_Paulo
```

## Quick Status Check

Create an alias for quick status checks:

```bash
# Add to your .bashrc or .zshrc
alias pr-status='f() { cat .reviews/reviews-pr-$1/summary.md | head -20; }; f'

# Usage
pr-status 123
```

## See Also

- `/reviewer:download-issues` - Download PR reviews
- `/reviewer:fix-issues` - Fix issues from a PR review

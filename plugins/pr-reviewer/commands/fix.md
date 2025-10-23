---
description: Fix issues for a given PR
---

<type>--type</type>
<pr>--pr</pr>
<from>--from</from>

## Fix PR Review Issues

This command helps you systematically fix issues from a downloaded CodeRabbit AI review.

**Works from any directory** - reads issues from `.reviews/` in your current working directory.

## Helper Commands

Before starting work on fixing issues, use the `read-pr-issues.sh` script to review what needs to be addressed:

```bash
# Read all issues for a PR (from your working directory's .reviews/)
~/.claude/plugins/pr-reviewer/skills/pull-request-skill/read-pr-issues.sh --pr <pr> --type issue --all

# Read a specific range of issues
~/.claude/plugins/pr-reviewer/skills/pull-request-skill/read-pr-issues.sh --pr <pr> --type issue --from <from> --to 10

# Read critical issues only
~/.claude/plugins/pr-reviewer/skills/pull-request-skill/read-pr-issues.sh --pr <pr> --type critical --all

# Read major issues only
~/.claude/plugins/pr-reviewer/skills/pull-request-skill/read-pr-issues.sh --pr <pr> --type major --all

# Read trivial issues only
~/.claude/plugins/pr-reviewer/skills/pull-request-skill/read-pr-issues.sh --pr <pr> --type trivial --all
```

**Note:** The exact path may vary. Claude Code will find the skill automatically.

This script displays issues in a clean, readable format with:

- Issue numbers and titles
- File locations
- Current status (resolved/unresolved)
- Issue descriptions
- Thread IDs for GitHub reference

## Critical Requirements

<critical>
- **YOU NEED** to fix the <type> from <from> in the `.reviews/reviews-pr-<pr>`, and only finish when ALL THESE ISSUES are addressed;
- This should be fixed in THE BEST WAY possible, not using workarounds;
- **YOU MUST** follow project standards and rules from `.cursor/rules` or `.claude/CLAUDE.md`, and ensure all parameters are addressed;
- If, in the end, you don't have all issues addressed, your work will be **INVALIDATED**;
- After making all the changes, you need to update the progress in the `summary.md` file and all the related issue files.
- **MUST DO:** After resolving every issue run `~/.claude/plugins/pr-reviewer/skills/pull-request-skill/resolve-pr-issues.sh --pr-dir .reviews/reviews-pr-<pr> --from <from> --to <end>` so the script calls `gh` to close the review threads and refreshes the summary.
</critical>

## Workflow

1. **Read issues** to understand what needs to be fixed
2. **Fix the code** following best practices and project standards
3. **Mark as resolved** using the resolve script
4. **Commit changes** with descriptive message

## After Finishing

<after_finish>

- **MUST COMMIT:** After fixing ALL issues in this batch and ensuring `make lint && make test` pass (or equivalent),
  commit the changes with a descriptive message that references the PR and fixed issues.
  Example: `git commit -am "fix(repo): resolve PR #<pr> issues [batch <from>-<end>]"`
  Note: Commit locally only - do NOT push. Multiple batches will be committed separately.
</after_finish>

## Examples

```bash
# Fix critical issues starting from issue 1
/fix --pr 123 --type critical --from 1

# Fix major issues from 5 to 10
/fix --pr 123 --type major --from 5

# Fix all trivial issues
/fix --pr 123 --type trivial --from 1
```

## Resolving Issues

After fixing issues, mark them as resolved:

```bash
# Resolve issues 1-10
~/.claude/plugins/pr-reviewer/skills/pull-request-skill/resolve-pr-issues.sh --pr-dir .reviews/reviews-pr-123 --from 1 --to 10

# Resolve all unresolved issues
~/.claude/plugins/pr-reviewer/skills/pull-request-skill/resolve-pr-issues.sh --pr-dir .reviews/reviews-pr-123 --all
```

This will:
- Mark threads as resolved in GitHub
- Rename files from `*_unresolved.md` to `*_resolved.md`
- Update the summary

## See Also

- `/download` - Download PR reviews
- `/status` - Check status of PR reviews

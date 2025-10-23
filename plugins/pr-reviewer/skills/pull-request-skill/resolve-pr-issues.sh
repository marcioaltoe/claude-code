#!/usr/bin/env bash

# Resolve PR Issues Script
# Marks review threads as resolved using GitHub CLI and updates the summary
#
# Usage:
#   ./resolve-pr-issues.sh --pr-dir ./ai-docs/reviews-pr-277 --from 1 --to 10
#   ./resolve-pr-issues.sh --pr-dir ./ai-docs/reviews-pr-277 --all

set -euo pipefail

# Default values
PR_DIR=""
FROM=""
TO=""
ALL=false
# Use CWD if provided (for when called from skill location), otherwise use current directory
WORKING_DIR="${CWD:-$(pwd)}"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --pr-dir)
      PR_DIR="$2"
      shift 2
      ;;
    --from)
      FROM="$2"
      shift 2
      ;;
    --to)
      TO="$2"
      shift 2
      ;;
    --all)
      ALL=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 --pr-dir PR_DIR [--from N --to M | --all]"
      exit 1
      ;;
  esac
done

# Validate PR directory
if [[ -z "$PR_DIR" ]]; then
  echo "❌ Error: --pr-dir is required"
  exit 1
fi

# Resolve PR_DIR relative to WORKING_DIR if it's not absolute
if [[ ! "$PR_DIR" = /* ]]; then
  PR_DIR="${WORKING_DIR}/${PR_DIR}"
fi

if [[ ! -d "$PR_DIR" ]]; then
  echo "❌ Error: PR directory not found: $PR_DIR"
  exit 1
fi

ISSUES_DIR="${PR_DIR}/issues"

if [[ ! -d "$ISSUES_DIR" ]]; then
  echo "❌ Error: Issues directory not found: $ISSUES_DIR"
  exit 1
fi

# Check if gh is installed
if ! command -v gh &> /dev/null; then
  echo "❌ Error: GitHub CLI (gh) is not installed"
  echo "Install from: https://cli.github.com"
  exit 1
fi

echo "🔧 Resolving issues in: $PR_DIR"
echo ""

# Find unresolved issue files
if [[ "$ALL" == true ]]; then
  FILES=($(find "$ISSUES_DIR" -name "issue_*_unresolved.md" -type f | sort))
else
  if [[ -z "$FROM" ]] || [[ -z "$TO" ]]; then
    echo "❌ Error: Either use --all or specify both --from and --to"
    exit 1
  fi

  FILES=()
  for i in $(seq "$FROM" "$TO"); do
    ISSUE_NUM=$(printf "%03d" "$i")
    MATCHES=($(find "$ISSUES_DIR" -name "issue_${ISSUE_NUM}_*_unresolved.md" -type f))
    if [[ ${#MATCHES[@]} -gt 0 ]]; then
      FILES+=("${MATCHES[@]}")
    fi
  done
fi

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "✅ No unresolved issues found in specified range"
  exit 0
fi

echo "Found ${#FILES[@]} unresolved issue(s) to process"
echo ""

RESOLVED_COUNT=0
FAILED_COUNT=0

# Process each file
for file in "${FILES[@]}"; do
  filename=$(basename "$file")

  # Extract thread ID from file
  THREAD_ID=$(grep -m1 "^- Thread ID:" "$file" | sed 's/^- Thread ID: `\(.*\)`$/\1/' || echo "")

  if [[ -z "$THREAD_ID" ]] || [[ "$THREAD_ID" == "(not found)" ]]; then
    echo "⚠️  Skipping $filename - no thread ID found"
    ((FAILED_COUNT++))
    continue
  fi

  echo "Processing: $filename"
  echo "  Thread ID: $THREAD_ID"

  # Resolve the thread using GitHub CLI
  if gh api graphql \
    -f query='mutation($threadId: ID!) { resolveReviewThread(input: { threadId: $threadId }) { thread { isResolved } } }' \
    -F threadId="$THREAD_ID" &> /dev/null; then

    echo "  ✅ Resolved successfully"

    # Rename file from unresolved to resolved
    NEW_FILE="${file/_unresolved.md/_resolved.md}"
    mv "$file" "$NEW_FILE"

    # Update status in file
    sed -i.bak 's/- \[ \] UNRESOLVED/- [x] RESOLVED ✓/g' "$NEW_FILE"
    sed -i.bak 's/UNRESOLVED/RESOLVED/g' "$NEW_FILE"
    rm -f "${NEW_FILE}.bak"

    ((RESOLVED_COUNT++))
  else
    echo "  ❌ Failed to resolve"
    ((FAILED_COUNT++))
  fi

  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary:"
echo "  ✅ Resolved: $RESOLVED_COUNT"
echo "  ❌ Failed: $FAILED_COUNT"
echo "  📊 Total processed: ${#FILES[@]}"
echo ""

if [[ $RESOLVED_COUNT -gt 0 ]]; then
  echo "🔄 Re-running PR review export to update summary..."

  # Extract PR number from directory name
  PR_NUM=$(basename "$PR_DIR" | sed 's/reviews-pr-//')

  # Re-run the export script to update summary
  if command -v bun &> /dev/null; then
    SCRIPT_DIR="$(dirname "$0")"
    if CWD="$WORKING_DIR" bun run "$SCRIPT_DIR/pr-review.ts" "$PR_NUM"; then
      echo "✅ Summary updated successfully"
    else
      echo "⚠️  Warning: Failed to update summary, but issues were resolved"
    fi
  else
    echo "⚠️  Warning: Bun not found, summary not updated automatically"
    echo "Run manually: CWD=$(pwd) bun run <skill-path>/pr-review.ts $PR_NUM"
  fi
fi

echo ""
echo "✅ Done!"

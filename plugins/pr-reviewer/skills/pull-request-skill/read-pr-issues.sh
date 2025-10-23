#!/usr/bin/env bash

# Read PR Issues Script
# Displays issues from the PR review export in a clean, readable format
#
# Usage:
#   ./read-pr-issues.sh --pr 277 --type issue --all
#   ./read-pr-issues.sh --pr 277 --type issue --from 1 --to 10
#   ./read-pr-issues.sh --pr 277 --type critical --all
#   ./read-pr-issues.sh --pr 277 --type major --all
#   ./read-pr-issues.sh --pr 277 --type trivial --all

set -euo pipefail

# Default values
PR=""
TYPE="issue"
FROM=""
TO=""
ALL=false
# Use CWD if provided (for when called from skill location), otherwise use current directory
WORKING_DIR="${CWD:-$(pwd)}"
BASE_DIR="${OUTPUT_DIR:-./.reviews}"
# Resolve BASE_DIR relative to WORKING_DIR if it's not absolute
if [[ ! "$BASE_DIR" = /* ]]; then
  BASE_DIR="${WORKING_DIR}/${BASE_DIR}"
fi

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --pr)
      PR="$2"
      shift 2
      ;;
    --type)
      TYPE="$2"
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
    --base-dir)
      BASE_DIR="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 --pr PR_NUMBER --type TYPE [--from N --to M | --all] [--base-dir DIR]"
      echo "Types: issue, critical, major, trivial"
      exit 1
      ;;
  esac
done

# Validate PR number
if [[ -z "$PR" ]]; then
  echo "❌ Error: --pr is required"
  exit 1
fi

# Set PR directory
PR_DIR="${BASE_DIR}/reviews-pr-${PR}"

if [[ ! -d "$PR_DIR" ]]; then
  echo "❌ Error: PR directory not found: $PR_DIR"
  echo "Have you run the download command first?"
  exit 1
fi

echo "📂 Reading issues from: $PR_DIR"
echo ""

# Determine which files to read based on type
case "$TYPE" in
  critical|major|trivial)
    PATTERN="*_${TYPE}_*.md"
    DIR="${PR_DIR}/issues"
    ;;
  issue)
    PATTERN="issue_*.md"
    DIR="${PR_DIR}/issues"
    ;;
  *)
    echo "❌ Error: Unknown type: $TYPE"
    echo "Valid types: issue, critical, major, trivial"
    exit 1
    ;;
esac

# Find matching files
if [[ "$ALL" == true ]]; then
  FILES=($(find "$DIR" -name "$PATTERN" -type f | sort))
else
  if [[ -z "$FROM" ]] || [[ -z "$TO" ]]; then
    echo "❌ Error: Either use --all or specify both --from and --to"
    exit 1
  fi

  FILES=()
  for i in $(seq "$FROM" "$TO"); do
    ISSUE_NUM=$(printf "%03d" "$i")
    MATCHES=($(find "$DIR" -name "issue_${ISSUE_NUM}_*.md" -type f))
    if [[ ${#MATCHES[@]} -gt 0 ]]; then
      FILES+=("${MATCHES[0]}")
    fi
  done
fi

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "⚠️  No issues found matching criteria"
  exit 0
fi

echo "Found ${#FILES[@]} issue(s)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Display each file
for file in "${FILES[@]}"; do
  filename=$(basename "$file")
  echo "📄 $filename"
  echo ""
  cat "$file"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
done

echo "✅ Displayed ${#FILES[@]} issue(s)"

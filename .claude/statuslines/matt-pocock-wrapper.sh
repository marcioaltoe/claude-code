#!/bin/bash

# Read JSON input once
input=$(cat)

# Get git info from existing script
git_info=$(echo "$input" | bash ~/.claude/statuslines/matt-pocock-command.sh)

# Get context percentage from ccstatusline
# Using bunx (Bun's npx equivalent) for better performance
context_pct=$(echo "$input" | bunx ccstatusline)

# Combine outputs
printf '%s | %s' "$git_info" "$context_pct"

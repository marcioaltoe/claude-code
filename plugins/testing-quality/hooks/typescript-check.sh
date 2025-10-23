#!/bin/bash
#
# TypeScript and Code Quality Check Hook
#
# This hook validates TypeScript files when they are created or modified.
# It runs TypeScript type checking and Biome linting to ensure code quality.
#
# Installation:
#   1. Copy to: .claude/hooks/on-tool-use/typescript-check.sh
#   2. Make executable: chmod +x .claude/hooks/on-tool-use/typescript-check.sh
#   3. Configure Claude Code to use this hook for Write/Edit operations
#

# Set up logging
LOG_FILE="$HOME/.claude/hooks/typescript-check.log"
mkdir -p "$(dirname "$LOG_FILE")"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Start logging
log "=== Hook execution started (JSON mode) ==="

# Read JSON input from stdin
input=$(cat)

# Log the raw input
log "Raw input received: $input"

# Extract file path from the JSON input
file_path=$(echo "$input" | jq -r '.tool_input.file_path // .tool_input.target_file // empty')

log "Extracted file_path: '$file_path'"

# Check if file path is not empty and is a TypeScript file
if [[ -n "$file_path" && "$file_path" != "null" && "$file_path" != "empty" ]]; then
    log "File path is not empty: $file_path"

    # Check if it's a TypeScript file
    if [[ "$file_path" == *.ts || "$file_path" == *.tsx ]]; then
        log "File is a TypeScript file: $file_path"

        # Check if the file actually exists
        if [[ -f "$file_path" ]]; then
            log "Running quality checks on $file_path..."

            # Get the directory containing the TypeScript file
            dir=$(dirname "$file_path")
            log "File directory: $dir"

            # Look for project root (contains package.json)
            project_root="$dir"
            while [[ "$project_root" != "/" ]]; do
                if [[ -f "$project_root/package.json" ]]; then
                    log "Found project root at: $project_root"
                    break
                fi
                project_root=$(dirname "$project_root")
            done

            # If no package.json found, use file directory
            if [[ ! -f "$project_root/package.json" ]]; then
                log "No package.json found, using file directory: $dir"
                project_root="$dir"
            fi

            # Function to find command in project
            find_cmd() {
                local cmd_name=$1
                local paths=(
                    "$(command -v "$cmd_name" 2>/dev/null)"
                    "$project_root/node_modules/.bin/$cmd_name"
                    "$HOME/.bun/bin/$cmd_name"
                    "/usr/local/bin/$cmd_name"
                    "/opt/homebrew/bin/$cmd_name"
                )

                for path in "${paths[@]}"; do
                    if [[ -x "$path" && -n "$path" ]]; then
                        echo "$path"
                        return 0
                    fi
                done

                return 1
            }

            # Variables to track results
            tsc_success=true
            biome_success=true
            all_output=""

            # Change to project root for all operations
            cd "$project_root" || exit 1

            # 1. Run TypeScript type check
            tsc_cmd=$(find_cmd tsc)
            if [[ -n "$tsc_cmd" ]]; then
                log "Found tsc at: $tsc_cmd"
                log "Running: $tsc_cmd --noEmit"

                tsc_output=$("$tsc_cmd" --noEmit 2>&1)
                tsc_exit_code=$?

                if [[ -n "$tsc_output" ]]; then
                    log "tsc output: $tsc_output"
                    all_output="TypeScript Check:\n$tsc_output\n\n"
                fi

                log "tsc exit code: $tsc_exit_code"

                if [[ $tsc_exit_code -ne 0 ]]; then
                    log "TypeScript check found type errors"
                    tsc_success=false
                fi
            else
                log "WARNING: TypeScript compiler not found"
                all_output="WARNING: TypeScript compiler not found. Install TypeScript to enable type checking.\n\n"
            fi

            # 2. Run Biome check
            biome_cmd=$(find_cmd biome)
            if [[ -n "$biome_cmd" ]]; then
                log "Found biome at: $biome_cmd"
                log "Running: $biome_cmd check $file_path"

                biome_output=$("$biome_cmd" check "$file_path" 2>&1)
                biome_exit_code=$?

                if [[ -n "$biome_output" ]]; then
                    log "biome output: $biome_output"
                    all_output="${all_output}Biome Check:\n$biome_output"
                fi

                log "biome exit code: $biome_exit_code"

                if [[ $biome_exit_code -ne 0 ]]; then
                    log "Biome check found errors"
                    biome_success=false
                fi
            else
                log "WARNING: Biome not found"
                all_output="${all_output}WARNING: Biome not found. Install @biomejs/biome to enable linting."
            fi

            # Determine final result
            if [[ "$tsc_success" == true && "$biome_success" == true ]]; then
                log "All checks passed successfully"
                decision='{"suppressOutput": false}'
                log "Hook decision: $decision"
                echo "$decision"
            else
                # Errors found - block the operation
                log "Checks failed - blocking operation"

                reason="Code quality checks failed for $file_path"

                if [[ "$tsc_success" == false ]]; then
                    reason="$reason\n\n❌ TypeScript errors found"
                fi

                if [[ "$biome_success" == false ]]; then
                    reason="$reason\n\n❌ Biome lint/format errors found"
                fi

                if [[ -n "$all_output" ]]; then
                    reason="$reason:\n\n$all_output\n\n💡 Run these commands to fix:\n  bun run format\n  bun run lint:fix\n  bun run type-check"
                else
                    reason="$reason. Please fix these issues before proceeding."
                fi

                # Return blocking JSON response
                decision=$(jq -n --arg reason "$reason" '{
                    "decision": "block",
                    "reason": $reason
                }')
                log "Hook decision: $decision"
                echo "$decision"
            fi
        else
            log "File does not exist: $file_path"
            echo '{}'
        fi
    else
        log "Not a TypeScript file, skipping: $file_path"
        echo '{}'
    fi
else
    log "File path is empty or null, skipping"
    echo '{}'
fi

log "=== Hook execution completed (JSON mode) ==="
log ""

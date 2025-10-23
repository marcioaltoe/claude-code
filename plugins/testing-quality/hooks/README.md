# Claude Code Hooks

This directory contains hooks that integrate with Claude Code to provide real-time code quality validation.

## Available Hooks

### typescript-check.sh

Validates TypeScript files when they are created or modified through Claude Code's Write or Edit tools.

**What it checks:**

- ✅ TypeScript type errors (`tsc --noEmit`)
- ✅ Biome lint/format errors (`biome check`)

**When it runs:**

- After Write tool creates a `.ts` or `.tsx` file
- After Edit tool modifies a `.ts` or `.tsx` file

**Behavior:**

- ✅ **Passes**: Allows the operation to complete
- ❌ **Fails**: Blocks the operation and shows detailed errors with suggestions

## Hook Configuration

The `hooks.json` file registers hooks with Claude Code:

```json
{
  "description": "TypeScript and code quality validation hook for Write/Edit operations on .ts/.tsx files",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/typescript-check.sh"
          }
        ]
      }
    ]
  }
}
```

## How It Works

1. **User requests file creation/edit**: Claude Code invokes Write or Edit tool
2. **Tool completes**: File is written/edited to disk
3. **Hook triggers**: `typescript-check.sh` executes
4. **Validation runs**:
   - Checks if file is `.ts` or `.tsx`
   - Runs `tsc --noEmit` for type checking
   - Runs `biome check` for linting
5. **Result**:
   - **All pass**: Operation succeeds, user sees success message
   - **Errors found**: Operation is blocked, user sees detailed error report

## Example Output

### ✅ Success

```
TypeScript Check:
✅ No type errors found

Biome Check:
✅ No lint errors found

✅ Code quality checks passed!
```

### ❌ Failure

```
❌ Code quality checks failed for src/utils/helper.ts:

❌ TypeScript errors found:
src/utils/helper.ts:15:3 - Type 'string' is not assignable to type 'number'
src/utils/helper.ts:23:7 - Property 'email' does not exist on type 'User'

❌ Biome lint/format errors found:
src/utils/helper.ts:15:3 - Unused variable 'response'
src/utils/helper.ts:42:1 - Missing return type

💡 Run these commands to fix:
  bun run format
  bun run lint:fix
  bun run type-check
```

## Installation

The hooks are **automatically registered** when the plugin is loaded by Claude Code. No manual installation needed.

## Configuration

### Disable Hook Temporarily

If you need to bypass the hook temporarily:

```bash
# Set environment variable
export SKIP_TYPESCRIPT_CHECK=1

# Or disable in Claude Code settings
```

### Customize Hook Behavior

Edit `typescript-check.sh` to adjust:

- Which tools to run (tsc, biome)
- Error message formatting
- Suggested fix commands

## Troubleshooting

### Hook Not Running

**Check:**

1. Plugin is properly loaded
2. `typescript-check.sh` is executable: `chmod +x hooks/typescript-check.sh`
3. `hooks.json` is valid JSON
4. Hook log file: `~/.claude/hooks/typescript-check.log`

### False Positives

If the hook is too strict:

1. **Adjust Biome rules** in project's `biome.json`
2. **Exclude files** in `.gitignore` or Biome config
3. **Disable specific rules** for certain files

### Performance Issues

If hook is too slow:

1. **Run only on changed files** (modify script to check specific file)
2. **Disable type checking for large projects** (comment out `tsc` in script)
3. **Use incremental TypeScript** (add `--incremental` flag)

## Log File

Hook execution is logged to:

```
~/.claude/hooks/typescript-check.log
```

View logs:

```bash
tail -f ~/.claude/hooks/typescript-check.log
```

## Best Practices

1. **Keep hook fast**: Only run essential checks
2. **Provide clear errors**: Show exact line numbers and fixes
3. **Log everything**: Use the log file for debugging
4. **Test thoroughly**: Ensure hook doesn't block valid operations
5. **Document behavior**: Explain what the hook does and why

## Comparison with Pre-commit Hooks

| Feature      | Claude Code Hook     | Git Pre-commit Hook       |
| ------------ | -------------------- | ------------------------- |
| **Trigger**  | On file Write/Edit   | On git commit             |
| **Scope**    | Single file          | Staged files              |
| **Speed**    | Per-file validation  | Batch validation          |
| **Blocking** | Blocks file creation | Blocks commit             |
| **Best for** | Real-time feedback   | Final check before commit |

**Recommendation**: Use **both**:

- Claude Code hooks for immediate feedback during development
- Pre-commit hooks for final validation before committing

## Related

- **Pre-commit hooks**: See `templates/.husky/` for Git pre-commit hooks
- **Quality gates**: See `commands/quality-gates.md` for full workflow
- **TypeScript config**: Adjust `tsconfig.json` for type checking behavior
- **Biome config**: Adjust `biome.json` for linting behavior

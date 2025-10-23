---
description: Run complete quality gates workflow (craft → format → lint → type-check → test)
---

# Quality Gates

Execute the complete quality gates workflow to ensure code quality before committing.

## What This Does

Runs the following sequence in order:

1. **Barrel Files** (`bun run craft`) - Generate/update barrel files
2. **Format** (`bun run format`) - Format code with Biome + Prettier
3. **Lint** (`bun run lint`) - Lint code with Biome
4. **Type Check** (`bun run type-check`) - TypeScript type checking
5. **Tests** (`bun test`) - Run all tests

## When to Use

Run quality gates:
- ✅ Before committing code
- ✅ After implementing a feature
- ✅ After fixing bugs
- ✅ Before creating a pull request
- ✅ After resolving merge conflicts
- ✅ Before pushing to remote

## Instructions

1. **Check current status**:
   ```bash
   git status
   ```

2. **Run quality gates**:
   ```bash
   bun run quality
   ```

3. **Review output**:
   - Each step will show its results
   - Process stops on first failure
   - Fix any issues reported

4. **Fix issues if needed**:
   ```bash
   # Fix formatting issues
   bun run format

   # Fix linting issues (safe)
   bun run lint

   # Fix linting issues (aggressive)
   bun run lint:fix

   # Check TypeScript errors
   bun run type-check

   # Run tests
   bun test
   ```

5. **Re-run quality gates**:
   ```bash
   bun run quality
   ```

6. **Commit when all pass**:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

## Expected Output

### ✅ Success

```
→ Running quality gates...

[1/5] Generating barrel files...
✅ Generated 10 barrel file(s)

[2/5] Formatting code...
✅ Code formatted successfully

[3/5] Linting code...
✅ No lint errors found

[4/5] Type checking...
✅ No type errors found

[5/5] Running tests...
✅ All tests passed (15 passed, 15 total)

✅ Quality gates passed! Ready to commit.
```

### ❌ Failure Examples

**Format Errors:**
```
[2/5] Formatting code...
❌ Formatting issues found in:
  - src/utils/helper.ts
  - src/components/button.tsx

Fix with: bun run format
```

**Lint Errors:**
```
[3/5] Linting code...
❌ Lint errors found:
  - src/services/api.ts:15:3 - Unused variable 'response'
  - src/utils/validator.ts:42:1 - Missing return type

Fix with: bun run lint:fix
```

**Type Errors:**
```
[4/5] Type checking...
❌ TypeScript errors found:
  src/models/user.ts:23:5 - Type 'string' is not assignable to type 'number'
  src/services/auth.ts:45:12 - Property 'email' does not exist on type 'User'

Fix these errors manually, then run type-check again
```

**Test Failures:**
```
[5/5] Running tests...
❌ Tests failed:
  ✓ UserService > creates user (2ms)
  ✗ UserService > validates email (5ms)
    Expected: true
    Received: false

  1 test failed, 14 passed (15 total)

Fix the failing tests and run again
```

## Common Issues

### Issue: Barrel files conflict

**Problem:**
```
Barrel file generation failed - conflicting index.ts found
```

**Solution:**
```bash
# Review and clean old barrel files
bun run craft:clean --dry-run

# If safe, clean them
bun run craft:clean

# Regenerate
bun run craft
```

### Issue: Format and lint conflicts

**Problem:**
```
Format and lint producing different results
```

**Solution:**
```bash
# Run format first (always)
bun run format

# Then lint
bun run lint:fix

# Check again
bun run quality
```

### Issue: Type errors after refactoring

**Problem:**
```
Multiple type errors after code changes
```

**Solution:**
```bash
# Run type check with details
bun run type-check

# Fix errors one by one
# Re-check after each fix
bun run type-check
```

### Issue: Tests timing out

**Problem:**
```
Tests failing with timeout errors
```

**Solution:**
```bash
# Run tests with increased timeout
bun test --timeout 30000

# Or update bunfig.toml:
# [test]
# timeout = 30000
```

## Individual Commands

If you need to run steps individually:

```bash
# Step 1: Barrel files
bun run craft

# Step 2: Format
bun run format

# Step 3: Lint
bun run lint

# Step 4: Type check
bun run type-check

# Step 5: Tests
bun test
```

## Pre-commit Hook

Quality gates (format + lint-staged) run automatically on commit via Husky:

```bash
git commit -m "feat: new feature"

# Automatically runs:
# → Pre-commit: quality gates (format, lint-staged)
# ✓ Pre-commit: todas as verificações passaram
```

**Note:** Pre-commit runs a lighter version:
- ✅ Format
- ✅ Lint-staged (only staged files)

Full quality gates (including type-check and tests) should be run manually before pushing.

## CI/CD Integration

Quality gates should also run in your CI/CD pipeline:

```yaml
# .github/workflows/quality.yml
name: Quality Checks

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run quality
```

## Best Practices

1. **Run before every commit**:
   - Catches issues early
   - Prevents broken commits
   - Maintains code quality

2. **Fix issues immediately**:
   - Don't accumulate technical debt
   - Small fixes are easier
   - Keeps codebase clean

3. **Use in development workflow**:
   ```bash
   # During development
   bun run format  # Format as you go

   # Before commit
   bun run quality  # Full check

   # Commit
   git commit -m "feat: feature name"
   ```

4. **Run after merges**:
   ```bash
   git merge dev
   bun run quality  # Ensure no conflicts
   git push
   ```

5. **Keep scripts up to date**:
   - Review package.json scripts
   - Update configurations
   - Maintain documentation

## Script Configuration

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "craft": "barrel-craft",
    "craft:clean": "barrel-craft clean --force",
    "format": "biome format --write . && bun run format:md && bun run format:pkg",
    "format:md": "prettier --write '**/*.md' --log-level error",
    "format:pkg": "prettier-package-json --write package.json --log-level error",
    "lint": "biome check --write .",
    "lint:fix": "biome check --write . --unsafe",
    "type-check": "tsc --noEmit",
    "test": "bun test --timeout 10000",
    "quality": "bun run craft && bun run format && bun run lint && bun run type-check && bun test"
  }
}
```

## Troubleshooting

### Quality gates won't run

```bash
# Check if scripts exist
cat package.json | grep -A 1 '"quality"'

# Check if dependencies are installed
bun install

# Run with verbose output
bun run quality --verbose
```

### Command not found errors

```bash
# Install missing tools
bun add -D @biomejs/biome prettier barrel-craft

# Install TypeScript if needed
bun add -D typescript
```

### Permission issues

```bash
# Make sure node_modules/.bin is accessible
chmod +x node_modules/.bin/*

# Or use bunx
bunx barrel-craft
bunx biome check .
```

## Summary

Quality gates ensure:
- ✅ Clean, organized imports (barrel files)
- ✅ Consistent code formatting
- ✅ No linting errors
- ✅ No type errors
- ✅ All tests passing

Run `bun run quality` before every commit to maintain high code quality standards!

---
name: project-workflow
description: Development workflow and quality gates for the Bun + TypeScript stack. **ALWAYS use before commits** to ensure quality gates are met. Also use when starting development or when user asks about workflow process. Examples - "before commit", "quality gates", "workflow checklist", "bun commands", "pre-commit checks".
---

You are an expert in guiding developers through the project's development workflow and quality gates. You ensure all necessary steps are executed before committing code.

**For complete project rules and standards, see CLAUDE.md (global instructions)**

## When to Engage

You should proactively assist:

- **Before committing code** (most important)
- When user asks about workflow or process
- When setting up quality gates
- When troubleshooting Bun-specific issues

## Pre-Commit Checklist

**MANDATORY - Execute in this order:**

```bash
# Step 1: Update barrel files (if files were added/moved/deleted)
bun run craft

# Step 2: Format code
bun run format

# Step 3: Lint code
bun run lint

# Step 4: Type check
bun run type-check

# Step 5: Run tests
bun run test
```

**Or run all at once:**

```bash
bun run quality  # Executes all 5 steps
```

**Checklist:**

- [ ] Files added/moved/deleted? Run `bun run craft`
- [ ] All tests passing? (`bun run test` - green)
- [ ] No TypeScript errors? (`bun run type-check` - clean)
- [ ] No linting errors? (`bun run lint` - clean)
- [ ] Code formatted? (`bun run format` - applied)
- [ ] Committed to feature branch? (not main/dev)
- [ ] Commit message follows conventions?

**For complete TypeScript type safety rules (type guards), see `typescript-type-safety` skill**

## Bun-Specific Commands

### Testing Commands

**CRITICAL - NEVER use:**

```bash
bun test  # ❌ WRONG - May not work correctly
```

**ALWAYS use:**

```bash
bun run test  # ✅ CORRECT - Uses package.json script
```

### Barrel Files

**ALWAYS run after creating/moving/deleting files:**

```bash
bun run craft
```

This updates barrel files (index.ts exports) for clean imports.

**When to run:**

- After creating new files
- After moving/renaming files
- After deleting files
- Before committing changes

## Bun Runtime APIs

**Prefer Bun APIs over Node.js:**

```typescript
// ✅ Password hashing
const hashedPassword = await Bun.password.hash(password, {
  algorithm: "bcrypt",
  cost: 10,
});

// ✅ File operations
const file = Bun.file("./config.json");
const config = await file.json();

// ✅ UUID v7
const id = Bun.randomUUIDv7();

// ✅ SQLite
import { Database } from "bun:sqlite";
const db = new Database("mydb.sqlite");

// ✅ HTTP server
import { serve } from "bun";
serve({
  port: 3000,
  fetch(req) {
    return new Response("Hello from Bun!");
  },
});
```

## Quality Gates Execution Order

**Why this order matters:**

1. **craft** - Ensures imports are correct before other checks
2. **format** - Auto-fixes formatting issues
3. **lint** - Catches code quality issues
4. **type-check** - Validates TypeScript correctness
5. **test** - Ensures functionality works

**Each step depends on the previous one passing.**

## Common Workflow Mistakes

**Mistakes to avoid:**

1. ❌ Using `bun test` instead of `bun run test`
2. ❌ Forgetting `bun run craft` after file operations
3. ❌ Committing with TypeScript errors
4. ❌ Skipping quality gates
5. ❌ Running quality gates out of order
6. ❌ Committing directly to main/dev branches
7. ❌ Using Node.js APIs instead of Bun APIs
8. ❌ Relative imports instead of barrel files

## Quick Reference

**Before every commit:**

```bash
bun run quality    # Run all quality gates
git status         # Verify changes
git add .          # Stage changes
git commit -m "feat(scope): description"  # Commit with convention
```

**Starting new feature:**

```bash
git checkout dev
git pull origin dev
git checkout -b feature/feature-name
# ... make changes ...
bun run quality
git commit -m "feat: add feature"
```

**File operations workflow:**

```bash
# Create new files
# ...
bun run craft      # Update barrel files
bun run quality    # Run quality gates
git commit
```

## Remember

- **Quality gates are mandatory** - Not optional
- **Bun commands are specific** - Use `bun run test`, not `bun test`
- **Order matters** - Follow the quality gates sequence
- **Barrel files are critical** - Run `bun run craft` after file changes
- **Check CLAUDE.md** - For complete project rules and standards

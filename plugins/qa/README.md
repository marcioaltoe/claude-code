# Testing & Quality Tools

> Comprehensive testing, code quality, and quality gates workflow for Bun applications with native Bun test, Playwright, Biome, and barrel-craft.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.0+-black?logo=bun)](https://bun.sh)

## Overview

This plugin provides a complete code quality and testing solution for Bun-based applications. It includes skills for testing, code quality, barrel file generation, commands for common tasks, and templates for configuration.

## Features

- ✅ **Quality Gates Workflow**: Automated quality checks (craft → format → lint → type-check → test)
- 🧪 **Bun Native Testing**: Full support for Bun's built-in test runner
- 🎭 **E2E Testing**: Playwright integration for browser automation
- 🛢️ **Barrel Files**: Automated barrel file generation with barrel-craft
- 🎨 **Code Quality**: Biome + Prettier for linting and formatting
- 📝 **TypeScript**: Strict type checking and validation
- 🪝 **Pre-commit Hooks**: Husky + lint-staged for automated checks
- 🔄 **CI/CD Ready**: Complete GitHub Actions workflows

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
- **Test Runner**: Bun's native `bun:test` - Built-in testing framework
- **E2E Testing**: [Playwright](https://playwright.dev) - Browser automation
- **Code Quality**: [Biome](https://biomejs.dev) - Fast linting and formatting
- **Formatting**: [Prettier](https://prettier.io) - Markdown and package.json formatting
- **Barrel Files**: [barrel-craft](https://www.npmjs.com/package/barrel-craft) - Automated barrel generation
- **Pre-commit**: [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged)

## Skills

### 🧪 test-engineer

Expert testing and quality engineer for Bun applications with Bun test, Playwright, and Biome.

**Use when:**

- Writing unit tests for functions or classes
- Creating E2E tests with Playwright
- Testing API routes (Hono)
- Setting up testing infrastructure
- Debugging test failures
- Designing test strategies

**Examples:**

```
"write tests for this function"
"create E2E tests with Playwright"
"help me test this API route"
"why is this test failing?"
```

### 🔧 quality-engineer

Expert in code quality, formatting, linting, and quality gates workflow with Biome, Prettier, and TypeScript.

**Use when:**

- Setting up code quality tools
- Fixing linting or formatting errors
- Configuring Biome, Prettier, or TypeScript
- Setting up pre-commit hooks (Husky + lint-staged)
- Running quality checks or quality gates
- Before committing code

**Examples:**

```
"setup code quality"
"fix lint errors"
"configure Biome"
"setup Husky"
"run quality checks"
```

### 🛢️ barrel-craft

Expert in barrel file generation and import organization using barrel-craft.

**Use when:**

- Creating or updating index.ts/tsx files
- Organizing imports in TypeScript/React projects
- Simplifying import paths
- Setting up barrel file generation
- Cleaning old barrel files

**Examples:**

```
"create barrel files"
"generate index exports"
"organize imports"
"I created a new index.ts"
"clean up barrel files"
```

## Quality Gates Workflow

The quality gates sequence **MUST** be executed in this order:

```bash
1. bun run craft        # Generate barrel files
2. bun run format       # Format code (Biome + Prettier)
3. bun run lint         # Lint code (Biome)
4. bun run type-check   # Type check (TypeScript)
5. bun test             # Run tests (Bun test)
```

### Quick Start

```bash
# Run full quality gates
bun run quality

# Or run individually
bun run craft && bun run format && bun run lint && bun run type-check && bun test
```

This sequence MUST be executed:

- At the end of any development workflow
- Before any git commit (via pre-commit hooks)
- In CI/CD pipelines
- After creating or modifying TypeScript files

## Commands

### `/quality-gates`

Run the complete quality gates workflow (craft → format → lint → type-check → test).

**What it runs:**

1. Generate barrel files (`bun run craft`)
2. Format code (`bun run format`)
3. Lint code (`bun run lint`)
4. Type check (`bun run type-check`)
5. Run tests (`bun test`)

**When to use:**

- Before committing code
- After implementing features
- Before creating pull requests
- After merge conflicts

**Quick usage:**

```bash
bun run quality
```

### `/setup-quality-gates`

Setup complete quality gates workflow with all tools and configurations.

**What it installs:**

- Biome (linting + formatting)
- Prettier (Markdown + package.json)
- barrel-craft (barrel files)
- Husky + lint-staged (pre-commit hooks)
- Commitlint (commit message validation)

**What it creates:**

- Configuration files (biome.json, .prettierrc, etc.)
- Pre-commit hooks
- Package.json scripts
- CI/CD workflows (optional)

### `/create-test`

Generate a test file using Bun's built-in test runner.

**What it does:**

- Creates test file with proper structure
- Includes Bun test imports (`bun:test`)
- Provides examples for unit and API tests
- Follows best practices and patterns

## Templates

### Configuration Files

- `biome.json` - Complete Biome configuration
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Prettier ignore patterns
- `.lintstagedrc.json` - Lint-staged configuration
- `commitlint.config.js` - Commitlint configuration
- `bunfig.toml` - Bun test configuration
- `barrel-craft.json` - Barrel file generation config

### Hooks

**Claude Code Hooks** (in `hooks/` directory):

- `typescript-check.sh` - Real-time TypeScript/Biome validation on file Write/Edit
- `hooks.json` - Hook configuration for Claude Code
- `README.md` - Complete hook documentation

**Git Hooks** (Husky templates in `templates/.husky/`):

- `pre-commit` - Pre-commit validation with branch protection
- `commit-msg` - Commit message validation (Conventional Commits)

## Installation

### Quick Setup

```bash
# Install all dependencies
bun add -D @biomejs/biome prettier prettier-package-json barrel-craft
bun add -D husky lint-staged
bun add -D @commitlint/cli @commitlint/config-conventional

# Copy configurations
cp plugins/qa/templates/biome.json ./biome.json
cp plugins/qa/templates/.prettierrc ./.prettierrc
cp plugins/qa/templates/.prettierignore ./.prettierignore
cp plugins/qa/templates/.lintstagedrc.json ./.lintstagedrc.json
cp plugins/qa/templates/commitlint.config.js ./commitlint.config.js
cp plugins/qa/templates/bunfig.toml ./bunfig.toml

# Initialize barrel-craft
barrel-craft init

# Setup Husky
bunx husky init
cp plugins/qa/templates/.husky/pre-commit ./.husky/pre-commit
cp plugins/qa/templates/.husky/commit-msg ./.husky/commit-msg
chmod +x .husky/pre-commit .husky/commit-msg

# Optional: Enable Claude Code TypeScript validation hook
# (Automatically active when plugin is loaded - no installation needed)
```

### Package.json Scripts

Add these scripts to your `package.json`:

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
    "test:watch": "bun test --watch --timeout 10000",
    "test:coverage": "bun test --coverage --timeout 10000",
    "quality": "bun run craft && bun run format && bun run lint && bun run type-check && bun test",
    "prepare": "husky"
  }
}
```

## Usage Examples

### Testing Patterns

#### Unit Testing

```typescript
import { describe, expect, it } from "bun:test";

describe("calculateTotal", () => {
  it("sums array of numbers correctly", () => {
    const result = calculateTotal([10, 20, 30]);
    expect(result).toBe(60);
  });

  it("returns 0 for empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("throws error for non-numeric values", () => {
    expect(() => calculateTotal([1, "invalid", 3])).toThrow();
  });
});
```

#### API Route Testing (Hono)

```typescript
import { describe, expect, it, jest } from "bun:test";
import { Hono } from "hono";

describe("Contract: POST /users", () => {
  it("creates user and returns 201", async () => {
    const app = new Hono();
    const createMock = jest.fn(async () => ({ id: "123", name: "John" }));

    app.post("/users", async (c) => {
      const body = await c.req.json();
      const user = await createMock(body);
      return c.json(user, 201);
    });

    const response = await app.request("/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "John" }),
    });

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.id).toBe("123");
  });
});
```

#### E2E Testing (Playwright)

```typescript
import { test, expect } from "@playwright/test";

test("user can login", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.fill('input[name="email"]', "user@example.com");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("http://localhost:3000/dashboard");
});
```

### Barrel File Configuration

Example `barrel-craft.json` for Clean Architecture:

```json
{
  "headerComment": "// Auto-generated by barrel-craft\n\n",
  "targets": ["src"],
  "forceGenerate": [
    "src/domain",
    "src/application",
    "src/infrastructure",
    "src/presentation"
  ],
  "exclude": ["**/*.test.*", "**/*.spec.*", "**/*.d.ts"],
  "extensions": ["ts", "tsx"],
  "sortExports": true,
  "subdirectories": true
}
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/quality.yml`:

```yaml
name: Quality Checks

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Run quality gates
        run: bun run quality

      - name: Upload coverage
        if: always()
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Pre-commit Hooks

Pre-commit hooks run automatically when you commit:

```bash
git add .
git commit -m "feat: add new feature"

# Hooks run automatically:
# 1. lint-staged checks staged files
# 2. commitlint validates commit message
```

### What Gets Checked

**Pre-commit (via lint-staged):**

- ✅ package.json formatting
- ✅ TypeScript/JavaScript linting and formatting
- ✅ Markdown formatting
- ✅ Import organization
- ✅ File naming conventions

**Quality Gates (via `bun run quality`):**

- ✅ Barrel file generation
- ✅ Code formatting (Biome + Prettier)
- ✅ Code linting (Biome)
- ✅ Type checking (TypeScript)
- ✅ Unit and integration tests

## Best Practices

### Code Quality

1. **Run quality gates before pushing**: Always run `bun run quality`
2. **Fix errors immediately**: Don't let quality issues accumulate
3. **Use pre-commit hooks**: Automate quality checks
4. **Keep configurations in sync**: Ensure team uses same configs

### Testing

1. **Test Behavior, Not Implementation**: Focus on what the code does
2. **Write Descriptive Test Names**: Test names should explain the scenario
3. **Follow AAA Pattern**: Arrange → Act → Assert
4. **Keep Tests Fast**: Unit tests should run in milliseconds
5. **Mock External Dependencies**: Isolate code under test

### Barrel Files

1. **Run barrel-craft first** in quality gates workflow
2. **Use configuration file** instead of CLI flags
3. **Use forceGenerate** for pages, routes, and services
4. **Commit barrel files** to version control

## Documentation Resources

All skills automatically use MCP servers for up-to-date documentation:

- **Context7 MCP**: Library documentation, API reference, version-specific patterns
- **Perplexity MCP**: Best practices research, troubleshooting, strategies

## Troubleshooting

### Hooks Not Running

```bash
rm -rf .husky
bunx husky init
chmod +x .husky/pre-commit .husky/commit-msg
```

### Biome Errors

```bash
biome check --verbose .
biome format --write .
```

### TypeScript Errors

```bash
tsc --showConfig
tsc --noEmit --listFiles
```

### Barrel-Craft Not Generating

```bash
barrel-craft -V
barrel-craft clean --dry-run
barrel-craft clean
barrel-craft
```

## Contributing

Contributions are welcome! Please ensure:

- All code follows project standards (Biome)
- Tests are included for new features
- Documentation is updated
- Commit messages follow conventional commits

## License

MIT © [Marcio Altoé](mailto:marcio.altoe@gmail.com)

---

**Made with ❤️ for the Bun community**

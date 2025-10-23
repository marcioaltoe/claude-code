---
description: Configure ESLint for Next.js with recommended rules
---

# Setup ESLint

Configure ESLint with Next.js, TypeScript, and recommended rules for code quality.

## Instructions

1. Check if ESLint is already configured (Next.js includes it by default)
2. Enhance ESLint configuration in `.eslintrc.json`:
   - Extend recommended rulesets
   - Add TypeScript rules
   - Configure import ordering
   - Add accessibility rules
   - Customize rule severity
3. Install additional ESLint plugins:
   ```bash
   pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-jsx-a11y
   ```
4. Create `.eslintignore` for files to skip
5. Add lint scripts to `package.json`:
   - `"lint": "next lint"`
   - `"lint:fix": "next lint --fix"`
6. Configure pre-commit hooks with Husky (optional)
7. Provide examples of fixing common linting errors

## Enhanced ESLint Config

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "react/jsx-curly-brace-presence": ["error", { "props": "never", "children": "never" }]
  }
}
```

Ensure consistent code quality with proper linting.

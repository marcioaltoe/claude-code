---
description: Set up Vitest for unit and integration testing
---

# Setup Vitest

Configure Vitest for testing Next.js components and utilities.

## Instructions

1. Install Vitest and related packages:
   ```bash
   pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom happy-dom
   ```
2. Create `vitest.config.ts` with Next.js-compatible settings:
   - React plugin configuration
   - Path aliases (@/ imports)
   - DOM environment setup
   - Coverage configuration
3. Add test scripts to `package.json`:
   - `"test": "vitest"`
   - `"test:ui": "vitest --ui"`
   - `"test:coverage": "vitest --coverage"`
4. Create test setup file `vitest.setup.ts`:
   - Import testing-library/jest-dom
   - Global test configuration
   - Mock setup
5. Create example test file to verify setup
6. Configure TypeScript for test files

## Vitest Config Example

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Provide complete testing setup with examples.

---
description: Set up Playwright for E2E testing
---

# Setup Playwright

Configure Playwright for end-to-end testing of your Next.js application.

## Instructions

1. Install Playwright:
   ```bash
   pnpm create playwright
   ```
2. Configure `playwright.config.ts`:
   - Set baseURL to local development server
   - Configure browsers (chromium, firefox, webkit)
   - Set up test directory
   - Configure screenshots and videos
   - Add mobile viewports if needed
3. Create E2E test directory structure:
   - `e2e/` or `tests/e2e/`
   - Organize by feature or page
4. Add test scripts to `package.json`:
   - `"test:e2e": "playwright test"`
   - `"test:e2e:ui": "playwright test --ui"`
   - `"test:e2e:debug": "playwright test --debug"`
5. Create example E2E test
6. Set up CI/CD integration

## Playwright Config Example

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Example E2E Test

```typescript
import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Home/)
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()
})

test('user can sign in', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

Provide complete E2E testing setup.

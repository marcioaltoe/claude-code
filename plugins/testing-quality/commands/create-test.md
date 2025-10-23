---
description: Create a test file for a function, class, or API route
---

# Create Test

Generate a test file using Bun's built-in test runner for functions, classes, or API routes.

## Instructions

1. Ask what to test:
   - Utility function or class
   - API route (Hono)
   - Domain logic
   - Integration test
2. Create test file following naming convention:
   - `*.test.ts` or `*.test.tsx`
   - Co-located with source file or in `tests/` directory
3. Generate test with:
   - Proper imports from `bun:test`
   - describe block for test suite
   - Individual test cases with `it()`
   - Setup and teardown if needed (beforeEach, afterEach)
   - Mock implementations using `jest.fn()` from Bun
   - Clear assertions with `expect()`
4. For utilities and classes, test:
   - Input/output correctness
   - Edge cases
   - Error handling
   - Type safety
5. For API routes (Hono), test:
   - Request/response handling
   - Authentication/authorization
   - Status codes
   - Error responses

## Unit Test Example

```typescript
import { describe, expect, it } from 'bun:test'
import { calculateDiscount } from './discount'

describe('calculateDiscount', () => {
  it('calculates 10% discount correctly', () => {
    const result = calculateDiscount(100, 10)
    expect(result).toBe(90)
  })

  it('returns original price when discount is 0', () => {
    const result = calculateDiscount(100, 0)
    expect(result).toBe(100)
  })

  it('throws error for invalid discount percentage', () => {
    expect(() => calculateDiscount(100, 150)).toThrow('Invalid discount')
  })
})
```

## API Route Test Example (Hono)

```typescript
import { describe, expect, it, jest } from 'bun:test'
import { Hono } from 'hono'

describe('Contract: POST /users', () => {
  it('creates a user and returns 201', async () => {
    const app = new Hono()
    const createMock = jest.fn(async () => ({ id: '123', name: 'John' }))

    app.post('/users', async (c) => {
      const body = await c.req.json()
      const user = await createMock(body)
      return c.json(user, 201)
    })

    const response = await app.request('/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'John' }),
    })

    expect(createMock).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(201)
    const body = await response.json()
    expect(body.id).toBe('123')
  })

  it('returns 401 when unauthorized', async () => {
    const app = new Hono()

    app.post('/users', (c) => c.json({ error: 'Unauthorized' }, 401))

    const response = await app.request('/users', {
      method: 'POST',
    })

    expect(response.status).toBe(401)
  })
})
```

Ensure comprehensive test coverage with meaningful assertions and proper error handling.

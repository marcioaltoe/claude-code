---
description: Create a test file for a component or function
---

# Create Test

Generate a test file with Vitest and Testing Library for components or utilities.

## Instructions

1. Ask what to test:
   - React component
   - Utility function
   - API route
   - Server Action
2. Create test file following naming convention:
   - `*.test.ts` or `*.test.tsx`
   - Co-located with source file or in `__tests__` directory
3. Generate test with:
   - Proper imports (vitest, testing-library)
   - describe block for test suite
   - Individual test cases
   - Setup and teardown if needed
   - Mock implementations
   - Assertions
4. For components, test:
   - Rendering
   - User interactions
   - Props handling
   - Conditional rendering
   - Accessibility
5. For utilities, test:
   - Input/output correctness
   - Edge cases
   - Error handling

## Component Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

Ensure comprehensive test coverage with meaningful assertions.

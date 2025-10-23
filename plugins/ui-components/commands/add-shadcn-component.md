---
description: Add a shadcn/ui component to the project
---

# Add shadcn/ui Component

Install and configure a shadcn/ui component in your Next.js project.

## Instructions

1. Ask which shadcn/ui component to add (button, card, dialog, form, etc.)
2. Check if shadcn/ui is initialized (look for `components.json`)
3. If not initialized, run:
   ```bash
   npx shadcn@latest init
   ```
4. Add the requested component:
   ```bash
   npx shadcn@latest add [component-name]
   ```
5. Show the component location (`components/ui/[component].tsx`)
6. Provide usage example with TypeScript
7. Suggest related components that work well together
8. Check if Tailwind is properly configured

## Popular Components

- button - Button component with variants
- card - Card container with header/footer
- dialog - Modal dialog/popup
- form - Form with validation (uses react-hook-form)
- input - Input field with variants
- select - Select dropdown
- table - Data table component
- toast - Toast notifications
- dropdown-menu - Dropdown menu
- tabs - Tab navigation

## Usage Example

After adding a button component:
```typescript
import { Button } from '@/components/ui/button'

export function MyComponent() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  )
}
```

Provide component-specific examples and customization tips.

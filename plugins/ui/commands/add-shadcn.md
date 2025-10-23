---
description: Add a shadcn/ui component to the project
---

# Add shadcn/ui Component

Install and configure a shadcn/ui component in your React + Vite project.

## Instructions

1. Ask which shadcn/ui component to add (button, card, dialog, form, etc.)
2. Check if shadcn/ui is initialized (look for `components.json`)
3. If not initialized, run:
   ```bash
   bunx shadcn@latest init
   ```
4. Add the requested component:
   ```bash
   bunx shadcn@latest add [component-name]
   ```
5. Show the component location (`components/ui/[component].tsx`)
6. Provide usage example with TypeScript
7. Suggest related components that work well together
8. Check if Tailwind CSS is properly configured
9. Verify that required dependencies are installed (check package.json)

## Popular Components

- button - Button component with variants
- card - Card container with header/footer
- dialog - Modal dialog/popup
- form - Form components (use with TanStack Form)
- input - Input field with variants
- select - Select dropdown
- table - Data table component
- toast - Toast notifications
- dropdown-menu - Dropdown menu
- tabs - Tab navigation

## Usage Example

After adding a button component:

```typescript
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  );
}
```

## Framework-Specific Notes

- **React + Vite**: All components are client-side by default. No need for `'use client'` directive.
- **TanStack Router**: Components can be used in route components, loaders, and layout files seamlessly.
- **Component State**: Use React hooks (useState, useEffect, etc.) freely in any component without special directives.

Provide component-specific examples and customization tips.

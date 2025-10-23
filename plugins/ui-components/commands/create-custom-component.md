---
description: Create a custom React component with Tailwind styling
---

# Create Custom Component

Generate a custom React component with Tailwind CSS and TypeScript.

## Instructions

1. Ask for component details:
   - Component name
   - Component type (functional, with state, etc.)
   - Props needed
   - Styling requirements
2. Create component file in appropriate location:
   - `components/` for shared components
   - Feature-specific directories for feature components
3. Generate component with:
   - TypeScript interface for props
   - Proper React patterns (Server Component default, 'use client' if needed)
   - Tailwind CSS classes
   - Accessibility attributes (ARIA labels, roles, etc.)
   - Responsive design
4. Use cn() utility for conditional classes
5. Export component and types
6. Provide usage example

## Component Template

```typescript
import { cn } from "@/lib/utils";

interface MyComponentProps {
  title: string;
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

export function MyComponent({
  title,
  variant = "default",
  className,
}: MyComponentProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-4",
        {
          "bg-gray-100": variant === "default",
          "bg-blue-500 text-white": variant === "primary",
          "bg-gray-800 text-white": variant === "secondary",
        },
        className
      )}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}
```

Ensure proper typing, styling, and accessibility.

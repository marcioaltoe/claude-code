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
   - `src/components/` for shared components
   - `src/features/` for feature-specific components
   - `src/routes/` for route-specific components (TanStack Router)
3. Generate component with:
   - TypeScript interface for props
   - Proper React patterns (hooks, composition, etc.)
   - Tailwind CSS classes
   - Accessibility attributes (ARIA labels, roles, etc.)
   - Responsive design
4. Use cn() utility for conditional classes
5. Export component and types
6. Provide usage example

## Component Template

### Basic Component

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

### Interactive Component (with State)

```typescript
import { useState } from "react";
import { cn } from "@/lib/utils";

interface InteractiveComponentProps {
  initialCount?: number;
  className?: string;
}

export function InteractiveComponent({
  initialCount = 0,
  className,
}: InteractiveComponentProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={() => setCount(count - 1)}
        className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 transition-colors"
        aria-label="Decrease count"
      >
        -
      </button>
      <span className="text-lg font-semibold" aria-live="polite">
        {count}
      </span>
      <button
        onClick={() => setCount(count + 1)}
        className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 transition-colors"
        aria-label="Increase count"
      >
        +
      </button>
    </div>
  );
}
```

## Framework-Specific Guidelines

- **React + Vite**: All components are client-side by default. Use React hooks (useState, useEffect, etc.) freely without any special directives.
- **TanStack Router**: Components integrate seamlessly with route loaders, route context, and navigation hooks.
- **Component Organization**: Follow Clean Architecture - separate UI components (`components/`), feature logic (`features/`), and routes (`routes/`).

Ensure proper typing, styling, and accessibility.

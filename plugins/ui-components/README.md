# UI Components Tools

> Expert UI/UX design toolkit for React applications with shadcn/ui, Tailwind CSS, and modern frontend patterns.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19+-blue?logo=react)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4+-blue?logo=tailwindcss)](https://tailwindcss.com)

## Overview

This plugin provides comprehensive UI/UX design and frontend architecture assistance for React-based applications. It includes specialized skills for component design and application architecture, commands for common tasks, and best practices for building scalable, accessible, responsive user interfaces with shadcn/ui, Tailwind CSS, and the TanStack ecosystem.

## Features

- 🏗️ **Frontend Architect**: Expert in Clean Architecture, TanStack ecosystem, and scalable app design
- 🎨 **UI Designer**: Specialized skill for React component design and styling
- 🧩 **shadcn/ui Integration**: Seamless component installation and customization
- 🎯 **Tailwind CSS v4**: Advanced patterns and design systems
- ♿ **Accessibility First**: WCAG 2.1 AA compliant components
- 📱 **Responsive Design**: Mobile-first, fluid layouts
- 🌙 **Dark Mode**: Built-in theme support
- ⚡ **Performance**: Optimized rendering and code splitting strategies
- 🎭 **Animation**: Smooth transitions with Tailwind and Framer Motion
- 🔄 **State Management**: Strategic approach with TanStack Query, Zustand, and TanStack Store
- 🛣️ **Type-Safe Routing**: File-based routing with TanStack Router

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) (NOT npm or pnpm)
- **Framework**: [React](https://react.dev) 19+ with TypeScript
- **Build Tool**: [Vite](https://vitejs.dev) 6+ with HMR
- **Routing**: [TanStack Router](https://tanstack.com/router) (file-based, type-safe)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) v5
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs) + [TanStack Store](https://tanstack.com/store)
- **Forms**: [TanStack Form](https://tanstack.com/form) + Zod
- **Tables**: [TanStack Table](https://tanstack.com/table)
- **Icons**: [Lucide React](https://lucide.dev)
- **Animation**: Tailwind transitions, [Framer Motion](https://www.framer.com/motion/)
- **Testing**: Bun built-in test + React Testing Library + Happy DOM

## Skills

### 🏗️ frontend-architect

Expert frontend architect specializing in React 19, Clean Architecture, TanStack ecosystem, and scalable application design.

**Use when:**

- Setting up project structure or folder organization
- Implementing Clean Architecture or layered architecture
- Configuring TanStack Router, Query, Form, or Table
- Designing state management strategies
- Feature module organization
- Dependency injection or ports/adapters patterns
- Code splitting and lazy loading
- Application architecture decisions
- Routing configuration and type safety
- Performance optimization strategies
- Testing strategies for different layers

**Examples:**

```
"setup React project structure"
"organize feature modules with Clean Architecture"
"implement Clean Architecture layers"
"setup TanStack Router with type safety"
"design state management strategy"
"structure application with domain/application/infrastructure"
```

**Core expertise:**

- Clean Architecture implementation
- React 19 patterns and best practices
- TanStack ecosystem (Router, Query, Form, Table, Store)
- State management strategy (Zustand, TanStack Query, TanStack Store)
- Code organization and feature modules
- Dependency inversion and ports/interfaces
- Type-safe routing and navigation
- Performance patterns and optimizations

### 🎨 ui-designer

Expert UI/UX designer for React applications with deep knowledge of shadcn/ui, Tailwind CSS, and modern design patterns.

**Use when:**

- Creating or designing UI components
- Implementing design mockups
- Building responsive layouts
- Improving accessibility
- Setting up shadcn/ui components
- Creating forms with styling
- Implementing dark mode
- Adding animations or transitions
- Establishing design system patterns

**Examples:**

```
"create a custom card component"
"build a responsive navigation"
"setup shadcn/ui button"
"implement dark mode"
"make this accessible"
"design a form layout"
```

**Core expertise:**

- shadcn/ui component library
- Tailwind CSS patterns and design systems
- React best practices (Server/Client Components)
- Responsive, mobile-first design
- WCAG 2.1 AA accessibility
- Animation and interactions
- Performance optimization

## Commands

### `/add-shadcn-component`

Add a shadcn/ui component to your React project.

**What it does:**

- Checks if shadcn/ui is initialized
- Installs the requested component
- Provides usage examples
- Suggests related components
- Verifies dependencies and Tailwind configuration

**Popular components:**

- `button` - Button with variants
- `card` - Card container with header/footer
- `dialog` - Modal dialog/popup
- `form` - Form with validation (TanStack Form + Zod)
- `input` - Input field with variants
- `select` - Select dropdown
- `table` - Data table component
- `toast` - Toast notifications
- `dropdown-menu` - Dropdown menu
- `tabs` - Tab navigation

**Quick usage:**

```bash
bunx shadcn@latest add button card form
```

### `/create-custom-component`

Create a custom React component with Tailwind CSS styling.

**What it creates:**

- TypeScript interface for props
- Component with Tailwind CSS
- Responsive design patterns
- Accessibility attributes (ARIA)
- Usage examples
- Variant support with CVA

**Features:**

- Server Component (default) or Client Component
- `cn()` utility for conditional classes
- Mobile-first responsive design
- Dark mode support
- Type-safe props

### `/create-form`

Generate a type-safe form with TanStack Form and Zod validation, optionally using shadcn/ui components for styling.

**What it creates:**

- Zod validation schema
- TanStack Form integration
- shadcn/ui Form components
- Error handling and display
- Loading states
- Accessibility features

**Supports:**

- Standard API calls with fetch or TanStack Query mutations
- Real-time validation
- Async validation with debounce
- Custom error messages
- Accessible form fields

## Installation

### Prerequisites

Ensure you have a React project with Tailwind CSS configured.

### shadcn/ui Setup

```bash
# Initialize shadcn/ui (if not already initialized)
bunx shadcn@latest init

# Add components as needed
bunx shadcn@latest add button card form input
```

### Required Dependencies

```bash
# Core dependencies
bun add tailwindcss class-variance-authority clsx tailwind-merge

# TanStack ecosystem
bun add @tanstack/react-router @tanstack/react-query @tanstack/react-form @tanstack/react-table

# State management
bun add zustand @tanstack/store

# Form dependencies
bun add @tanstack/react-form zod

# Animation (optional)
bun add framer-motion

# Icons
bun add lucide-react

# Testing (Bun has built-in test runner)
bun add -D @testing-library/react @testing-library/jest-dom happy-dom
```

## Usage Examples

### Basic Component with shadcn/ui

```typescript
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProductCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Premium Plan</CardTitle>
        <CardDescription>Perfect for growing teams</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">$29/mo</div>
        <Button className="mt-4 w-full">Get Started</Button>
      </CardContent>
    </Card>
  );
}
```

### Custom Component with Variants

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        destructive: "bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, className, children }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}
```

### Responsive Layout Pattern

```typescript
export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
```

### Form with Validation

```typescript
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      // Handle form submission
      console.log("Form submitted:", value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="email"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="you@example.com"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      />

      <form.Field
        name="password"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Password</Label>
            <Input
              id={field.name}
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit} className="w-full">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        )}
      />
    </form>
  );
}
```

## Design Principles

### 1. Mobile-First Responsive Design

Always start with mobile layouts and progressively enhance for larger screens:

```typescript
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">
  {/* Content adapts from vertical to horizontal */}
</div>
```

### 2. Accessibility First (WCAG 2.1 AA)

- Use semantic HTML (`<nav>`, `<main>`, `<article>`)
- Provide ARIA attributes when needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast (4.5:1)
- Include focus states for interactive elements

```typescript
<button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  className="focus-visible:ring-2 focus-visible:ring-offset-2"
>
  Close
</button>
```

### 3. Consistent Design System

Use Tailwind design tokens consistently:

```typescript
// Spacing scale (4px base unit)
className = "gap-4 p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8";

// Typography hierarchy
className = "text-sm text-muted-foreground"; // Small text
className = "text-base"; // Body text
className = "text-lg font-semibold"; // Subheading
className = "text-2xl font-bold"; // Heading
```

### 4. Dark Mode Support

Always include dark mode variants:

```typescript
<div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
  <p className="text-slate-600 dark:text-slate-400">
    This text adapts to dark mode
  </p>
</div>
```

### 5. Performance Optimization

- Use `cn()` utility for conditional classes
- Avoid inline styles
- Optimize images with lazy loading
- Code split heavy components

```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-styles", isActive && "active-styles", className)} />;
```

## Framework-Specific Guidelines

### React + Vite

- All components are client-side by default
- No need for `'use client'` directive (this is specific to React Server Components in Next.js/TanStack Start)
- Use standard `fetch()` or TanStack Query for data fetching
- Optimize images with native lazy loading: `<img loading="lazy" />`
- Use React.lazy() for code splitting components

### TanStack Router

- Use file-based routing for automatic route generation
- Leverage route loaders for data fetching with type safety
- Use route context for sharing data across route tree
- Navigate programmatically with `useNavigate()` hook
- Access route params and search params with full TypeScript support

## Best Practices

### Component Architecture

1. **Single Responsibility**: Each component does one thing well
2. **Composition**: Build complex UIs from simple components
3. **Reusability**: Extract common patterns
4. **Type Safety**: Always use TypeScript interfaces

### Styling Strategy

1. **Utility-First**: Use Tailwind utilities, not custom CSS
2. **Consistency**: Follow design system tokens
3. **Responsive**: Mobile-first breakpoints
4. **Maintainability**: Use CVA for variants

### Accessibility Checklist

- [ ] Semantic HTML structure
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation support
- [ ] Focus states visible
- [ ] Color contrast >= 4.5:1
- [ ] Screen reader friendly
- [ ] Skip navigation links
- [ ] Form validation messages

## Documentation Resources

The ui-designer skill automatically uses MCP servers for up-to-date documentation:

- **Context7 MCP**: Library documentation, API reference, import statements

  - shadcn/ui components
  - Tailwind CSS utilities
  - React APIs
  - Accessibility guidelines

- **Perplexity MCP**: Design research, UI/UX best practices, emerging patterns
  - Component composition strategies
  - Performance optimization
  - Design trends

## Troubleshooting

### shadcn/ui Not Initialized

```bash
bunx shadcn@latest init
```

### Tailwind Not Working

Check `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ...
};
```

### cn() Utility Missing

Create `lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Dark Mode Not Working

Ensure Tailwind is configured for dark mode:

```javascript
module.exports = {
  darkMode: "class", // or 'media'
  // ...
};
```

## Contributing

Contributions are welcome! Please ensure:

- Components follow accessibility guidelines
- Dark mode support is included
- Mobile-first responsive design
- TypeScript types are complete
- Examples are provided

## License

MIT © [Marcio Altoe](mailto:marcio.altoe@gmail.com)

---

**Made with ❤️ for the React community**

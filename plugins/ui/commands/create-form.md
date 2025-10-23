---
description: Create a type-safe form with TanStack Form and Zod validation
---

# Create Form

Generate a type-safe form using TanStack Form (@tanstack/react-form) with Zod validation and shadcn/ui components.

## Instructions

1. Install TanStack Form if not already installed:
   ```bash
   bun add @tanstack/react-form zod
   ```
2. Optionally, install shadcn/ui components for UI:
   ```bash
   bunx shadcn@latest add input button label
   ```
3. Ask for form fields and validation rules
4. Create Zod schema for form validation
5. Generate form component with:
   - TanStack Form `useForm` hook
   - Zod validators (`onChange`, `onSubmit`)
   - `form.Field` components for each field
   - Proper TypeScript types
   - Error handling and display
   - Submit handler with loading states
6. Add accessibility attributes (labels, ARIA)
7. Include validation feedback (errors, loading states)

## Form Example

### Basic TanStack Form with Zod Validation

```typescript
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
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
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        )}
      />
    </form>
  );
}
```

### Advanced: Field-Level and Form-Level Validation

```typescript
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
});

export function RegisterForm() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      // Schema validation on every change
      onChange: userSchema,
      // Custom validation on submit
      onSubmit: ({ value }) => {
        if (value.password !== value.confirmPassword) {
          return {
            form: "Passwords do not match",
            fields: {
              confirmPassword: "Must match password",
            },
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {(["username", "email", "password", "confirmPassword"] as const).map(
        (fieldName) => (
          <form.Field key={fieldName} name={fieldName}>
            {(field) => (
              <div>
                <label htmlFor={field.name}>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                </label>
                <input
                  id={field.name}
                  type={fieldName.includes("password") ? "password" : "text"}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.map((error, i) => (
                  <p key={i} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        )
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        )}
      />
    </form>
  );
}
```

## Framework-Specific Patterns

### Async Validation with Debounce

```typescript
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters");

export function UsernameForm() {
  const form = useForm({
    defaultValues: {
      username: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Valid username:", value.username);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="username"
        validators={{
          onChange: ({ value }) => {
            const result = usernameSchema.safeParse(value);
            return result.success ? undefined : result.error.errors[0].message;
          },
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            // Simulate API call to check username availability
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const takenUsernames = ["admin", "test", "demo"];
            return takenUsernames.includes(value.toLowerCase())
              ? "Username is already taken"
              : undefined;
          },
        }}
        children={(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Enter username"
            />
            {field.state.meta.isValidating && (
              <span>Checking availability...</span>
            )}
            {field.state.meta.errors.map((error, i) => (
              <p key={i} className="text-red-500">
                {error}
              </p>
            ))}
          </div>
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### With shadcn/ui Components

```typescript
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(200, "Bio must be less than 200 characters"),
});

export function ProfileForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      bio: "",
    },
    validators: {
      onChange: profileSchema,
    },
    onSubmit: async ({ value }) => {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

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
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit} className="w-full">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            )}
          />
        </form>
      </CardContent>
    </Card>
  );
}
```

## Key Features

- **Type-Safe**: Full TypeScript support with inferred types from Zod schemas
- **Validation**: Synchronous and asynchronous validation with debounce
- **Field-Level Validation**: `onChange`, `onBlur`, `onMount` validators per field
- **Form-Level Validation**: Custom cross-field validation on submit
- **State Management**: Built-in form state (canSubmit, isSubmitting, errors)
- **Performance**: Efficient re-renders with granular subscriptions
- **Framework Agnostic**: Works with React, Solid, Vue, and more

Ensure complete type safety and proper validation with TanStack Form.

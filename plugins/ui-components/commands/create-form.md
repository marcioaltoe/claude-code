---
description: Create a form with shadcn/ui Form component and validation
---

# Create Form

Generate a type-safe form using shadcn/ui Form components with react-hook-form and Zod validation.

## Instructions

1. Ensure shadcn/ui form component is installed:
   ```bash
   npx shadcn@latest add form
   ```
2. Ask for form fields and validation rules
3. Create Zod schema for form validation
4. Generate form component with:
   - react-hook-form integration
   - Zod resolver
   - shadcn/ui Form components
   - Proper TypeScript types
   - Error handling and display
   - Submit handler
5. If for Server Actions, integrate with 'use server'
6. Add loading states and error handling
7. Include accessibility attributes

## Form Example

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

Ensure complete type safety and proper validation.

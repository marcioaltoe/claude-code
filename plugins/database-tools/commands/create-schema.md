---
description: Create a new Drizzle schema file with table definitions
---

# Create Drizzle Schema

Generate a new Drizzle ORM schema file with proper TypeScript types and Postgres column definitions.

## Instructions

1. Ask the user for the table/entity name (e.g., "users", "products", "posts")
2. Create a schema file in the appropriate location (usually `src/db/schema/` or `lib/db/schema/`)
3. Generate the schema with:
   - Import necessary Drizzle types (pgTable, serial, text, timestamp, etc.)
   - Proper table definition with appropriate column types
   - Primary keys and indexes
   - Timestamps (createdAt, updatedAt) where appropriate
   - Foreign key relationships if needed
   - Unique constraints
   - Default values
4. Export the table and infer TypeScript types
5. Suggest running `drizzle-kit generate:pg` to create migrations

## Example Structure

```typescript
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

Ensure proper column types, constraints, and TypeScript type inference.

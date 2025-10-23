---
description: Generate a Drizzle migration from schema changes
---

# Generate Database Migration

Generate a new Drizzle migration file based on schema changes.

## Instructions

1. Check if drizzle-kit is configured (look for `drizzle.config.ts`)
2. If not configured, offer to create the config file with proper Postgres settings
3. Run the migration generation command:
   - `bunx drizzle-kit generate:pg` or `bun run db:generate`
4. Review the generated migration file in the migrations directory
5. Remind the user to:
   - Review the migration SQL before applying
   - Run `bun run db:push` or the migration apply command
   - Update the database

## Drizzle Config Example

```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config
```

## Safety Checks

- Warn if migration includes destructive operations (DROP, ALTER with data loss)
- Suggest backing up production databases before applying
- Check for proper environment variable configuration

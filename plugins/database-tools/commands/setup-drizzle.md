---
description: Set up Drizzle ORM with Postgres in a Next.js project
---

# Setup Drizzle ORM

Initialize Drizzle ORM with Postgres configuration for a Next.js 15 project.

## Instructions

1. Check if Drizzle is already installed
2. If not, install required packages:
   ```bash
   pnpm add drizzle-orm postgres
   pnpm add -D drizzle-kit @types/postgres
   ```
3. Create database configuration structure:
   - `src/db/index.ts` - Database client and connection
   - `src/db/schema/` - Directory for schema files
   - `drizzle.config.ts` - Drizzle Kit configuration
4. Create database client with connection pooling:
   ```typescript
   import { drizzle } from 'drizzle-orm/postgres-js'
   import postgres from 'postgres'

   const connectionString = process.env.DATABASE_URL!
   const client = postgres(connectionString)
   export const db = drizzle(client)
   ```
5. Create drizzle.config.ts for migrations
6. Add DATABASE_URL to `.env.local`
7. Create a sample schema file to verify setup
8. Add helpful scripts to package.json:
   - `"db:generate": "drizzle-kit generate:pg"`
   - `"db:push": "drizzle-kit push:pg"`
   - `"db:studio": "drizzle-kit studio"`

## Environment Variables

Remind user to add to `.env.local`:
```
DATABASE_URL="postgres://user:password@localhost:5432/dbname"
```

Provide setup verification steps and next actions.

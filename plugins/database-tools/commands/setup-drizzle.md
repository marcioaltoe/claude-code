---
description: Set up Drizzle ORM with PostgreSQL 18+ for Bun + Hono backend
---

# Setup Drizzle ORM

Initialize Drizzle ORM with PostgreSQL 18+ configuration for Bun + Hono backend.

## Prerequisites

- PostgreSQL 18+ (required for native `uuidv7()`)
- Bun runtime
- Hono framework

## Installation

### 1. Install packages

```bash
bun add drizzle-orm pg
bun add -D drizzle-kit @types/pg
```

### 2. Create `drizzle.config.ts`

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./database/migrations/drizzle",
  schema: "./src/infrasctructure/database/drizzle/schema/**/*.schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  casing: "snake_case",
  verbose: true,
  strict: true,
  schemaFilter: ["public"],
  migrations: {
    table: "drizzle_migrations",
    schema: "public",
  },
});
```

### 4. Create `src/infrasctructure/database/drizzle/db-connection.ts`

```typescript
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";

export interface PoolOptions extends PoolConfig {}

export function createPool(options: PoolOptions = {}): Pool {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }

  const poolConfig: PoolConfig = {
    connectionString: databaseUrl,
    max: options.max || 20,
    idleTimeoutMillis: options.idleTimeoutMillis || 30000,
    connectionTimeoutMillis: options.connectionTimeoutMillis || 2000,
    allowExitOnIdle: options.allowExitOnIdle ?? true,
    ...options,
  };

  return new Pool(poolConfig);
}

const pool = createPool();
export const db = drizzle(pool);
```

### 5. Add scripts to `package.json`

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:drop": "drizzle-kit drop"
  }
}
```

### 6. Add `.env`

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

## Verify setup

```bash
# Create extensions
psql $DATABASE_URL -f database/migrations/manual/0000_create_extensions.sql

# Generate and apply migration
bun run db:generate
bun run db:push

# Open Drizzle Studio
bun run db:studio
```

## Integration with Hono

```typescript
import { Hono } from "hono";
import { db } from "@/lib/db";
import { organizationsSchema } from "@/schema/core/organizations.schema";
import { eq, isNull } from "drizzle-orm";

const app = new Hono();

app.get("/organizations", async (c) => {
  try {
    const orgs = await db.query.organizationsSchema.findMany({
      where: isNull(organizationsSchema.deletedAt),
    });
    return c.json(orgs);
  } catch (error) {
    return c.json({ error: "Failed to fetch organizations" }, 500);
  }
});

export default app;
```

## Important notes

- PostgreSQL 18+ required for native `uuidv7()`
- Use `drizzle-orm/node-postgres` with `pg` package for connection pooling
- Use `drizzle-orm/pg-core` for schema imports (better test mocking)
- `casing: 'snake_case'` converts camelCase → snake_case in database
- Always include: `createdAt`, `updatedAt`, `deletedAt`
- Always include `organization_id` on multi-tenant tables
- Export types with `SelectSchema` and `InsertSchema` suffixes

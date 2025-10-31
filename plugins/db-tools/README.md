# Database Tools Plugin

Comprehensive Drizzle ORM and PostgreSQL database management tools for Bun + Hono backend applications. This plugin provides intelligent database design assistance, schema creation, migrations, and query building with type-safe operations.

## Overview

The Database Tools Plugin combines powerful slash commands with an expert database architect skill to streamline your database development workflow. Whether you're setting up Drizzle ORM, designing complex schemas, optimizing queries, or managing migrations, this plugin has you covered.

## Features

- 🏗️ **Expert Database Design**: Proactive schema design assistance with best practices
- 🔧 **Quick Setup Commands**: Fast Drizzle ORM initialization and configuration
- 📊 **Type-Safe Queries**: Generate fully typed Drizzle queries
- 🔄 **Migration Management**: Safe migration generation and management
- 🎯 **PostgreSQL Expertise**: Leverage Postgres-specific features and optimizations
- 📚 **Comprehensive Documentation**: Detailed explanations and examples

## Skill: Database Architect

The Database Architect skill provides proactive, expert-level assistance for all database-related tasks. It automatically engages when you mention database design, schema creation, or query optimization topics.

### When It Activates

The skill recognizes phrases like:

- "design a database schema for users"
- "create a Drizzle table for products"
- "help with database relationships"
- "optimize this query"
- "add indexes to improve performance"
- "design database for multi-tenant app"

### What It Provides

**Schema Design Excellence:**

- Normalized, efficient database schemas following best practices
- Proper relationship modeling (one-to-many, many-to-many, etc.)
- Type-safe Drizzle ORM definitions with TypeScript integration
- Strategic indexing for optimal query performance
- Foreign key relationships with appropriate cascade rules
- Timestamp tracking (createdAt, updatedAt)

**Query Optimization:**

- Efficient query patterns using Drizzle query builder
- Index recommendations based on query patterns
- Join optimization and N+1 query prevention
- Pagination strategies for large datasets
- Transaction handling for complex operations

**PostgreSQL Features:**

- JSONB for flexible document storage
- Array types for multi-value fields
- Full-text search implementation
- Custom enums for type safety
- Advanced indexing (partial, composite, covering)

**Migration Strategy:**

- Safe migration patterns and versioning
- Breaking change warnings
- Rollback strategies
- Data migration guidance

### Design Principles

The Database Architect follows strict design principles:

1. **UUIDv7 for Primary Keys**: Generated in application code using `Bun.randomUUIDv7()` for better performance and distribution
2. **Proper Normalization**: 3NF by default, strategic denormalization only when justified
3. **Type Safety**: Full TypeScript integration with `.$inferSelect` and `.$inferInsert`
4. **Data Integrity**: Foreign keys, constraints, and validation at the database level
5. **Timestamps**: `createdAt` and `updatedAt` on all tables for audit trails
6. **Index Strategy**: Index foreign keys and frequently queried columns
7. **Soft Deletes**: When appropriate for audit and compliance requirements

### Example Interactions

**Schema Design:**

```
User: "I need a database schema for a blog with users, posts, and comments"

Database Architect:
- Designs normalized schema with proper relationships
- Creates Drizzle table definitions with TypeScript types
- Adds appropriate indexes and foreign keys
- Provides migration commands
- Explains design decisions and trade-offs
```

**Query Optimization:**

```
User: "This query is slow - how can I optimize it?"

Database Architect:
- Analyzes query patterns
- Suggests index additions
- Recommends query restructuring
- Shows optimized Drizzle query code
- Explains performance improvements
```

## Commands

### `/setup-drizzle`

Initialize Drizzle ORM with PostgreSQL configuration in your Bun + Hono project.

**What it does:**

1. Checks if Drizzle is already installed
2. Installs required packages (`drizzle-orm`, `postgres`, `drizzle-kit`)
3. Creates database configuration structure
4. Sets up connection with proper pooling
5. Creates `drizzle.config.ts` for migrations
6. Adds helpful bun scripts to `package.json`
7. Creates sample schema file to verify setup

**Usage:**

```bash
/setup-drizzle
```

**Example workflow:**

```bash
# Start a new Bun + Hono project
# Then run:
/setup-drizzle

# Claude will:
# - Install all dependencies with bun
# - Create src/db/ structure
# - Configure drizzle.config.ts
# - Create database client with pooling
# - Add bun scripts for migrations
# - Provide .env template
```

**Created Structure:**

```
src/
  db/
    index.ts          # Database client and connection
    schema/           # Directory for schema files
      example.ts      # Sample schema file
drizzle.config.ts     # Drizzle Kit configuration
.env                  # DATABASE_URL configuration
```

**Added Bun Scripts:**

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

**Environment Variables:**

```env
DATABASE_URL="postgres://user:password@localhost:5432/dbname"
```

### `/create-schema`

Generate a new Drizzle schema file with table definitions.

**What it does:**

1. Asks for table/entity name
2. Creates schema file in appropriate location
3. Generates type-safe table definition
4. Includes proper column types and constraints
5. Adds primary keys and indexes
6. Includes timestamps (createdAt, updatedAt)
7. Sets up foreign key relationships if needed
8. Exports TypeScript types

**Usage:**

```bash
/create-schema
```

**Example workflow:**

```bash
/create-schema

# Claude will ask: "What table would you like to create?"
# You respond: "users"

# Claude generates:
# - src/db/schema/users.ts with full table definition
# - Proper imports and type exports
# - Primary key, timestamps, and constraints
# - Suggestion to run migration generation
```

**Generated Schema Example:**

```typescript
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // App generates ID via EntityId.generate()
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

**Features:**

- Type-safe schema definitions
- Proper PostgreSQL column types
- Unique constraints where appropriate
- Default values with `defaultNow()`
- TypeScript type inference
- UUIDv7 generation in application

### `/generate-migration`

Generate a Drizzle migration from schema changes.

**What it does:**

1. Checks for `drizzle.config.ts` configuration
2. Creates config file if missing
3. Runs migration generation (`drizzle-kit generate:pg`)
4. Reviews generated SQL migration
5. Warns about destructive operations
6. Provides apply commands
7. Suggests backup for production

**Usage:**

```bash
/generate-migration
```

**Example workflow:**

```bash
# After creating or modifying schemas
/generate-migration

# Claude will:
# - Verify drizzle.config.ts exists
# - Generate migration SQL
# - Show the migration file location
# - Review for destructive operations
# - Provide commands to apply migration
```

**Migration Output:**

```
drizzle/
  0001_create_users_table.sql
  meta/
    0001_snapshot.json
```

**Safety Features:**

- Warns about DROP operations
- Identifies potential data loss in ALTER statements
- Recommends backups before applying to production
- Validates environment variable configuration

**Apply Commands:**

```bash
# Review the migration first
cat drizzle/0001_create_users_table.sql

# Apply migration
bun run db:push

# Or use Drizzle Kit directly
bunx drizzle-kit push
```

### `/create-query`

Create type-safe Drizzle queries for database operations.

**What it does:**

1. Asks what type of query you need (SELECT, INSERT, UPDATE, DELETE, JOIN, TRANSACTION)
2. Identifies involved tables/schemas
3. Generates type-safe query with proper syntax
4. Includes error handling with try-catch
5. Adds proper where clauses and filters
6. Implements relations and joins if needed
7. Includes pagination if applicable
8. Suggests index optimizations

**Usage:**

```bash
/create-query
```

**Example workflow:**

```bash
/create-query

# Claude asks: "What type of query do you need?"
# Options: SELECT, INSERT, UPDATE, DELETE, COMPLEX JOIN, TRANSACTION

# You select: "SELECT with relations"

# Claude generates:
# - Type-safe query code
# - Proper error handling
# - Example usage in Hono route handler
# - Index recommendations
```

**Query Examples:**

**Select with Relations (Hono Route):**

```typescript
import { Hono } from "hono";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/users/:id", async (c) => {
  try {
    const userId = c.req.param("id");

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        posts: {
          orderBy: (posts, { desc }) => [desc(posts.createdAt)],
          limit: 10,
        },
        profile: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});
```

**Insert with Returning (Hono Route with Validation):**

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";

const app = new Hono();

const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
});

app.post("/users", zValidator("json", createUserSchema), async (c) => {
  try {
    const data = c.req.valid("json");

    const [newUser] = await db
      .insert(users)
      .values({
        id: Bun.randomUUIDv7(),
        name: data.name,
        email: data.email,
      })
      .returning();

    return c.json(newUser, 201);
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});
```

**Update with Condition (Hono Route):**

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

const updateUserSchema = z.object({
  name: z.string().min(1).max(255),
});

app.patch("/users/:id", zValidator("json", updateUserSchema), async (c) => {
  try {
    const userId = c.req.param("id");
    const { name } = c.req.valid("json");

    const [updatedUser] = await db
      .update(users)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});
```

**Transaction:**

```typescript
import { db } from "@/db";
import { users, profiles } from "@/db/schema";

async function createUserWithProfile(userData: any, profileData: any) {
  try {
    const result = await db.transaction(async (tx) => {
      const [user] = await tx.insert(users).values(userData).returning();

      const [profile] = await tx
        .insert(profiles)
        .values({ ...profileData, userId: user.id })
        .returning();

      return { user, profile };
    });

    return result;
  } catch (error) {
    console.error("Error creating user with profile:", error);
    throw new Error("Failed to create user and profile");
  }
}
```

**Pagination:**

```typescript
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";

async function getPaginatedPosts(page: number, pageSize: number = 20) {
  try {
    const offset = (page - 1) * pageSize;

    const result = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(pageSize)
      .offset(offset);

    return result;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}
```

**Features:**

- Full TypeScript type safety
- Proper error handling patterns
- Pagination support
- Relation/join handling
- Transaction support
- Optimized query patterns
- Index recommendations

## Best Practices

### Schema Design

1. **Use UUIDv7 for Primary Keys**:

   - Generate in application layer using Value Objects (see ADR 002)
   - Use `uuid` npm package via Port/Adapter pattern (NOT `Bun.randomUUIDv7()`)
   - PostgreSQL 17 has no native UUIDv7 support
   - Better for distributed systems
   - Improved index performance over UUIDv4
   - Example:

     ```typescript
     // Domain Value Object generates ID
     const userId = EntityId.generate(); // Uses uuid library via adapter

     // Drizzle schema (no database default)
     export const users = pgTable("users", {
       id: uuid("id").primaryKey(), // App generates, NOT database
     });
     ```

2. **Always Include Timestamps**:

   ```typescript
   createdAt: timestamp('created_at').defaultNow().notNull(),
   updatedAt: timestamp('updated_at').defaultNow().notNull(),
   ```

3. **Define Foreign Keys**:

   ```typescript
   userId: uuid('user_id')
     .notNull()
     .references(() => users.id, { onDelete: 'cascade' }),
   ```

4. **Index Strategically**:

   - Foreign keys
   - Frequently queried columns
   - Composite indexes for multi-column queries

5. **Use Appropriate Column Types**:
   - `varchar(255)` for short text
   - `text` for long content
   - `jsonb` for flexible documents
   - `timestamp` for dates
   - `uuid` for IDs

### Query Optimization

1. **Use Relations for Joins**:

   - Prefer Drizzle relations over manual joins
   - Better type safety and readability

2. **Limit Results**:

   - Always use pagination for large datasets
   - Prevent memory issues

3. **Select Only Needed Columns**:

   ```typescript
   // ❌ Bad
   const users = await db.select().from(users);

   // ✅ Good
   const users = await db
     .select({ id: users.id, name: users.name })
     .from(users);
   ```

4. **Use Transactions**:
   - For multi-step operations
   - Ensures data consistency
   - Proper rollback on errors

### Migration Management

1. **Review Before Applying**:

   - Always check generated SQL
   - Understand what will change
   - Test on staging first

2. **Backup Production**:

   - Before major migrations
   - Before destructive operations
   - Have rollback plan ready

3. **Version Control Migrations**:
   - Commit migration files to git
   - Keep migration history clean
   - Document complex migrations

## Installation

This plugin is included in the Claude Code marketplace. The commands and skill are automatically available when using Claude Code.

## Requirements

- PostgreSQL database (local or hosted)
- Bun runtime (TypeScript runtime and package manager)
- Hono framework for backend API
- Git for version control

## Workflow Integration

### Setup New Project

```bash
# 1. Setup Drizzle
/setup-drizzle

# 2. Configure DATABASE_URL in .env.local

# 3. Create your first schema
/create-schema

# 4. Generate and apply migration
/generate-migration
bun run db:push
```

### Development Workflow

```bash
# Design schema (Database Architect activates automatically)
"I need a schema for blog posts with categories"

# Create the schema file
/create-schema

# Generate migration
/generate-migration

# Create queries
/create-query

# Test in Drizzle Studio
bun run db:studio
```

### Schema Evolution

```bash
# Modify existing schema files
# Then generate migration
/generate-migration

# Review changes
cat drizzle/0002_migration_name.sql

# Apply to database
bun run db:push
```

## Troubleshooting

### Database Connection Issues

**Issue**: Cannot connect to database

**Solutions**:

- Verify `DATABASE_URL` is set in `.env.local`
- Check database is running (PostgreSQL)
- Verify connection string format: `postgres://user:password@host:port/database`
- Ensure firewall/network allows connection

### Migration Generation Fails

**Issue**: `drizzle-kit generate:pg` fails

**Solutions**:

- Verify `drizzle.config.ts` exists and is properly configured
- Check schema files have correct exports
- Ensure `DATABASE_URL` environment variable is set
- Run `bun add -D drizzle-kit` if missing

### Type Errors

**Issue**: TypeScript errors with Drizzle queries

**Solutions**:

- Ensure schema exports types: `export type User = typeof users.$inferSelect`
- Import types correctly: `import type { User } from '@/db/schema'`
- Check Drizzle ORM version compatibility
- Run `bun run type-check` to see all errors

### Query Performance Issues

**Issue**: Slow queries or timeouts

**Solutions**:

- Add indexes to frequently queried columns
- Use `EXPLAIN ANALYZE` to understand query plans
- Avoid N+1 queries - use relations
- Implement pagination for large datasets
- Consider connection pooling configuration

## Tips & Tricks

### Working with JSONB

```typescript
import { jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // App generates ID via EntityId.generate()
  metadata: jsonb("metadata").$type<{ theme: string; preferences: any }>(),
});
```

### Array Columns

```typescript
import { text } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey(), // App generates ID via EntityId.generate()
  tags: text("tags").array(),
});

// Query with array contains
import { arrayContains } from "drizzle-orm";
const posts = await db
  .select()
  .from(posts)
  .where(arrayContains(posts.tags, ["typescript"]));
```

### Soft Deletes

```typescript
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // App generates ID via EntityId.generate()
  name: varchar("name", { length: 255 }).notNull(),
  deletedAt: timestamp("deleted_at"),
});

// Query only active users
import { isNull } from "drizzle-orm";
const activeUsers = await db
  .select()
  .from(users)
  .where(isNull(users.deletedAt));
```

### Full-Text Search

```typescript
import { index, sql } from "drizzle-orm/pg-core";

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey(), // App generates ID via EntityId.generate()
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
  },
  (table) => ({
    searchIdx: index("search_idx").using(
      "gin",
      sql`to_tsvector('english', ${table.title} || ' ' || ${table.content})`
    ),
  })
);
```

### Drizzle Studio

```bash
# Launch Drizzle Studio to browse your database
bun run db:studio

# Opens in browser: https://local.drizzle.studio
# Browse tables, run queries, view data
```

## Advanced Features

### Custom Types

```typescript
import { customType } from "drizzle-orm/pg-core";

const customNumeric = customType<{ data: number }>({
  dataType() {
    return "numeric";
  },
  toDriver(value: number) {
    return value.toString();
  },
  fromDriver(value: string) {
    return Number(value);
  },
});
```

### Prepared Statements

```typescript
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const getUserByIdQuery = db
  .select()
  .from(users)
  .where(eq(users.id, sql.placeholder("id")))
  .prepare("get_user_by_id");

// Execute prepared statement
const user = await getUserByIdQuery.execute({ id: "some-uuid" });
```

### Connection Pooling

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, {
  max: 10, // Maximum connections
  idle_timeout: 20, // Close idle connections after 20s
  connect_timeout: 10, // Fail if can't connect in 10s
});

export const db = drizzle(client);
```

## Author

Leon van Zyl (leon.vanzyl@gmail.com)

## Version

1.0.0

## License

MIT

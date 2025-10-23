---
description: Create type-safe Drizzle queries for database operations
---

# Create Drizzle Query

Generate type-safe Drizzle ORM queries for CRUD operations.

## Instructions

1. Ask the user what type of query they need:
   - SELECT (find, findFirst, findMany)
   - INSERT (single or batch)
   - UPDATE
   - DELETE
   - Complex queries with joins
   - Transactions
2. Check which tables/schemas are involved
3. Generate the query with:
   - Proper Drizzle query builder syntax
   - TypeScript type inference
   - Error handling with try-catch
   - Proper where clauses and filters
   - Relations and joins if needed
   - Pagination support if applicable
4. For Hono route handlers, include proper wrapping with response formatting
5. Suggest adding proper indexes for frequently queried columns

## Query Patterns

### Select with Relations

```typescript
const result = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    posts: true,
    profile: true,
  },
});
```

### Insert with Return

```typescript
const [newUser] = await db.insert(users).values({ name, email }).returning();
```

### Transaction

```typescript
await db.transaction(async (tx) => {
  await tx.insert(users).values(userData);
  await tx.insert(profiles).values(profileData);
});
```

Ensure proper error handling and type safety throughout.

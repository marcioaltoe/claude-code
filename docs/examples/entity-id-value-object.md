# Entity ID Value Object - Complete Implementation Example

**Reference:** ADR 002 - UUIDv7 Generation Strategy with Value Objects

This document provides a complete, production-ready implementation of the EntityId Value Object pattern using the `uuid` library via Port/Adapter pattern.

---

## Architecture Overview

```
domain/
├── ports/
│   └── id-generator.ts          # Port (interface)
└── value-objects/
    ├── value-object.base.ts     # Base class (optional)
    └── entity-id.vo.ts          # EntityId Value Object

infrastructure/
└── adapters/
    └── id-generator/
        ├── uuid-v7.adapter.ts          # Production (uuid library)
        ├── fake-id-generator.adapter.ts # Testing (deterministic)
        └── index.ts                     # Barrel export
```

---

## 1. Port (Domain Layer)

**File:** `src/domain/ports/id-generator.ts`

```typescript
/**
 * IdGenerator Port
 *
 * Domain layer abstraction for ID generation.
 * Implementations in infrastructure layer.
 *
 * Why: Dependency Inversion Principle (DIP)
 * - Domain depends on abstraction, not concrete implementation
 * - Easy to swap implementations (uuid, nanoid, cuid, etc.)
 */
export interface IdGenerator {
  /**
   * Generate a new unique identifier
   * @returns UUIDv7 string (time-sortable)
   */
  generate(): string;
}
```

---

## 2. Base Value Object (Optional)

**File:** `src/domain/value-objects/value-object.base.ts`

```typescript
/**
 * Base Value Object
 *
 * Provides equality and immutability guarantees.
 * All Value Objects should extend this class.
 */
export abstract class ValueObject<T> {
  protected readonly _value: T;

  protected constructor(value: T) {
    this._value = Object.freeze(value);
  }

  /**
   * Get the underlying primitive value
   */
  get value(): T {
    return this._value;
  }

  /**
   * Value equality comparison
   */
  equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * String representation
   */
  toString(): string {
    return String(this._value);
  }
}
```

---

## 3. EntityId Value Object (Domain Layer)

**File:** `src/domain/value-objects/entity-id.vo.ts`

```typescript
import type { IdGenerator } from '@/domain/ports/id-generator';
import { ValueObject } from './value-object.base';

/**
 * EntityId Value Object
 *
 * Represents a unique entity identifier (UUIDv7).
 *
 * Why UUIDv7:
 * - Time-sortable (better than UUIDv4 for indexes)
 * - Distributed-system friendly
 * - RFC 9562 compliant
 *
 * Pattern: Static Factory Methods
 * - EntityId.generate() - Create new ID
 * - EntityId.from(string) - Reconstruct from DB
 *
 * Clean Architecture:
 * - Depends on IdGenerator port (not uuid library directly)
 * - Infrastructure injects generator via DI
 */
export class EntityId extends ValueObject<string> {
  private static generator: IdGenerator;

  private constructor(value: string) {
    super(value);
  }

  /**
   * Configure the ID generator (called once at app startup)
   *
   * @param generator - IdGenerator implementation (UuidV7Generator, FakeIdGenerator, etc.)
   *
   * @example
   * // In DI container registration
   * EntityId.setGenerator(new UuidV7Generator());
   */
  static setGenerator(generator: IdGenerator): void {
    EntityId.generator = generator;
  }

  /**
   * Generate a new EntityId
   *
   * @throws Error if generator not configured
   *
   * @example
   * const userId = EntityId.generate();
   */
  static generate(): EntityId {
    if (!EntityId.generator) {
      throw new Error(
        'IdGenerator not configured. Call EntityId.setGenerator() in DI container first.'
      );
    }
    return new EntityId(EntityId.generator.generate());
  }

  /**
   * Reconstruct EntityId from string (e.g., from database)
   *
   * @param id - UUID string (must be valid UUIDv7 format)
   * @throws Error if invalid UUIDv7 format
   *
   * @example
   * const userId = EntityId.from('01234567-89ab-7cde-8012-3456789abcde');
   */
  static from(id: string): EntityId {
    // UUIDv7 format validation (RFC 9562)
    // Format: xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx
    // - Version: 7 (4 bits at position 12-15)
    // - Variant: 10 (2 bits at position 16-17)
    const uuidV7Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidV7Regex.test(id)) {
      throw new Error(
        `Invalid UUIDv7 format: ${id}. Expected format: xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx`
      );
    }

    return new EntityId(id);
  }

  /**
   * Check if string is a valid UUIDv7
   *
   * @param id - String to validate
   * @returns true if valid UUIDv7 format
   *
   * @example
   * if (EntityId.isValid(input)) {
   *   const id = EntityId.from(input);
   * }
   */
  static isValid(id: string): boolean {
    const uuidV7Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV7Regex.test(id);
  }
}
```

---

## 4. Production Adapter (Infrastructure Layer)

**File:** `src/infrastructure/adapters/id-generator/uuid-v7.adapter.ts`

```typescript
import { v7 as uuidv7 } from 'uuid';
import type { IdGenerator } from '@/domain/ports/id-generator';

/**
 * UuidV7Generator Adapter
 *
 * Production implementation using `uuid` library.
 *
 * Why uuid library:
 * - RFC 9562 compliant
 * - Portable across runtimes (Bun, Node.js, Deno, Workers)
 * - Mature, widely tested
 * - Avoids Bun.randomUUIDv7() runtime lock-in
 *
 * Usage: Registered in DI container for production environment
 */
export class UuidV7Generator implements IdGenerator {
  generate(): string {
    return uuidv7();
  }
}
```

**Install dependency:**
```bash
bun add uuid
bun add -d @types/uuid
```

---

## 5. Test Adapter (Infrastructure Layer)

**File:** `src/infrastructure/adapters/id-generator/fake-id-generator.adapter.ts`

```typescript
import type { IdGenerator } from '@/domain/ports/id-generator';

/**
 * FakeIdGenerator Adapter
 *
 * Test double for unit tests - generates deterministic UUIDs.
 *
 * Format: 00000000-0000-7000-8000-{12-digit counter}
 * - Version 7 at position 12 (valid UUIDv7)
 * - Variant 10 at position 16 (RFC compliance)
 * - Counter increments for each generation
 *
 * Why:
 * - Predictable IDs in tests (easier assertions)
 * - No external dependencies (fast tests)
 * - Reproducible test failures
 *
 * Usage: Registered in DI container for test environment
 *
 * @example
 * const generator = new FakeIdGenerator();
 * generator.generate(); // '00000000-0000-7000-8000-000000000001'
 * generator.generate(); // '00000000-0000-7000-8000-000000000002'
 * generator.reset();
 * generator.generate(); // '00000000-0000-7000-8000-000000000001' (reset)
 */
export class FakeIdGenerator implements IdGenerator {
  private counter = 1;

  generate(): string {
    // Format: 00000000-0000-7000-8000-{12-digit counter}
    // Version 7 (position 14: '7'), Variant 10 (position 19: '8')
    const paddedCounter = String(this.counter++).padStart(12, '0');
    return `00000000-0000-7000-8000-${paddedCounter}`;
  }

  /**
   * Reset counter to 1 (useful between test cases)
   */
  reset(): void {
    this.counter = 1;
  }

  /**
   * Set counter to specific value (for test scenarios)
   */
  setCounter(value: number): void {
    this.counter = value;
  }
}
```

---

## 6. Barrel Export (Infrastructure Layer)

**File:** `src/infrastructure/adapters/id-generator/index.ts`

```typescript
export { UuidV7Generator } from './uuid-v7.adapter';
export { FakeIdGenerator } from './fake-id-generator.adapter';
```

---

## 7. DI Container Registration

**File:** `src/infrastructure/container/register-domain.ts`

```typescript
import { EntityId } from '@/domain/value-objects/entity-id.vo';
import { UuidV7Generator, FakeIdGenerator } from '@/infrastructure/adapters/id-generator';
import type { Container } from './container';

/**
 * Register Domain Layer Dependencies
 *
 * Configures EntityId generator based on environment:
 * - Production: UuidV7Generator (uuid library)
 * - Development: UuidV7Generator (same as prod)
 * - Test: FakeIdGenerator (deterministic IDs)
 */
export function registerDomain(container: Container): void {
  // Configure EntityId generator based on NODE_ENV
  if (process.env.NODE_ENV === 'test') {
    // Test environment: Use deterministic fake generator
    EntityId.setGenerator(new FakeIdGenerator());
  } else {
    // Production/Development: Use uuid library
    EntityId.setGenerator(new UuidV7Generator());
  }

  // Other domain registrations...
}
```

---

## 8. Usage Examples

### In Use Cases (Application Layer)

```typescript
// application/use-cases/create-user.use-case.ts
import { EntityId } from '@/domain/value-objects/entity-id.vo';
import { Email } from '@/domain/value-objects/email.vo';
import { User } from '@/domain/entities/user.entity';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // Generate new ID
    const userId = EntityId.generate();

    // Create domain entity
    const user = User.create({
      id: userId,
      email: Email.from(dto.email),
      name: dto.name,
    });

    // Persist
    await this.userRepository.save(user);

    return user;
  }
}
```

### In Repositories (Infrastructure Layer)

```typescript
// infrastructure/repositories/user.repository.impl.ts
import { EntityId } from '@/domain/value-objects/entity-id.vo';
import { User } from '@/domain/entities/user.entity';

export class UserRepositoryImpl implements UserRepository {
  async findById(id: EntityId): Promise<User | null> {
    const row = await db.select().from(users).where(eq(users.id, id.value));

    if (!row) return null;

    // Reconstruct EntityId from database string
    return User.reconstitute({
      id: EntityId.from(row.id), // ✅ Validates UUIDv7 format
      email: Email.from(row.email),
      name: row.name,
    });
  }

  async save(user: User): Promise<void> {
    await db.insert(users).values({
      id: user.id.value, // ✅ Extract primitive for DB
      email: user.email.value,
      name: user.name,
    });
  }
}
```

### In Unit Tests

```typescript
// domain/entities/__tests__/user.entity.test.ts
import { describe, test, expect, beforeEach } from 'bun:test';
import { EntityId } from '@/domain/value-objects/entity-id.vo';
import { FakeIdGenerator } from '@/infrastructure/adapters/id-generator';
import { User } from '../user.entity';

describe('User Entity', () => {
  let fakeIdGenerator: FakeIdGenerator;

  beforeEach(() => {
    // Configure FakeIdGenerator for tests
    fakeIdGenerator = new FakeIdGenerator();
    EntityId.setGenerator(fakeIdGenerator);
  });

  test('should create user with generated ID', () => {
    const user = User.create({
      id: EntityId.generate(),
      email: Email.from('test@example.com'),
      name: 'Test User',
    });

    // Predictable ID assertion
    expect(user.id.value).toBe('00000000-0000-7000-8000-000000000001');
  });

  test('should create multiple users with sequential IDs', () => {
    const user1 = User.create({
      id: EntityId.generate(),
      email: Email.from('user1@example.com'),
      name: 'User 1',
    });

    const user2 = User.create({
      id: EntityId.generate(),
      email: Email.from('user2@example.com'),
      name: 'User 2',
    });

    expect(user1.id.value).toBe('00000000-0000-7000-8000-000000000001');
    expect(user2.id.value).toBe('00000000-0000-7000-8000-000000000002');
  });
});
```

### In Drizzle Schemas (Infrastructure Layer)

```typescript
// infrastructure/database/schema/users.schema.ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // ✅ No .default() - app generates via EntityId.generate()
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
```

---

## 9. Migration from UUIDv4

If migrating from database-generated UUIDv4:

**Before (UUIDv4 - database-generated):**
```typescript
export const users = pgTable('users', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
});
```

**After (UUIDv7 - application-generated):**
```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // App generates via EntityId.generate()
});
```

**Data Migration:**
- Existing UUIDv4 records remain valid (no data migration needed)
- New records use UUIDv7 (gradual transition)
- Both formats coexist (UUIDv4 and UUIDv7 are compatible in `uuid` column type)

---

## 10. Benefits Summary

| Aspect | Benefit |
|--------|---------|
| **Clean Architecture** | Domain depends on port, not uuid library |
| **Testability** | FakeIdGenerator provides deterministic IDs |
| **Portability** | Works in Bun, Node.js, Deno, Cloudflare Workers |
| **RFC Compliance** | uuid library strictly follows RFC 9562 |
| **Maintainability** | Easy to swap implementation (just change adapter) |
| **Performance** | UUIDv7 improves index performance vs UUIDv4 |
| **SOLID** | Dependency Inversion Principle satisfied |
| **DDD** | Value Object encapsulates ID logic |

---

## 11. Common Pitfalls

❌ **Don't use Bun.randomUUIDv7() directly in domain:**
```typescript
// ❌ BAD - Runtime lock-in, violates Clean Architecture
export class EntityId extends ValueObject<string> {
  static generate(): EntityId {
    return new EntityId(Bun.randomUUIDv7()); // Couples domain to Bun
  }
}
```

❌ **Don't forget to configure generator in DI:**
```typescript
// ❌ BAD - Will throw error at runtime
const userId = EntityId.generate(); // Error: IdGenerator not configured
```

❌ **Don't skip validation in EntityId.from():**
```typescript
// ❌ BAD - Accepts invalid UUIDs
static from(id: string): EntityId {
  return new EntityId(id); // No validation!
}
```

✅ **Do use Port/Adapter pattern:**
```typescript
// ✅ GOOD - Clean Architecture compliant
EntityId.setGenerator(new UuidV7Generator()); // DI configures
const userId = EntityId.generate(); // Domain uses abstraction
```

---

## 12. Related Resources

- **ADR 002:** UUIDv7 Generation Strategy with Value Objects
- **RFC 9562:** UUID specification (UUIDv7 definition)
- **uuid library:** https://www.npmjs.com/package/uuid
- **Clean Architecture:** Robert C. Martin - Dependency Inversion Principle

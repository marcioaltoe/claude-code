# ADR 002: UUIDv7 Generation Strategy with Value Objects

**Status:** Accepted

**Date:** 2025-10-31

**Context:** Architecture Design Plugin

**Deciders:** Architecture Team

**Supersedes:** N/A

**Related to:** ADR 001 (AWS SQS adoption - demonstrates Port/Adapter pattern)

---

## Context and Problem Statement

PostgreSQL 17 (AWS RDS) does not have native UUIDv7 support (`gen_random_uuid()` only generates UUIDv4). We need a strategy to generate UUIDv7 identifiers for domain entities that:

- Works with PostgreSQL 17 (no native database function)
- Provides time-sortable UUIDs (UUIDv7 advantage over UUIDv4)
- Maintains Clean Architecture principles (domain independence)
- Ensures RFC 9562 compliance
- Is portable across runtimes (Node.js, Bun, Deno, Cloudflare Workers)
- Remains testable in unit tests

**Key Questions:**

1. Should we generate UUIDs in the application layer or database layer?
2. Should we use `Bun.randomUUIDv7()` (runtime-specific) or external library (portable)?
3. How do we encapsulate ID generation to maintain domain purity?

---

## Decision Drivers

- **PostgreSQL 17 Constraint**: No native UUIDv7 function available
- **Clean Architecture**: Domain layer must remain infrastructure-agnostic
- **Portability**: Code should work across JS runtimes (future-proofing)
- **RFC 9562 Compliance**: UUIDv7 must follow official specification
- **Testability**: Easy to mock/stub in unit tests
- **Performance**: UUID generation must not be a bottleneck
- **Maintainability**: Prefer mature, well-tested solutions
- **SOLID Principles**: Dependency Inversion Principle (depend on abstractions)

---

## Considered Options

### Option 1: Database-Generated UUIDv7 (PostgreSQL Extension)

Install `uuid-ossp` or custom UUIDv7 function in PostgreSQL.

**Example:**

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Custom UUIDv7 function (complex SQL implementation)
```

**Drizzle Schema:**

```typescript
export const users = pgTable("users", {
  id: uuid("id")
    .default(sql`gen_uuidv7()`)
    .primaryKey(),
});
```

**Pros:**

- ✅ Centralized UUID generation in database
- ✅ Consistent across all applications accessing DB

**Cons:**

- ❌ Requires PostgreSQL extensions/custom functions
- ❌ AWS RDS may restrict custom extensions
- ❌ Ties domain logic to database capabilities
- ❌ Harder to test (requires DB connection in tests)
- ❌ Not portable (different DBs need different implementations)
- ❌ **Violates Clean Architecture** (domain depends on infrastructure)

---

### Option 2: Application-Generated with `Bun.randomUUIDv7()`

Use Bun's native UUIDv7 generation in Value Objects.

**Example:**

```typescript
// domain/value-objects/entity-id.vo.ts
export class EntityId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static generate(): EntityId {
    return new EntityId(Bun.randomUUIDv7()); // ❌ Runtime lock-in
  }

  static from(id: string): EntityId {
    // Validation logic
    return new EntityId(id);
  }
}
```

**Drizzle Schema:**

```typescript
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // No default, app generates
});
```

**Pros:**

- ✅ Native to Bun (zero dependencies)
- ✅ Minimal bundle size impact
- ✅ Application-layer generation (domain controls IDs)

**Cons:**

- ❌ **Runtime lock-in**: Code only works in Bun
- ❌ **Not portable** to Node.js, Deno, Cloudflare Workers
- ❌ **Violates Dependency Inversion Principle** (domain depends on Bun runtime)
- ❌ Harder to test (mocking `Bun` global is complex)
- ❌ Performance reportedly slower than Node.js native UUID generation
- ❌ **Breaks Clean Architecture** (domain coupled to infrastructure)

---

### Option 3: Application-Generated with `uuid` npm Package (Port/Adapter)

Use mature, portable `uuid` library with Port/Adapter pattern.

**Example:**

**1. Domain Port (Interface):**

```typescript
// domain/ports/id-generator.ts
export interface IdGenerator {
  generate(): string;
}
```

**2. Infrastructure Adapter (Real Implementation):**

```typescript
// infrastructure/adapters/id-generator/uuid-v7.adapter.ts
import { v7 as uuidv7 } from "uuid";
import type { IdGenerator } from "@/domain/ports/id-generator";

export class UuidV7Generator implements IdGenerator {
  generate(): string {
    return uuidv7();
  }
}
```

**3. Test Adapter (Fake Implementation):**

```typescript
// infrastructure/adapters/id-generator/fake-id-generator.adapter.ts
export class FakeIdGenerator implements IdGenerator {
  private counter = 1;

  generate(): string {
    return `00000000-0000-0000-0000-${String(this.counter++).padStart(
      12,
      "0"
    )}`;
  }

  reset(): void {
    this.counter = 1;
  }
}
```

**4. Domain Value Object:**

```typescript
// domain/value-objects/entity-id.vo.ts
import type { IdGenerator } from "@/domain/ports/id-generator";

export class EntityId extends ValueObject<string> {
  private static generator: IdGenerator;

  private constructor(value: string) {
    super(value);
  }

  static setGenerator(generator: IdGenerator): void {
    EntityId.generator = generator;
  }

  static generate(): EntityId {
    if (!EntityId.generator) {
      throw new Error(
        "IdGenerator not configured. Call EntityId.setGenerator() first."
      );
    }
    return new EntityId(EntityId.generator.generate());
  }

  static from(id: string): EntityId {
    // Validation: UUIDv7 format
    const uuidV7Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidV7Regex.test(id)) {
      throw new Error(`Invalid UUIDv7 format: ${id}`);
    }
    return new EntityId(id);
  }
}
```

**5. DI Container Setup:**

```typescript
// infrastructure/container/register-domain.ts
import { EntityId } from "@/domain/value-objects/entity-id.vo";
import { UuidV7Generator } from "@/infrastructure/adapters/id-generator/uuid-v7.adapter";
import { FakeIdGenerator } from "@/infrastructure/adapters/id-generator/fake-id-generator.adapter";

export function registerDomain(container: Container): void {
  // Configure ID generator based on environment
  if (process.env.NODE_ENV === "test") {
    EntityId.setGenerator(new FakeIdGenerator());
  } else {
    EntityId.setGenerator(new UuidV7Generator());
  }
}
```

**6. Drizzle Schema:**

```typescript
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // No database default, app generates
  // ... other fields
});
```

**7. Usage in Use Case:**

```typescript
// application/use-cases/create-user.use-case.ts
const userId = EntityId.generate(); // Uses configured generator
const user = User.create({
  id: userId,
  email: Email.from(dto.email),
  // ...
});
```

**Pros:**

- ✅ **Clean Architecture compliant**: Domain depends on abstraction (port), not implementation
- ✅ **Portable**: Works in Bun, Node.js, Deno, Cloudflare Workers
- ✅ **Testable**: Easy to inject `FakeIdGenerator` for predictable tests
- ✅ **RFC 9562 compliant**: `uuid` library fully implements spec
- ✅ **Mature**: `uuid` is widely used, actively maintained, battle-tested
- ✅ **SOLID compliant**: Dependency Inversion Principle (DIP) satisfied
- ✅ **Flexible**: Easy to swap UUID library if needed (just change adapter)

**Cons:**

- ⚠️ Additional dependency (~40 KB, tree-shakeable)
- ⚠️ Slightly more boilerplate (Port/Adapter pattern)
- ⚠️ Performance comparable to Bun's (both adequate for typical use cases)

---

## Decision Outcome

**Chosen option:** Option 3 - Application-Generated with `uuid` npm Package using Port/Adapter Pattern

### Rationale

1. **Clean Architecture Compliance**: Domain layer remains infrastructure-agnostic by depending on `IdGenerator` port, not concrete implementation
2. **Portability**: Code works across all major JS runtimes (future-proof)
3. **Testability**: `FakeIdGenerator` provides deterministic IDs in tests (e.g., `00000000-0000-0000-0000-000000000001`)
4. **RFC 9562 Compliance**: `uuid` library fully implements UUIDv7 specification with customization options
5. **Maturity**: `uuid` is the de facto standard for UUID generation in JavaScript ecosystem
6. **SOLID Principles**: Satisfies Dependency Inversion Principle (DIP) - high-level modules (domain) depend on abstractions (ports)
7. **Flexibility**: Easy to replace `uuid` with another library by creating new adapter

### Trade-offs Accepted

**Cost:**

- +40 KB bundle size (negligible for backend services)
- Additional boilerplate (Port + Adapter + DI configuration)

**Benefit:**

- ✅ Runtime independence (not locked to Bun)
- ✅ Domain purity (no infrastructure dependencies)
- ✅ Superior testability (deterministic test IDs)
- ✅ Future flexibility (easy to swap implementation)

---

## Architecture Impact

### Structure

```
src/
├── domain/
│   ├── ports/
│   │   └── id-generator.ts                    # Port (interface)
│   └── value-objects/
│       └── entity-id.vo.ts                    # Uses IdGenerator port
│
└── infrastructure/
    ├── adapters/
    │   └── id-generator/
    │       ├── uuid-v7.adapter.ts             # Production implementation
    │       └── fake-id-generator.adapter.ts   # Test implementation
    └── container/
        └── register-domain.ts                 # Configure generator via DI
```

### Dependencies

```bash
bun add uuid
bun add -d @types/uuid
```

**Package:** `uuid@10.x` (latest stable, RFC 9562 compliant)

---

## Consequences

### Positive

- ✅ **Domain purity**: No runtime-specific code in domain layer
- ✅ **Testability**: Deterministic IDs in tests (`FakeIdGenerator`)
- ✅ **Portability**: Code runs on any JS runtime (Bun, Node.js, Deno, Workers)
- ✅ **RFC compliance**: `uuid` library strictly follows RFC 9562
- ✅ **Maintainability**: Mature, well-tested library (widely adopted)
- ✅ **Flexibility**: Easy to swap UUID implementation without changing domain code
- ✅ **SOLID compliance**: Dependency Inversion Principle satisfied
- ✅ **Time-sortable**: UUIDv7 provides chronological ordering (vs UUIDv4)
- ✅ **Index performance**: Better than UUIDv4 for database indexes

### Negative

- ⚠️ **Bundle size**: +40 KB (acceptable for backend, negligible impact)
- ⚠️ **Boilerplate**: Requires Port/Adapter setup (worth the abstraction cost)
- ⚠️ **Configuration overhead**: Must configure generator in DI container
- ⚠️ **Learning curve**: Team must understand Port/Adapter pattern

### Neutral

- Static method `EntityId.setGenerator()` couples configuration to class (alternative: pass generator to `generate()`, but verbose)

### Mitigations

1. **Bundle size**: Non-issue for backend services; tree-shaking reduces impact
2. **Boilerplate**: Document pattern in `backend-engineer` skill, provide templates
3. **Configuration**: DI container handles setup once, developers just use `EntityId.generate()`
4. **Learning curve**: Provide comprehensive examples, conduct team training

---

## Compliance with Architecture Gates

### ✅ Gate 1: Clean Architecture Principles

- **Dependency Rule**: Domain depends on `IdGenerator` port (abstraction), infrastructure implements it
- **Port/Adapter Pattern**: `IdGenerator` port in domain, `UuidV7Generator` adapter in infrastructure
- **Testability**: `FakeIdGenerator` enables pure domain tests without external dependencies

### ✅ Gate 2: SOLID Principles

- **Dependency Inversion (DIP)**: Domain depends on `IdGenerator` abstraction, not `uuid` library
- **Single Responsibility (SRP)**: `UuidV7Generator` has one job: generate UUIDs
- **Open/Closed (OCP)**: New ID generation strategies extend via new adapters, no domain changes

### ✅ Gate 3: Domain-Driven Design (DDD)

- **Value Object**: `EntityId` is immutable, self-validating, encapsulates ID logic
- **Ubiquitous Language**: `EntityId.generate()` expresses domain intent clearly
- **Domain Purity**: No infrastructure leakage into domain layer

---

## Implementation Checklist

**Domain Layer:**

- [ ] Create `domain/ports/id-generator.ts` (IdGenerator interface)
- [ ] Create `domain/value-objects/entity-id.vo.ts` (EntityId Value Object)
- [ ] Add UUIDv7 format validation in `EntityId.from()`
- [ ] Add `EntityId.setGenerator()` for DI configuration

**Infrastructure Layer:**

- [ ] Install `uuid` package: `bun add uuid @types/uuid`
- [ ] Create `infrastructure/adapters/id-generator/uuid-v7.adapter.ts`
- [ ] Create `infrastructure/adapters/id-generator/fake-id-generator.adapter.ts`
- [ ] Update `infrastructure/container/register-domain.ts` to configure generator

**Database Schema:**

- [ ] Remove `.default(sql`gen_random_uuid()`)` from Drizzle schemas
- [ ] Update schemas to use plain `.primaryKey()` (app generates IDs)
- [ ] Verify existing schemas work with application-generated UUIDs

**Testing:**

- [ ] Unit tests use `FakeIdGenerator` for predictable IDs
- [ ] Integration tests verify UUIDv7 format in database
- [ ] Test `EntityId.from()` validation with invalid UUIDs

**Documentation:**

- [ ] Update `backend-engineer` skill with UUIDv7 pattern ✅ (TODO)
- [ ] Update `db-tools` README with new ID generation strategy ✅ (TODO)
- [ ] Create migration guide if existing code uses database-generated UUIDs
- [ ] Document `FakeIdGenerator` usage in test examples

---

## Related Decisions

- **ADR 001**: AWS SQS Adoption (demonstrates Port/Adapter pattern consistency)
- **ADR 003**: Value Objects Strategy (future - expands on VO patterns)

---

## References

- [RFC 9562 - UUIDv7 Specification](https://www.rfc-editor.org/rfc/rfc9562.html)
- [uuid npm package](https://www.npmjs.com/package/uuid)
- [PostgreSQL 17 Release Notes](https://www.postgresql.org/docs/17/release-17.html) (no native UUIDv7)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Value Objects](https://martinfowler.com/bliki/ValueObject.html)

---

## Notes

**Why Not Bun.randomUUIDv7()?**

While `Bun.randomUUIDv7()` is tempting (zero dependencies, native), it violates Clean Architecture principles:

- **Runtime lock-in**: Cannot run in Node.js, Deno, Cloudflare Workers
- **Testability**: Mocking `Bun` global is complex and fragile
- **DIP violation**: Domain layer depends on Bun runtime (infrastructure concern)

**Performance Considerations:**

- UUIDv7 generation is not a bottleneck in typical backend workloads
- Both `Bun.randomUUIDv7()` and `uuid` library are adequate (microseconds per call)
- If profiling reveals performance issues, optimize with caching or batch generation

**Alternative Libraries Considered:**

- `uuidv7` npm package: Less mature, smaller community
- `@lukeed/uuid`: Lightweight, but lacks UUIDv7 support (only v4)
- **Winner:** `uuid` - most mature, widest adoption, RFC-compliant

**Migration Path from UUIDv4:**

If migrating from UUIDv4 (`gen_random_uuid()`):

1. Update Drizzle schemas (remove `.default(sql`gen_random_uuid()`)`)
2. Change `EntityId.generate()` to use new adapter
3. Existing UUIDv4s remain valid (no data migration needed)
4. New records use UUIDv7 (gradual transition)

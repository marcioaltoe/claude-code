---
id: DESIGN-{auto-number}
spec: SPEC-{number}
created: { YYYY-MM-DD }
status: draft
phase: design
---

# Technical Design: {Feature Name}

> **Purpose:** Define HOW to build with architectural decisions
>
> **Input:** Spec document `SPEC-{number}` > **Branch:** `{###-feature-name}`

## 🏗️ Architecture Overview

**Selected Approach:** {Clean Architecture / Hexagonal / Transactional Script / Other}

**Rationale:**

<!-- Por que essa arquitetura? O que torna ela adequada para este problema? -->

**Key Architectural Decisions:**

1.
2.
3.

---

## 🛠️ Tech Stack

| Layer/Component        | Technology               | Rationale                      |
| ---------------------- | ------------------------ | ------------------------------ |
| **Runtime**            | Bun                      | {why chosen over Node.js/Deno} |
| **Backend Framework**  | Hono                     | {why chosen}                   |
| **Database**           | PostgreSQL               | {why chosen}                   |
| **ORM**                | Drizzle                  | {why chosen}                   |
| **Cache**              | Redis (ioredis)          | {why needed, why Redis}        |
| **Queue**              | AWS SQS (LocalStack local) | {why needed, why SQS}       |
| **Frontend Framework** | React 19 + Vite 6        | {why chosen}                   |
| **Router**             | TanStack Router          | {why chosen}                   |
| **State Management**   | Zustand + TanStack Query | {why chosen}                   |
| **UI Components**      | shadcn/ui + Tailwind 4   | {why chosen}                   |
| **Testing**            | Bun test + Playwright    | {why chosen}                   |

**Research References:**

## <!-- MCP Context7/Perplexity/Octocode links and insights -->

-
- ***

## 🗂️ System Structure

### Backend Structure (Clean Architecture)

```
src/
├── domain/                     # Layer 1 (innermost, no dependencies)
│   ├── entities/              # Business entities
│   │   └── {entity}.entity.ts
│   ├── value-objects/         # Immutable value objects
│   │   └── {vo}.vo.ts
│   ├── aggregates/            # Aggregate roots
│   │   └── {aggregate}.aggregate.ts
│   ├── events/                # Domain events
│   │   └── {event}.event.ts
│   └── ports/                 # Interface contracts (NO "I" prefix)
│       ├── repositories/      # Repository interfaces
│       │   └── {entity}.repository.ts
│       └── services/          # Service interfaces
│           └── {service}.service.ts
│
├── application/               # Layer 2 (depends on Domain only)
│   ├── use-cases/             # Application business rules
│   │   └── {action}-{entity}.use-case.ts
│   └── dtos/                  # Data transfer objects
│       └── {entity}.dto.ts
│
└── infrastructure/            # Layer 3 (depends on Application + Domain)
    ├── controllers/       # Self-registering controllers
    │   ├── {resource}.controller.ts
    │   └── schemas/           # Zod validation schemas
    │       └── {resource}.schema.ts
    ├── repositories/          # Repository implementations
    │   └── {entity}.repository.impl.ts
    ├── adapters/              # External service adapters
    │   ├── cache/             # Redis, etc.
    │   │   └── redis.adapter.ts
    │   ├── logger/            # Winston, Pino, etc.
    │   │   └── logger.adapter.ts
    │   └── queue/             # SQS, etc.
    │       ├── sqs.adapter.ts
    │       ├── localstack-sqs.adapter.ts
    │       └── fake-queue.adapter.ts
    ├── database/              # Drizzle schemas, migrations
    │   ├── schema.ts
    │   └── migrations/
    ├── http/                  # HTTP Layer (framework-specific)
    │   ├── server/            # HttpServer adapter (Hono implementation)
    │   │   └── hono-http-server.adapter.ts
    │   ├── middleware/        # HTTP middleware
    │   │   └── {name}.middleware.ts
    │   └── plugins/           # Hono plugins (CORS, compression, etc.)
    │       └── {name}.plugin.ts
    └── container/             # DI Container
        ├── main.ts
        ├── tokens.ts
        └── register-*.ts
```

### Frontend Structure (Feature-Based)

```
features/{feature-name}/
├── components/                # Pure UI (no stores, no gateways)
│   └── {component}.tsx
├── pages/                    # Orchestration (use cases)
│   └── {page}.tsx
├── stores/                   # Zustand (framework-agnostic, testable)
│   └── {name}.store.ts
├── gateways/                 # Interface + HTTP + Fake
│   ├── {name}.gateway.ts        # Interface
│   ├── {name}.gateway.http.ts   # HTTP implementation
│   └── {name}.gateway.fake.ts   # Fake for tests
├── hooks/                    # Custom hooks (optional)
│   └── use-{name}.ts
└── types/                    # TypeScript types
    └── {name}.types.ts
```

---

## 📐 Data Model

### Entities

**Entity: {Name}**

- **Attributes:**
  - `id`: {Type} - {Description}
  - `{field}`: {Type} - {Description}
- **Relationships:**
  - {Relationship to other entity}
- **Invariants:**
  - {Business rule that must always hold}

**Entity: {Name}**

- **Attributes:**
  - `id`: {Type} - {Description}
  - `{field}`: {Type} - {Description}
- **Relationships:**
  - {Relationship to other entity}

### Value Objects

**Value Object: {Name}**

- **Properties:**
  - `{field}`: {Type}
- **Validation Rules:**
  - {Rule}
- **Immutability:** ✅

### Aggregates

**Aggregate: {Name}**

- **Root Entity:** {Entity Name}
- **Contains:** {List of entities/VOs}
- **Invariants:**
  - {Business rule enforced by aggregate}

### Database Schema (Drizzle)

```typescript
// Example schema
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Add more tables as needed
```

---

## 🔌 API Design

### REST Endpoints

| Method | Path                     | Description   | Request Body | Response         | Auth |
| ------ | ------------------------ | ------------- | ------------ | ---------------- | ---- |
| POST   | `/api/v1/{resource}`     | {Description} | {Schema ref} | {Schema ref}     | JWT  |
| GET    | `/api/v1/{resource}`     | {Description} | -            | {Schema ref}     | JWT  |
| GET    | `/api/v1/{resource}/:id` | {Description} | -            | {Schema ref}     | JWT  |
| PUT    | `/api/v1/{resource}/:id` | {Description} | {Schema ref} | {Schema ref}     | JWT  |
| DELETE | `/api/v1/{resource}/:id` | {Description} | -            | `204 No Content` | JWT  |

### Request/Response Schemas (Zod)

```typescript
// Example schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

// Add more schemas as needed
```

### Error Responses

```typescript
// Standard error format
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## 🚦 Architecture Gates Validation

### Gate 1: Simplicity Gate ✅

- [ ] Using ≤3 projects?
- [ ] No future-proofing features?
- [ ] No premature abstractions?
- [ ] Following Rule of Three before DRY?

**Status:** {PASS / FAIL}

**If FAIL, Justification:**

<!-- Document in "Complexity Tracking" section below -->

---

### Gate 2: Type Safety Gate ✅

- [ ] No `any` types?
- [ ] Type guards for unknown types?
- [ ] Strict mode enabled?

**Status:** {PASS / FAIL}

**If FAIL, Justification:**

<!-- Document in "Complexity Tracking" section below -->

---

### Gate 3: Clean Code Gate ✅

- [ ] Functions < 20 lines?
- [ ] SOLID principles applied?
- [ ] DRY only after Rule of Three?
- [ ] Tell, Don't Ask pattern?
- [ ] Self-documenting code?

**Status:** {PASS / FAIL}

**If FAIL, Justification:**

<!-- Document in "Complexity Tracking" section below -->

---

### Gate 4: Test-First Gate ✅

- [ ] Tests written before implementation?
- [ ] Using real dependencies (not mocks)?
- [ ] Contract tests defined first?
- [ ] Integration tests with real DB?

**Status:** {PASS / FAIL}

**If FAIL, Justification:**

<!-- Document in "Complexity Tracking" section below -->

---

### Gate 5: Clean Architecture Gate (Backend) ✅

- [ ] Domain layer has no dependencies?
- [ ] Dependency flow correct (Infrastructure → Application → Domain)?
- [ ] Interfaces in domain/ports/ (no "I" prefix)?
- [ ] Repository pattern for data access?
- [ ] Constructor injection for dependencies?
- [ ] No business logic in controllers?

**Status:** {PASS / FAIL}

**If FAIL, Justification:**

<!-- Document in "Complexity Tracking" section below -->

---

### Gate 6: Feature-Based Architecture Gate (Frontend) ✅

- [ ] Components are pure UI?
- [ ] Pages orchestrate via stores/gateways?
- [ ] Stores are framework-agnostic?
- [ ] All gateways have Interface + HTTP + Fake?
- [ ] Gateways injected via Context?

**Status:** {PASS / FAIL}

**If FAIL, Justification:**

<!-- Document in "Complexity Tracking" section below -->

---

### Gate 7: Naming Conventions Gate ✅

- [ ] Files use kebab-case?
- [ ] Classes use PascalCase with type suffix?
- [ ] Functions use camelCase?
- [ ] Constants use SCREAMING_SNAKE_CASE?
- [ ] Interfaces have semantic names (no "I" prefix)?

**Status:** {PASS / FAIL}

**If FAIL, Justification:**

<!-- Document in "Complexity Tracking" section below -->

---

## 📊 Complexity Tracking

<!-- ONLY fill if any Architecture Gate has violations that must be justified -->

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| {e.g., 4th project}        | {current need}     | {why 3 projects insufficient}        |
| {e.g., Repository pattern} | {specific problem} | {why direct DB access insufficient}  |

---

## 📝 Architecture Decision Records (ADRs)

<!-- Link to detailed ADRs -->

- [ADR-0001: {Decision Title}](../adr/ADR-0001-{decision-name}.md)
- [ADR-0002: {Decision Title}](../adr/ADR-0002-{decision-name}.md)

**Summary of Key Decisions:**

1. **{Decision}**: {Brief rationale}
2. **{Decision}**: {Brief rationale}

---

## 🔄 Data Flow

<!-- Describe key data flows through the system -->

### Example Flow: Create User

```
1. HTTP Request → Infrastructure Layer - HTTP (Controller)
2. Controller validates input (Zod schema)
3. Controller calls Application Layer (Use Case)
4. Use Case coordinates Domain Layer (Entity + Repository Port)
5. Infrastructure Layer (Repository Implementation) persists to DB
6. Response flows back up the layers
```

---

## 🔐 Security Considerations

**Authentication:**

- {How users authenticate}

**Authorization:**

- {How permissions are checked}

**Data Protection:**

- {How sensitive data is protected}

**Rate Limiting:**

- {Rate limiting strategy}

---

## 📈 Performance Considerations

**Caching Strategy:**

- {What to cache, TTL, invalidation}

**Database Optimization:**

- {Indexes, query patterns}

**Scaling Strategy:**

- {Horizontal/vertical, load balancing}

---

## 📝 Notes

<!-- Additional notes, assumptions, open questions -->

---

## ✓ Design Completeness Checklist

- [ ] All Architecture Gates validated
- [ ] Tech stack decisions documented with rationale
- [ ] System structure defined for backend and frontend
- [ ] Data model complete (entities, VOs, aggregates)
- [ ] API design complete with schemas
- [ ] ADRs created for major decisions
- [ ] Complexity tracking filled if any gates violated
- [ ] Security and performance considerations addressed

---

**Next Step:** Execute `/product-engineering:plan` to create Implementation Plan + Tasks

**Created by:** {Your Name}
**Date:** {YYYY-MM-DD}
**Last Updated:** {YYYY-MM-DD}
**Reviewed by:** {Reviewer(s)}

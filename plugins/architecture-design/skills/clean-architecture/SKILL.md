---
name: clean-architecture
description: Clean Architecture principles including layered architecture, dependency rule, and domain-driven design patterns. **ALWAYS use when working on backend code, ESPECIALLY when creating files, deciding file locations, or organizing layers (domain/application/infrastructure with HTTP).** Use proactively to ensure proper layer separation and dependency flow. Examples - "create entity", "add repository", "where should this file go", "clean architecture", "layered architecture", "use case", "repository pattern", "domain entities", "file location", "layer organization".
---

You are an expert in Clean Architecture and Domain-Driven Design. You guide developers to structure applications with clear boundaries, testable business logic, and maintainable code that follows the Dependency Rule.

## When to Engage

You should proactively assist when:

- Structuring a new project or module
- Designing use cases or application services
- Creating domain entities and value objects
- Implementing repository patterns
- Separating concerns across layers
- User asks about Clean Architecture or DDD

## Core Principles

### The Dependency Rule

**Rule**: Dependencies must point inward, toward the domain

```
┌─────────────────────────────────────────┐
│         Infrastructure Layer            │  ← External concerns
│  (DB, HTTP, Queue, Cache, External APIs)│     (Frameworks, Tools)
└────────────────┬────────────────────────┘
                 │ depends on ↓
┌────────────────▼────────────────────────┐
│         Application Layer               │  ← Use Cases
│  (Use Cases, DTOs, Application Services)│     (Business Rules)
└────────────────┬────────────────────────┘
                 │ depends on ↓
┌────────────────▼─────────────────────────┐
│           Domain Layer                   │  ← Core Business
│  (Entities, Value Objects, Domain Rules) │     (Pure, Framework-free)
└──────────────────────────────────────────┘
```

**Key Points:**

- Domain layer has NO dependencies (pure business logic)
- Application layer depends ONLY on Domain
- Infrastructure layer depends on Application and Domain

### Benefits

1. **Independence**: Business logic doesn't depend on frameworks
2. **Testability**: Core logic tested without databases or HTTP
3. **Flexibility**: Easy to swap implementations (Postgres → MongoDB)
4. **Maintainability**: Clear boundaries and responsibilities

## Layer Structure

### 1. Domain Layer (Core)

**Purpose**: Pure business logic, no external dependencies

**Contains:**

- Entities (business objects with identity)
- Value Objects (immutable objects without identity)
- Ports (interface contracts - NO "I" prefix)
- Domain Events
- Domain Services (when logic doesn't fit in entities)
- Domain Exceptions

**Rules:**

- ✅ NO dependencies on other layers
- ✅ NO framework dependencies
- ✅ Framework-agnostic
- ✅ Pure TypeScript/JavaScript

**Example Structure:**

```
src/domain/
├── entities/
│   ├── user.entity.ts
│   └── order.entity.ts
├── value-objects/
│   ├── email.value-object.ts
│   ├── money.value-object.ts
│   └── uuidv7.value-object.ts
├── ports/
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   └── order.repository.ts
│   ├── cache.service.ts
│   └── logger.service.ts
├── events/
│   ├── user-created.event.ts
│   └── order-placed.event.ts
├── services/
│   └── pricing.service.ts
└── exceptions/
    ├── user-not-found.exception.ts
    └── invalid-order.exception.ts
```

**Key Concepts:**

- **Entities** have identity and lifecycle (User, Order)
- **Value Objects** are immutable and compared by value (Email, Money)
- **Ports** are interface contracts (NO "I" prefix) that define boundaries
- **Domain behavior** lives in entities, not in services

**For complete implementation examples of Entities, Value Objects, and Repositories with Drizzle ORM, see `backend-engineer` skill**

### 2. Application Layer (Use Cases)

**Purpose**: Orchestrate business logic, implement use cases

**Contains:**

- Use Cases / Application Services
- DTOs (Data Transfer Objects)
- Mappers (Entity ↔ DTO)

**Rules:**

- ✅ Depends ONLY on Domain layer
- ✅ Orchestrates entities and value objects
- ✅ NO direct infrastructure dependencies (use interfaces)
- ✅ Stateless services

**Example Structure:**

```
src/application/
├── use-cases/
│   ├── create-user.use-case.ts
│   ├── update-user-profile.use-case.ts
│   └── deactivate-user.use-case.ts
├── dtos/
│   ├── create-user.dto.ts
│   └── user-response.dto.ts
└── mappers/
    └── user.mapper.ts
```

**Use Case Responsibilities:**

1. **Validate** business rules
2. **Orchestrate** domain objects (entities, value objects)
3. **Persist** through repositories (ports)
4. **Coordinate** side effects (events, notifications)
5. **Return** DTOs (never expose domain entities)

**Port (Interface) Example:**

```typescript
// ✅ Port in Domain layer (domain/ports/repositories/user.repository.ts)
// NO "I" prefix
export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
}

// Implementation in Infrastructure layer
```

**For complete Use Case examples with DTOs, Mappers, and orchestration patterns, see `backend-engineer` skill**

### 3. Infrastructure Layer (Adapters)

**Purpose**: Implement technical details and external dependencies

**Contains:**

- Repository implementations (implements domain/ports/repositories)
- Adapters (external service implementations)
- Database access (Drizzle ORM)
- HTTP setup (Hono app, middleware, OpenAPI)
- Configuration

**Rules:**

- ✅ Implements interfaces defined in Domain layer (ports)
- ✅ Contains framework-specific code
- ✅ Handles technical concerns
- ✅ NO business logic

**Example Structure:**

```
src/infrastructure/
├── controllers/
│   ├── user.controller.ts
│   ├── order.controller.ts
│   └── schemas/
│       ├── user.schema.ts
│       └── order.schema.ts
├── repositories/
│   ├── user.repository.impl.ts
│   └── order.repository.impl.ts
├── adapters/
│   ├── cache/
│   │   └── redis-cache.adapter.ts
│   ├── logger/
│   │   └── winston-logger.adapter.ts
│   └── queue/
│       ├── sqs-queue.adapter.ts
│       ├── localstack-sqs.adapter.ts
│       └── fake-queue.adapter.ts
├── http/
│   ├── server/
│   │   └── hono-http-server.adapter.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error-handler.middleware.ts
│   └── plugins/
│       ├── cors.plugin.ts
│       └── openapi.plugin.ts
├── database/
│   ├── drizzle/
│   │   ├── schema/
│   │   │   └── users.schema.ts
│   │   └── migrations/
│   └── connection.ts
└── container/
    └── main.ts
```

**Infrastructure Layer Responsibilities:**

- **Repositories**: Implement ports from `domain/ports/repositories/` using Drizzle ORM
- **Adapters**: Implement external service ports (Cache, Logger, Queue)
- **Controllers**: Self-registering HTTP controllers (thin layer, delegate to use cases)
  - Schemas: Zod validation schemas for HTTP contracts (requests/responses)
- **HTTP Layer**: Framework-specific HTTP handling
  - Server: Hono adapter (implements HttpServer port)
  - Middleware: HTTP middleware (auth, validation, error handling)
  - Plugins: Hono plugins (CORS, compression, OpenAPI, etc.)
- **Database**: Drizzle schemas, migrations, connection management
- **Container**: DI Container (composition root)
- **NO business logic**: Only technical implementation details

**Repository Pattern:**

```typescript
// Port in domain/ports/repositories/user.repository.ts
export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | undefined>;
}

// Implementation in infrastructure/repositories/user.repository.impl.ts
export class UserRepositoryImpl implements UserRepository {
  // Drizzle ORM implementation
}
```

**For complete Repository and Adapter implementations with Drizzle ORM, Redis, and other infrastructure examples, see `backend-engineer` skill**

### 4. HTTP Layer (Framework-Specific, in Infrastructure)

**Purpose**: Handle HTTP requests, WebSocket connections, CLI commands

**Location**: `infrastructure/http/`

**Contains:**

- Server: Hono adapter (implements HttpServer port)
- Controllers: Self-registering HTTP controllers (route registration + handlers)
- Schemas: Zod validation for requests/responses
- Middleware: HTTP middleware (auth, validation, error handling)
- Plugins: Hono plugins (CORS, compression, OpenAPI, etc.)

**Rules:**

- ✅ Part of Infrastructure layer (HTTP is technical detail)
- ✅ Depends on Application layer (Use Cases) and HttpServer port
- ✅ Thin layer - delegates to Use Cases
- ✅ NO business logic
- ✅ Controllers auto-register routes in constructor

**Example Structure:**

```
src/infrastructure/http/
├── server/
│   └── hono-http-server.adapter.ts
├── controllers/
│   ├── user.controller.ts
│   └── order.controller.ts
├── schemas/
│   ├── user.schema.ts
│   └── order.schema.ts
├── middleware/
│   ├── auth.middleware.ts
│   └── error-handler.middleware.ts
└── plugins/
    ├── cors.plugin.ts
    └── openapi.plugin.ts
```

**Controller Responsibilities:**

- **Thin layer**: Validation + Delegation to Use Cases
- **NO business logic**: Controllers should be lightweight
- **Request validation**: Use Zod schemas at entry point
- **Response formatting**: Return DTOs (never domain entities)
- **Self-registering**: Controllers register routes in constructor via HttpServer port

**Controller Pattern (Self-Registering):**

```typescript
// infrastructure/http/controllers/user.controller.ts

/**
 * UserController
 *
 * Infrastructure layer (HTTP) - handles HTTP requests.
 * Thin layer that delegates to use cases.
 *
 * Pattern: Constructor Injection + Auto-registration
 */
import type { HttpServer } from "@/domain/ports/http-server";
import { HttpMethod } from "@/domain/ports/http-server";
import type { CreateUserUseCase } from "@/application/use-cases/create-user.use-case";

export class UserController {
  constructor(
    private readonly httpServer: HttpServer, // ✅ HttpServer port injected
    private readonly createUserUseCase: CreateUserUseCase // ✅ Use case injected
  ) {
    this.registerRoutes(); // ✅ Auto-register routes in constructor
  }

  private registerRoutes(): void {
    // POST /users - Create new user
    this.httpServer.route(HttpMethod.POST, "/users", async (context) => {
      try {
        const dto = context.req.valid("json"); // Validated by middleware
        const user = await this.createUserUseCase.execute(dto);
        return context.json(user, 201);
      } catch (error) {
        console.error("Error creating user:", error);
        return context.json({ error: "Internal server error" }, 500);
      }
    });
  }
}
```

**HttpServer Port (Domain Layer):**

```typescript
// domain/ports/http-server.ts
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export type HttpHandler = (context: unknown) => Promise<Response | unknown>;

export interface HttpServer {
  route(method: HttpMethod, url: string, handler: HttpHandler): void;
  listen(port: number): void;
}
```

**Key Benefits:**

- ✅ **Framework-agnostic domain** - HttpServer port in domain layer
- ✅ **Testable** - Easy to mock HttpServer for testing controllers
- ✅ **DI-friendly** - Controllers resolve via container
- ✅ **Auto-registration** - Controllers register themselves in constructor
- ✅ **Thin controllers** - Only route registration + delegation
- ✅ **Clean separation** - No routes/ folder needed

**For complete HttpServer implementation (Hono adapter), Zod validation, and middleware patterns, see `backend-engineer` skill**

## Dependency Injection

**Use custom DI Container (NO external libraries like InversifyJS or TSyringe)**

### Why Dependency Injection?

- Enables testability (inject mocks)
- Follows Dependency Inversion Principle
- Centralized dependency management
- Supports different lifetimes (singleton, scoped, transient)

### DI Principles in Clean Architecture

**Constructor Injection:**

```typescript
// ✅ Use cases depend on abstractions (ports), not implementations
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository, // Port from domain/ports/
    private readonly passwordHasher: PasswordHasher, // Port from domain/ports/
    private readonly emailService: EmailService // Port from domain/ports/
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Orchestrate domain logic using injected dependencies
  }
}
```

**Lifetimes:**

- **singleton**: Core infrastructure (config, database, logger, repositories)
- **scoped**: Per-request instances (use cases, controllers)
- **transient**: New instance every time (rarely used)

**For complete DI Container implementation with Symbol-based tokens, registration patterns, and Hono integration, see `backend-engineer` skill**

## Testing Strategy

### Domain Layer Tests (Pure Unit Tests)

```typescript
// ✅ Easy to test - no dependencies
import { describe, expect, it } from "bun:test";
import { User } from "@/domain/entities/user.entity";
import { Email } from "@/domain/value-objects/email.value-object";
import { UserId } from "@/domain/value-objects/user-id.value-object";

describe("User Entity", () => {
  it("should deactivate user", () => {
    const userId = UserId.generate();
    const email = Email.create("user@example.com");
    const user = new User(userId, email, "John Doe", "hashed_password");

    user.deactivate();

    expect(user.isActive).toBe(false);
  });

  it("should throw error when deactivating already inactive user", () => {
    const userId = UserId.generate();
    const email = Email.create("user@example.com");
    const user = new User(userId, email, "John Doe", "hashed_password");
    user.deactivate();

    expect(() => user.deactivate()).toThrow();
  });
});
```

### Application Layer Tests (With Mocks)

```typescript
// ✅ Test use case with mocked ports
import { describe, expect, it, mock } from "bun:test";
import { CreateUserUseCase } from "@/application/use-cases/create-user.use-case";

describe("CreateUserUseCase", () => {
  it("should create user successfully", async () => {
    // Arrange - Mock dependencies
    const mockRepository = {
      save: mock(async () => {}),
      findByEmail: mock(async () => undefined),
    };

    const mockPasswordHasher = {
      hash: mock(async (password: string) => `hashed_${password}`),
    };

    const mockEmailService = {
      sendWelcomeEmail: mock(async () => {}),
    };

    const useCase = new CreateUserUseCase(
      mockRepository as any,
      mockPasswordHasher as any,
      mockEmailService as any
    );

    const dto = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    };

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith("password123");
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(result.email).toBe("test@example.com");
  });
});
```

## Common Patterns

### Repository Pattern

```typescript
// Port (Domain layer - domain/ports/repositories/order.repository.ts)
// NO "I" prefix
export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | undefined>;
  findByUserId(userId: UserId): Promise<Order[]>;
}

// Adapter (Infrastructure layer - infrastructure/repositories/order.repository.impl.ts)
export class OrderRepositoryImpl implements OrderRepository {
  async save(order: Order): Promise<void> {
    // Drizzle ORM implementation
  }
}
```

### Domain Service

```typescript
// ✅ Domain service when logic involves multiple entities
export class PricingService {
  calculateOrderTotal(order: Order, discountRules: DiscountRule[]): Money {
    let total = Money.zero();

    for (const item of order.items) {
      total = total.add(item.price.multiply(item.quantity));
    }

    for (const rule of discountRules) {
      if (rule.appliesTo(order)) {
        total = total.subtract(rule.calculateDiscount(total));
      }
    }

    return total;
  }
}
```

### Event-Driven Communication

```typescript
// Domain Event
export class UserCreatedEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly occurredAt: Date = new Date()
  ) {}
}

// Use Case publishes event
export class CreateUserUseCase {
  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // ... create user ...

    await this.eventBus.publish(new UserCreatedEvent(user.id, user.email));

    return UserMapper.toDto(user);
  }
}
```

## Anti-Patterns to Avoid

### ❌ Anemic Domain Model

```typescript
// ❌ Bad - Just data, no behavior
export class User {
  id: string;
  email: string;
  isActive: boolean;
}

// Business logic in service (wrong layer)
export class UserService {
  deactivateUser(user: User): void {
    user.isActive = false;
  }
}
```

**Fix:** Move behavior into entity:

```typescript
// ✅ Good - Rich domain model
export class User {
  deactivate(): void {
    if (!this._isActive) {
      throw new UserAlreadyInactiveError(this._id);
    }
    this._isActive = false;
  }
}
```

### ❌ Domain Layer Depending on Infrastructure

```typescript
// ❌ Bad - Domain depends on infrastructure
import { db } from "@/infrastructure/database";

export class User {
  async save(): Promise<void> {
    await db.insert(users).values(this); // WRONG!
  }
}
```

**Fix:** Keep domain pure, use repository:

```typescript
// ✅ Good - Pure domain, repository handles persistence
export class User {
  // Pure domain logic, no database access
}

// Repository in infrastructure/repositories/
export class UserRepositoryImpl implements UserRepository {
  async save(user: User): Promise<void> {
    await db.insert(users).values(...);
  }
}
```

### ❌ Fat Controllers

```typescript
// ❌ Bad - Business logic in controller
app.post('/users', async (c) => {
  const data = c.req.valid('json');

  // Validation
  if (!data.email.includes('@')) {
    return c.json({ error: 'Invalid email' }, 400);
  }

  // Check if exists
  const exists = await db.select()...;

  // Hash password
  const hashed = await bcrypt.hash(data.password, 10);

  // Save
  await db.insert(users).values(...);

  // Send email
  await sendgrid.send(...);

  return c.json(user, 201);
});
```

**Fix:** Delegate to use case:

```typescript
// ✅ Good - Thin controller
app.post("/users", zValidator("json", CreateUserSchema), async (c) => {
  const dto = c.req.valid("json");
  const user = await createUserUseCase.execute(dto);
  return c.json(user, 201);
});
```

## Migration Strategy

### From Monolith to Clean Architecture

1. **Start with Use Cases** - Extract business logic into use cases
2. **Create Domain Models** - Move entities and value objects to domain layer
3. **Define Ports** - Create interfaces in application layer
4. **Implement Adapters** - Move infrastructure code behind interfaces
5. **Refactor Controllers** - Make them thin, delegate to use cases

## Best Practices

### Do:

- ✅ Keep domain layer pure (no external dependencies)
- ✅ Use interfaces (ports) for all external dependencies
- ✅ Implement rich domain models with behavior
- ✅ Make use cases orchestrate domain logic
- ✅ Test domain logic without infrastructure
- ✅ Use dependency injection at composition root
- ✅ Keep controllers thin (validation + delegation)

### Don't:

- ❌ Put business logic in controllers or repositories
- ❌ Let domain layer depend on infrastructure
- ❌ Create anemic domain models
- ❌ Mix layers (e.g., use Drizzle in domain layer)
- ❌ Skip interfaces (ports) for infrastructure
- ❌ Make use cases depend on concrete implementations

## Remember

- **The Dependency Rule is sacred** - Always point inward
- **Domain is the core** - Everything revolves around it
- **Test the domain first** - It's the most important part
- **Interfaces enable flexibility** - Easy to swap implementations
- **Clean Architecture is about maintainability** - Not perfection

---
name: clean-architecture
description: Clean Architecture principles including layered architecture, dependency rule, and domain-driven design patterns. Use when structuring projects, designing use cases, or implementing domain logic. Examples - "clean architecture", "layered architecture", "use case", "repository pattern", "domain entities".
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
│         Infrastructure Layer             │  ← External concerns
│  (DB, HTTP, Queue, Cache, External APIs) │     (Frameworks, Tools)
└────────────────┬────────────────────────┘
                 │ depends on ↓
┌────────────────▼────────────────────────┐
│         Application Layer                │  ← Use Cases
│  (Use Cases, DTOs, Application Services) │     (Business Rules)
└────────────────┬────────────────────────┘
                 │ depends on ↓
┌────────────────▼────────────────────────┐
│           Domain Layer                   │  ← Core Business
│  (Entities, Value Objects, Domain Rules) │     (Pure, Framework-free)
└──────────────────────────────────────────┘
```

**Key Points:**

- Domain layer has NO dependencies (pure business logic)
- Application layer depends ONLY on Domain
- Infrastructure layer depends on Application and Domain
- Presentation layer depends on Application (through interfaces)

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

**Entity Example:**

```typescript
// ✅ Good - Pure domain entity
export class User {
  private _isActive: boolean = true;
  private _createdAt: Date;

  constructor(
    private readonly _id: UserId,
    private _email: Email,
    private _name: string,
    private _hashedPassword: string
  ) {
    this._createdAt = new Date();
  }

  // Domain behavior
  deactivate(): void {
    if (!this._isActive) {
      throw new UserAlreadyInactiveError(this._id);
    }
    this._isActive = false;
  }

  changeEmail(newEmail: Email): void {
    if (this._email.equals(newEmail)) {
      return;
    }
    this._email = newEmail;
  }

  // Getters (no setters - controlled behavior)
  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get isActive(): boolean {
    return this._isActive;
  }
}
```

**Value Object Example:**

```typescript
// ✅ Good - Immutable value object
export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    if (!value) {
      throw new InvalidEmailError("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new InvalidEmailError(`Invalid email format: ${value}`);
    }

    return new Email(value.toLowerCase());
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
```

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

**Use Case Example:**

```typescript
// ✅ Good - Use case orchestrates domain logic
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository, // Port from domain/ports/repositories/
    private readonly passwordHasher: PasswordHasher, // Port from domain/ports/
    private readonly emailService: EmailService // Port from domain/ports/
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // 1. Validate (or let DTO schema handle this)
    await this.ensureEmailNotTaken(dto.email);

    // 2. Create domain objects
    const email = Email.create(dto.email);
    const userId = UserId.generate();
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const user = new User(userId, email, dto.name, hashedPassword);

    // 3. Persist (through port/interface)
    await this.userRepository.save(user);

    // 4. Side effects
    await this.emailService.sendWelcomeEmail(email);

    // 5. Return DTO
    return UserMapper.toDto(user);
  }

  private async ensureEmailNotTaken(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsError(email);
    }
  }
}
```

**Port (Interface) Example:**

```typescript
// ✅ Good - Port in Domain layer (domain/ports/repositories/user.repository.ts)
// NO "I" prefix
export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  update(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}

// Implementation in Infrastructure layer (infrastructure/repositories/user.repository.impl.ts)
```

**DTO Example:**

```typescript
// ✅ Good - DTO with Zod validation
import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}
```

**Mapper Example:**

```typescript
// ✅ Good - Mapper converts between layers
export class UserMapper {
  static toDto(user: User): UserResponseDto {
    return {
      id: user.id.toString(),
      email: user.email.toString(),
      name: user.name,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };
  }

  static toDomain(dto: CreateUserDto, hashedPassword: string): User {
    const userId = UserId.generate();
    const email = Email.create(dto.email);
    return new User(userId, email, dto.name, hashedPassword);
  }
}
```

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
├── repositories/
│   ├── user.repository.impl.ts
│   └── order.repository.impl.ts
├── adapters/
│   ├── cache.service.impl.ts
│   ├── logger.service.impl.ts
│   └── queue.adapter.ts
├── database/
│   ├── drizzle/
│   │   ├── schema/
│   │   │   └── users.schema.ts
│   │   └── migrations/
│   └── connection.ts
├── http/
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error-handler.middleware.ts
│   └── openapi/
│       └── swagger.config.ts
└── config/
    ├── env.config.ts
    └── env.schema.ts
```

**Repository Implementation Example:**

```typescript
// ✅ Good - Repository implements port from domain/ports/repositories/
// File: infrastructure/repositories/user.repository.impl.ts
import { eq } from "drizzle-orm";
import type { UserRepository } from "@/domain/ports/repositories/user.repository";
import type { User } from "@/domain/entities/user.entity";
import { db } from "../database/drizzle/connection";
import { users } from "../database/drizzle/schema/users.schema";

export class UserRepositoryImpl implements UserRepository {
  async save(user: User): Promise<void> {
    await db.insert(users).values({
      id: user.id.toString(),
      email: user.email.toString(),
      name: user.name,
      hashedPassword: user.hashedPassword,
      isActive: user.isActive,
      createdAt: user.createdAt,
    });
  }

  async findById(id: UserId): Promise<User | undefined> {
    const row = await db
      .select()
      .from(users)
      .where(eq(users.id, id.toString()))
      .limit(1);

    if (!row[0]) return undefined;

    return this.toDomain(row[0]);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const row = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!row[0]) return undefined;

    return this.toDomain(row[0]);
  }

  private toDomain(row: typeof users.$inferSelect): User {
    const userId = UserId.fromString(row.id);
    const email = Email.create(row.email);
    // Reconstruct domain entity from database row
    return new User(userId, email, row.name, row.hashedPassword);
  }
}
```

**Adapter Implementation Example (External Service):**

```typescript
// ✅ Good - Adapter implements port from domain/ports/
// File: infrastructure/adapters/cache.service.impl.ts
import { Redis } from "ioredis";
import type { CacheService } from "@/domain/ports/cache.service";

export class CacheServiceImpl implements CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  }

  async set(key: string, value: string, expirationInSeconds?: number): Promise<void> {
    if (expirationInSeconds) {
      await this.redis.set(key, value, "EX", expirationInSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async flushAll(): Promise<void> {
    await this.redis.flushall();
  }
}
```

### 4. Presentation Layer (Controllers/Routes)

**Purpose**: Handle HTTP requests, WebSocket connections, CLI commands

**Contains:**

- Routes (Hono route registration)
- Controllers (route handlers)
- Schemas (Zod validation for requests/responses)

**Rules:**

- ✅ Depends on Application layer (Use Cases)
- ✅ Handles HTTP/WebSocket/CLI specifics
- ✅ Thin layer - delegates to Use Cases
- ✅ NO business logic

**Example Structure:**

```
src/presentation/
├── routes/
│   ├── user.routes.ts
│   └── order.routes.ts
├── controllers/
│   ├── user.controller.ts
│   └── order.controller.ts
└── schemas/
    ├── user.schema.ts
    └── order.schema.ts
```

**Schema Example (Zod):**

```typescript
// ✅ Good - Validation schema
// File: presentation/schemas/user.schema.ts
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
});

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
});
```

**Controller Example:**

```typescript
// ✅ Good - Thin controller delegates to use case
// File: presentation/controllers/user.controller.ts
import type { Context } from "hono";
import { CreateUserUseCase } from "@/application/use-cases/create-user.use-case";

export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async create(c: Context) {
    const dto = c.req.valid("json"); // Validated by route middleware
    const user = await this.createUserUseCase.execute(dto);
    return c.json(user, 201);
  }

  async getById(c: Context) {
    const { id } = c.req.param();
    const user = await this.getUserUseCase.execute(id);
    return c.json(user);
  }
}
```

**Routes Example:**

```typescript
// ✅ Good - Route registration with validation
// File: presentation/routes/user.routes.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { UserController } from "../controllers/user.controller";
import { createUserSchema } from "../schemas/user.schema";

export function registerUserRoutes(app: Hono, controller: UserController) {
  app.post("/users", zValidator("json", createUserSchema), (c) => controller.create(c));
  app.get("/users/:id", (c) => controller.getById(c));
}
```

## Dependency Injection Container

**Use custom DI Container (NO external libraries like InversifyJS or TSyringe)**

### Why Custom Container?

- Type-safe without decorators
- Simple, focused implementation
- No external dependencies
- Full control over lifetimes
- Easy to test and debug

### Container Implementation

```typescript
// ✅ Custom Container - infrastructure/container/container.ts
export type Lifetime = 'singleton' | 'scoped' | 'transient'
export type Token<T> = symbol & { readonly __type?: T }

export interface Provider<T> {
  lifetime: Lifetime
  useValue?: T
  useFactory?: (c: Container) => T
}

export class Container {
  private readonly registry: Map<Token<unknown>, Provider<unknown>>
  private readonly singletons: Map<Token<unknown>, unknown>
  private readonly scopedCache: Map<Token<unknown>, unknown>

  static createRoot(): Container {
    return new Container(new Map(), new Map(), new Map())
  }

  createScope(): Container {
    return new Container(this.registry, this.singletons, new Map())
  }

  register<T>(token: Token<T>, provider: Provider<T>): void {
    if (this.registry.has(token as Token<unknown>)) {
      throw new Error(`Provider already registered for token: ${token.description}`)
    }
    this.registry.set(token as Token<unknown>, provider as Provider<unknown>)
  }

  resolve<T>(token: Token<T>): T {
    const provider = this.registry.get(token as Token<unknown>)
    if (!provider) {
      throw new Error(`No provider registered for token: ${token.description}`)
    }

    // useValue
    if ('useValue' in provider && provider.useValue !== undefined) {
      return provider.useValue as T
    }

    // singleton cache
    if (provider.lifetime === 'singleton') {
      if (this.singletons.has(token as Token<unknown>)) {
        return this.singletons.get(token as Token<unknown>) as T
      }
      const instance = (provider as Provider<T>).useFactory!(this)
      this.singletons.set(token as Token<unknown>, instance)
      return instance
    }

    // scoped cache
    if (provider.lifetime === 'scoped') {
      if (this.scopedCache.has(token as Token<unknown>)) {
        return this.scopedCache.get(token as Token<unknown>) as T
      }
      const instance = (provider as Provider<T>).useFactory!(this)
      this.scopedCache.set(token as Token<unknown>, instance)
      return instance
    }

    // transient
    return (provider as Provider<T>).useFactory!(this)
  }
}
```

### Tokens (Symbol-based)

```typescript
// ✅ Type-safe tokens - infrastructure/container/tokens.ts
import type { UserRepository } from "@/domain/ports/repositories/user.repository";
import type { CacheService } from "@/domain/ports/cache.service";
import type { CreateUserUseCase } from "@/application/use-cases/create-user.use-case";
import type { UserController } from "@/presentation/controllers/user.controller";

export const TOKENS = {
  // Core Infrastructure
  Logger: Symbol('Logger') as Token<Logger>,
  Config: Symbol('Config') as Token<EnvConfig>,
  DatabaseConnection: Symbol('DatabaseConnection') as Token<DatabaseConnection>,

  // Repositories (from domain/ports/repositories/)
  UserRepository: Symbol('UserRepository') as Token<UserRepository>,
  OrderRepository: Symbol('OrderRepository') as Token<OrderRepository>,

  // Services (from domain/ports/)
  CacheService: Symbol('CacheService') as Token<CacheService>,
  LoggerService: Symbol('LoggerService') as Token<LoggerService>,

  // Use Cases
  CreateUserUseCase: Symbol('CreateUserUseCase') as Token<CreateUserUseCase>,
  UpdateUserUseCase: Symbol('UpdateUserUseCase') as Token<UpdateUserUseCase>,

  // Controllers
  UserController: Symbol('UserController') as Token<UserController>,
} as const
```

### Lifetimes

**singleton**: Single instance for entire application

- Core infrastructure (config, database, logger)
- Repositories (stateless, thread-safe)
- Adapters (cache, queue clients)

**scoped**: Single instance per request/operation

- Use Cases (request-specific logic)
- Controllers (if needed)

**transient**: New instance every time

- Rarely used
- Only when state must not be shared

### Registration by Layer

```typescript
// ✅ Infrastructure - infrastructure/container/registers/register.infrastructure.ts
export function registerInfrastructure(container: Container): void {
  container.register(TOKENS.Logger, {
    lifetime: 'singleton',
    useValue: logger, // Direct value
  })

  container.register(TOKENS.DatabaseConnection, {
    lifetime: 'singleton',
    useValue: dbConnection,
  })

  container.register(TOKENS.Config, {
    lifetime: 'singleton',
    useValue: Config.getInstance().env,
  })
}

// ✅ Repositories - infrastructure/container/registers/register.repositories.ts
export function registerRepositories(container: Container): void {
  container.register(TOKENS.UserRepository, {
    lifetime: 'singleton',
    useFactory: () => new UserRepositoryImpl(
      container.resolve(TOKENS.DatabaseConnection)
    )
  })

  container.register(TOKENS.OrderRepository, {
    lifetime: 'singleton',
    useFactory: () => new OrderRepositoryImpl(
      container.resolve(TOKENS.DatabaseConnection)
    )
  })
}

// ✅ Use Cases - infrastructure/container/registers/register.use-cases.ts
export function registerUseCases(container: Container): void {
  container.register(TOKENS.CreateUserUseCase, {
    lifetime: 'scoped', // Per-request
    useFactory: (scope) => new CreateUserUseCase(
      scope.resolve(TOKENS.UserRepository),
      scope.resolve(TOKENS.CacheService),
      scope.resolve(TOKENS.Logger)
    )
  })

  container.register(TOKENS.UpdateUserUseCase, {
    lifetime: 'scoped',
    useFactory: (scope) => new UpdateUserUseCase(
      scope.resolve(TOKENS.UserRepository)
    )
  })
}

// ✅ Controllers - infrastructure/container/registers/register.controllers.ts
export function registerControllers(container: Container): void {
  container.register(TOKENS.UserController, {
    lifetime: 'singleton',
    useFactory: (scope) => new UserController(
      scope.resolve(TOKENS.CreateUserUseCase),
      scope.resolve(TOKENS.UpdateUserUseCase)
    )
  })
}
```

### Composition Root

```typescript
// ✅ Main composition root - infrastructure/container/main.ts
export function createRootContainer(): Container {
  const c = Container.createRoot()

  // Register in order (dependencies first)
  registerInfrastructure(c)    // 1. Core services
  registerRepositories(c)       // 2. Repositories
  registerUseCases(c)           // 3. Use cases
  registerControllers(c)        // 4. Controllers

  return c
}

// Singleton root container
let rootContainer: Container | null = null

export function getAppContainer(): Container {
  if (!rootContainer) {
    rootContainer = createRootContainer()
  }
  return rootContainer
}

// Create scoped container per HTTP request
export function createRequestScope(root: Container): Container {
  return root.createScope()
}

// Test helper
export function resetAppContainerForTests(): void {
  rootContainer = null
}
```

### Usage in Hono Routes

```typescript
// ✅ Using container in routes
import { Hono } from "hono";
import { getAppContainer, createRequestScope } from "@/infrastructure/container/main";
import { TOKENS } from "@/infrastructure/container/tokens";

const app = new Hono();

// Middleware to create scoped container per request
app.use('*', async (c, next) => {
  const rootContainer = getAppContainer()
  const requestScope = createRequestScope(rootContainer)
  c.set('container', requestScope) // Store in context
  await next()
})

// Use in routes
app.post("/users", async (c) => {
  const container = c.get('container') as Container
  const useCase = container.resolve(TOKENS.CreateUserUseCase)

  const dto = await c.req.json()
  const result = await useCase.execute(dto)

  return c.json(result, 201)
})
```

### Directory Structure

```
src/infrastructure/container/
├── container.ts                    # Container implementation
├── tokens.ts                       # Symbol-based tokens
├── main.ts                         # Composition root
└── registers/
    ├── register.infrastructure.ts  # Core services
    ├── register.repositories.ts    # Repositories
    ├── register.use-cases.ts       # Use cases (scoped)
    └── register.controllers.ts     # Controllers
```

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

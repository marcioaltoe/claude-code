# Architecture Gates

Our architectural constitution - immutable principles that govern how specifications become code.

These gates act as compile-time checks for architectural decisions. Every design must either pass these gates or explicitly document justified exceptions.

---

## Gate 1: Simplicity Gate

**Principle:** Start simple, add complexity only when proven necessary.

### Rules

**Project Structure:**

- ✅ Maximum 3 projects for initial implementation
- ✅ Additional projects require documented justification in design
- ❌ No future-proofing or speculative architecture

**Abstraction:**

- ✅ Follow Rule of Three before creating abstractions
- ✅ Start with direct implementation
- ❌ No premature optimization or over-engineering

### Validation Questions

- [ ] Using ≤3 projects?
- [ ] No future-proofing features?
- [ ] No unnecessary abstraction layers?
- [ ] Can this be simpler?

### When to Violate

Document in design's "Complexity Tracking" section:

- **Violation:** e.g., "4th project for mobile app"
- **Why Needed:** e.g., "iOS + Android require separate codebases"
- **Simpler Alternative Rejected Because:** e.g., "React Native doesn't meet performance requirements"

---

## Gate 2: Type Safety Gate

**Principle:** Leverage TypeScript's type system for compile-time safety.

### Rules

**TypeScript Usage:**

- ✅ Strict mode enabled in tsconfig.json
- ✅ No `any` types (use `unknown` with type guards)
- ✅ Branded types for domain primitives
- ✅ Discriminated unions for state

**Type Guards:**

```typescript
// ✅ Good: Type guard for unknown
function isUser(data: unknown): data is User {
  return (
    typeof data === "object" && data !== null && "id" in data && "email" in data
  );
}

// ❌ Bad: Using any
function processData(data: any) {
  return data.id; // No type safety
}
```

**Branded Types:**

```typescript
// ✅ Good: Branded type for domain primitive
type UserId = string & { readonly __brand: "UserId" };
type Email = string & { readonly __brand: "Email" };

// ❌ Bad: Primitive obsession
function getUser(id: string, email: string) {}
```

### Validation Questions

- [ ] No `any` types in codebase?
- [ ] Using branded types for domain primitives?
- [ ] Type guards for unknown types?
- [ ] Discriminated unions for complex state?

### When to Violate

Rare exceptions only (e.g., third-party library without types):

- Document in design
- Create type definitions as soon as possible
- Isolate `any` usage with type guards at boundaries

---

## Gate 3: Clean Code Gate

**Principle:** Code should be self-documenting and easy to understand.

### Rules

**Function Size:**

- ✅ Functions < 20 lines
- ✅ Extract complex logic into separate functions
- ✅ Single level of abstraction per function

**SOLID Principles:**

**Single Responsibility (SRP):**

```typescript
// ✅ Good: One responsibility
class UserRepository {
  save(user: User): Promise<void> {}
  findById(id: UserId): Promise<User | null> {}
}

// ❌ Bad: Multiple responsibilities
class UserService {
  save(user: User): Promise<void> {}
  sendEmail(user: User): Promise<void> {}
  logActivity(user: User): void {}
}
```

**Open/Closed (OCP):**

```typescript
// ✅ Good: Open for extension
interface PaymentProcessor {
  process(amount: number): Promise<void>;
}

class CreditCardProcessor implements PaymentProcessor {}
class PayPalProcessor implements PaymentProcessor {}

// ❌ Bad: Modification required for new types
function processPayment(type: string, amount: number) {
  if (type === "credit-card") {
  } else if (type === "paypal") {
  }
}
```

**Liskov Substitution (LSP):**

```typescript
// ✅ Good: Subtypes are substitutable
class Bird {
  eat(): void {}
}

class Sparrow extends Bird {
  fly(): void {}
}

class Penguin extends Bird {
  // Doesn't add fly() - penguins can't fly
}

// ❌ Bad: Violates LSP
class BirdBase {
  fly(): void {
    throw new Error("Not implemented");
  }
}
```

**Interface Segregation (ISP):**

```typescript
// ✅ Good: Small, focused interfaces
interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

// ❌ Bad: Fat interface
interface FileOperations {
  read(): string;
  write(data: string): void;
  compress(): void;
  encrypt(): void;
}
```

**Dependency Inversion (DIP):**

```typescript
// ✅ Good: Depend on abstractions
interface UserRepository {
  save(user: User): Promise<void>;
}

class CreateUserUseCase {
  constructor(private userRepo: UserRepository) {}
}

// ❌ Bad: Depend on concretions
class CreateUserUseCase {
  constructor(private userRepo: PostgresUserRepository) {}
}
```

**Clean Code Patterns:**

**KISS (Keep It Simple):**

```typescript
// ✅ Good: Simple and clear
function isAdult(age: number): boolean {
  return age >= 18;
}

// ❌ Bad: Unnecessarily complex
function isAdult(age: number): boolean {
  return age >= 18 ? true : false;
}
```

**YAGNI (You Aren't Gonna Need It):**

```typescript
// ✅ Good: Only implement current requirements
class User {
  constructor(public id: UserId, public email: Email) {}
}

// ❌ Bad: Speculative features
class User {
  constructor(
    public id: UserId,
    public email: Email,
    public futureFeature?: SomeType, // Not in requirements
    public mightNeedLater?: AnotherType // Speculative
  ) {}
}
```

**DRY (Don't Repeat Yourself) - After Rule of Three:**

```typescript
// First occurrence - write directly
function validateUser1(user: User) {
  if (!user.email.includes("@")) throw new Error("Invalid email");
}

// Second occurrence - still OK
function validateUser2(user: User) {
  if (!user.email.includes("@")) throw new Error("Invalid email");
}

// Third occurrence - NOW extract
function validateEmail(email: Email): void {
  if (!email.includes("@")) throw new Error("Invalid email");
}
```

**TDA (Tell, Don't Ask):**

```typescript
// ✅ Good: Tell object what to do
class ShoppingCart {
  addItem(item: Item): void {
    this.items.push(item);
    this.recalculateTotal();
  }
}

cart.addItem(item); // Tell

// ❌ Bad: Ask object for data and act on it
const total = cart.getItems().reduce((sum, item) => sum + item.price, 0); // Ask
cart.setTotal(total);
```

### Validation Questions

- [ ] All functions < 20 lines?
- [ ] SOLID principles applied?
- [ ] DRY only after Rule of Three?
- [ ] Tell, Don't Ask pattern used?
- [ ] Code is self-documenting?

---

## Gate 4: Test-First Gate

**Principle:** Tests define behavior before implementation exists.

### Rules

**TDD Cycle (Red-Green-Refactor):**

1. ✅ Write failing test (Red)
2. ✅ Run test to confirm it fails
3. ✅ Write minimal code to pass (Green)
4. ✅ Run test to confirm it passes
5. ✅ Refactor if needed
6. ✅ Commit

**Test Order:**

1. Contract tests (API contracts)
2. Integration tests (use cases with real dependencies)
3. E2E tests (user journeys)
4. Unit tests (domain logic)

**Test Quality:**

- ✅ Use real dependencies (database, services)
- ✅ Each test is independent
- ✅ Test names describe behavior
- ❌ No mocks unless absolutely necessary

```typescript
// ✅ Good: Test with real database
describe("UserRepository", () => {
  it("should save user and retrieve by id", async () => {
    const repo = new DrizzleUserRepository(db);
    const user = createTestUser();

    await repo.save(user);
    const found = await repo.findById(user.id);

    expect(found).toEqual(user);
  });
});

// ❌ Bad: Over-mocked test
describe("UserRepository", () => {
  it("should save user", async () => {
    const mockDb = jest.fn().mockResolvedValue(true);
    // Test tells nothing about real behavior
  });
});
```

### Validation Questions

- [ ] Tests written before implementation?
- [ ] Tests confirmed to fail before coding?
- [ ] Using real dependencies (not mocks)?
- [ ] Test coverage for all user stories?

---

## Gate 5: Clean Architecture Gate (Backend)

**Principle:** Dependencies flow inward. Domain has no dependencies.

### Architecture Layers

```
┌─────────────────────────────────────┐
│     Infrastructure Layer            │ ← Repositories, Adapters, DB
│  ┌────────────────────────────────┐ │
│  │   HTTP Layer                   │ │ ← Controllers, Schemas, Middleware
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Application Layer              │ ← Use Cases, DTOs
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        Domain Layer                 │ ← Entities, Value Objects, Ports
│     (NO DEPENDENCIES)               │
└─────────────────────────────────────┘
```

### Rules

**Domain Layer (src/domain/):**

- ✅ Entities, Value Objects, Aggregates
- ✅ Ports (interfaces) for repositories and services
- ❌ NO imports from other layers
- ❌ NO framework dependencies
- ❌ NO "I" prefix on interfaces (e.g., `UserRepository`, not `IUserRepository`)

**Application Layer (src/application/):**

- ✅ Use Cases (application logic)
- ✅ DTOs (data transfer objects)
- ✅ Can import from domain
- ❌ NO imports from infrastructure

**Infrastructure Layer (src/infrastructure/):**

- ✅ Repository implementations
- ✅ Database (Drizzle schemas, migrations)
- ✅ Adapters (Cache, Logger, Queue, HTTP clients)
- ✅ DI Container
- ✅ Controllers and Schemas
- ✅ HTTP Layer (server, middleware, plugins)
- ✅ Can import from domain and application

**HTTP Layer (src/infrastructure/http/):**

- ✅ Server (Hono adapter implementing HttpServer port)
- ✅ Controllers (self-registering, delegate to use cases)
- ✅ Schemas (Zod validation for requests/responses)
- ✅ Middleware (auth, validation, error handling)
- ✅ Plugins (CORS, compression, OpenAPI)
- ✅ Can import from application
- ❌ NO business logic in controllers

### Dependency Injection

**Use Symbol-based tokens:**

```typescript
// ✅ Good: Type-safe DI tokens
type Token<T> = symbol & { __type: T };

const USER_REPOSITORY = Symbol("UserRepository") as Token<UserRepository>;
const CREATE_USER_USE_CASE = Symbol(
  "CreateUserUseCase"
) as Token<CreateUserUseCase>;

// Register
container.register(USER_REPOSITORY, () => new DrizzleUserRepository(db));

// Resolve
const userRepo = container.resolve(USER_REPOSITORY);
```

**Constructor Injection:**

```typescript
// ✅ Good: Dependencies injected
class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}
}

// ❌ Bad: Direct instantiation
class CreateUserUseCase {
  private userRepository = new DrizzleUserRepository();
  private emailService = new SendGridEmailService();
}
```

### Validation Questions

- [ ] Domain layer has no dependencies?
- [ ] Dependency flow: Infrastructure → Application → Domain?
- [ ] Interfaces in domain/ports/ (no "I" prefix)?
- [ ] Repository pattern for data access?
- [ ] Constructor injection for all dependencies?
- [ ] No business logic in controllers?

---

## Gate 6: Feature-Based Architecture Gate (Frontend)

**Principle:** Features are self-contained, testable modules.

### Structure per Feature

```
features/{feature-name}/
├── components/          # Pure UI (no stores, no gateways)
├── pages/              # Orchestration (use cases)
├── stores/             # Zustand (framework-agnostic, 100% testable)
├── gateways/           # Interface + HTTP + Fake
│   ├── {name}.gateway.ts        # Interface
│   ├── {name}.gateway.http.ts   # HTTP implementation
│   └── {name}.gateway.fake.ts   # Fake for tests
├── hooks/              # Custom hooks (optional)
└── types/              # TypeScript types
```

### Rules

**Components (Pure UI):**

- ✅ Only props and local state
- ✅ No direct store access
- ✅ No direct gateway access
- ❌ NO business logic

**Pages (Orchestration):**

- ✅ Use stores via hooks
- ✅ Inject gateways via Context
- ✅ Coordinate business logic
- ❌ NO direct HTTP calls

**Stores (Zustand):**

- ✅ Framework-agnostic (100% testable)
- ✅ State + actions in one place
- ✅ Can use gateways (injected)
- ❌ NO React dependencies

```typescript
// ✅ Good: Framework-agnostic store
export const createUserStore = (userGateway: UserGateway) => {
  return create<UserStore>((set) => ({
    users: [],
    fetchUsers: async () => {
      const users = await userGateway.getAll();
      set({ users });
    },
  }));
};

// ❌ Bad: React-dependent store
export const useUserStore = create<UserStore>((set) => ({
  // Direct fetch - not testable
  fetchUsers: async () => {
    const res = await fetch("/api/users");
    const users = await res.json();
    set({ users });
  },
}));
```

**Gateways (Interface + HTTP + Fake):**

- ✅ Always define interface first
- ✅ HTTP implementation uses interface
- ✅ Fake implementation for tests
- ✅ Injected via Context API

```typescript
// gateway.ts
export interface UserGateway {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User>;
}

// gateway.http.ts
export class HttpUserGateway implements UserGateway {
  async getAll(): Promise<User[]> {
    const res = await fetch("/api/users");
    return res.json();
  }
}

// gateway.fake.ts
export class FakeUserGateway implements UserGateway {
  constructor(private users: User[] = []) {}

  async getAll(): Promise<User[]> {
    return this.users;
  }
}
```

### Validation Questions

- [ ] Components are pure UI (no stores/gateways)?
- [ ] Pages orchestrate via stores and injected gateways?
- [ ] Stores are framework-agnostic?
- [ ] All gateways have Interface + HTTP + Fake?
- [ ] Gateways injected via Context (not imported directly)?

---

## Gate 7: Naming Conventions Gate

**Principle:** Names should be self-documenting and consistent.

### Rules

**Files and Folders:**

- ✅ `kebab-case` for files and folders
- ✅ `{name}.{type}.{ext}` pattern (e.g., `user.entity.ts`, `user.repository.ts`)

**Classes:**

- ✅ `PascalCase`
- ✅ Suffix with type (`UserEntity`, `CreateUserUseCase`, `UserRepository`)

**Functions and Variables:**

- ✅ `camelCase`
- ✅ Descriptive names (no abbreviations)
- ✅ Boolean prefix: `is`, `has`, `should`, `can`

**Constants:**

- ✅ `SCREAMING_SNAKE_CASE`

**Interfaces:**

- ✅ Semantic names (NO "I" prefix)
- ✅ `UserRepository`, NOT `IUserRepository`
- ✅ `EmailService`, NOT `IEmailService`

### Examples

```typescript
// ✅ Good naming
class UserEntity {}
class CreateUserUseCase {}
interface UserRepository {}

const isActive = true;
const hasPermission = false;
const canEdit = user.isAdmin;

const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;

// ❌ Bad naming
class user {}
class CreateUserUC {}
interface IUserRepo {}

const active = true; // Not clear it's boolean
const perm = false; // Abbreviated
```

### Validation Questions

- [ ] Files use kebab-case?
- [ ] Classes use PascalCase with type suffix?
- [ ] Functions use camelCase with descriptive names?
- [ ] Constants use SCREAMING_SNAKE_CASE?
- [ ] Interfaces have semantic names (no "I" prefix)?
- [ ] Booleans prefixed with is/has/should/can?

---

## Enforcing Gates

### During Design Phase

Execute `/product-engineering:design` which validates:

- All gates against proposed architecture
- Document exceptions in "Complexity Tracking"

### During Planning Phase

Execute `/product-engineering:plan` which ensures:

- Tasks align with gate principles
- Test-first ordering enforced

### During Validation Phase

Execute `/product-engineering:validate` which verifies:

- Implementation passes all gates
- No gate violations without documentation

---

## Amendment Process

Gates can evolve based on learning:

1. Document rationale for change
2. Update this file
3. Ensure backwards compatibility
4. Review impact on existing designs

---

**Remember:** These gates exist to prevent complexity, not to create it. If a gate blocks you, either:

1. Simplify your design to pass the gate, OR
2. Document a justified exception in your design's "Complexity Tracking" section

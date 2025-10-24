# Architecture & Design Plugin

**Comprehensive architecture and design patterns with SOLID principles, Clean Code standards, and TypeScript best practices for building maintainable applications.**

## Overview

This plugin provides expert guidance on software architecture, design patterns, and code quality standards. It ensures code follows industry best practices and maintains high quality throughout the development lifecycle.

Each skill is **highly specialized** following the **Single Responsibility Principle** to avoid duplication and conflicts.

## Skills

### 1. Project Standards

**Name**: `project-standards`

**Purpose**: Project-specific standards and critical rules for the Bun + TypeScript stack.

**When to Use**:

- Starting any development task
- Before committing code
- When asking about project workflow or tech stack
- Setting up new features or modules

**Key Areas**:

- Critical rules (barrel files, testing commands, type safety, git workflow)
- Tech stack (Bun, Hono, Drizzle, React 19, Vite 6, TanStack Router)
- Bun runtime specifics
- MCP server usage (Context7 and Perplexity)
- Pre-commit checklist
- Commit message conventions
- Quality gates workflow
- Security requirements

### 2. Clean Code Principles

**Name**: `clean-code-principles`

**Purpose**: Clean Code principles including KISS, YAGNI, DRY, and TDA patterns.

**When to Use**:

- Writing new functions or classes
- Refactoring existing code
- Code reviews
- Detecting over-engineering
- Balancing abstraction vs simplicity

**Key Areas**:

- **KISS** (Keep It Simple, Stupid) - Simplicity over complexity
- **YAGNI** (You Aren't Gonna Need It) - Build only what's needed now
- **DRY** (Don't Repeat Yourself) - Apply after Rule of Three
- **TDA** (Tell, Don't Ask) - Encapsulation and command methods
- Function design (small functions, meaningful names, single level of abstraction)
- Code organization (early returns, avoiding deep nesting)
- Common anti-patterns (premature optimization, clever code, magic numbers)

### 3. SOLID Principles

**Name**: `solid-principles`

**Purpose**: SOLID principles and clean architecture patterns.

**When to Use**:

- Designing new classes or modules
- Refactoring existing code
- Reviewing architecture decisions
- Implementing domain logic with multiple implementations

**Key Areas**:

- **Single Responsibility Principle (SRP)** - One reason to change
- **Open/Closed Principle (OCP)** - Open for extension, closed for modification
- **Liskov Substitution Principle (LSP)** - Subtypes must be substitutable
- **Interface Segregation Principle (ISP)** - Small, focused interfaces
- **Dependency Inversion Principle (DIP)** - Depend on abstractions
- When to apply (and when NOT to over-apply)
- Common anti-patterns to avoid

### 4. Clean Architecture

**Name**: `clean-architecture`

**Purpose**: Clean Architecture principles including layered architecture, dependency rule, and domain-driven design patterns.

**When to Use**:
- Structuring a new project or module
- Designing use cases or application services
- Creating domain entities and value objects
- Implementing repository patterns
- Separating concerns across layers

**Key Areas**:
- **The Dependency Rule** - Dependencies point inward toward domain
- **Domain Layer** - Pure business logic (Entities, Value Objects, Domain Services)
- **Application Layer** - Use Cases, DTOs, Ports (interfaces)
- **Infrastructure Layer** - Adapters (repositories, external services)
- **Presentation Layer** - Controllers, routes, HTTP/CLI handling
- Repository pattern and Dependency Injection
- Testing strategy (pure unit tests for domain, mocked tests for application)
- Anti-patterns to avoid (anemic domain model, fat controllers)

### 5. Backend Engineer

**Name**: `backend-engineer`

**Purpose**: Backend engineering with Clean Architecture, DDD, and Hono framework. Provides implementation examples and patterns.

**When to Use**:
- Implementing backend APIs and services
- Creating repositories and database access
- Designing use cases and business logic
- Setting up dependency injection
- Implementing domain entities and value objects
- Creating adapters for external services

**Key Areas**:
- **Domain Layer Examples** - Entities, Value Objects, Ports (interfaces)
- **Application Layer Examples** - Use Cases, DTOs, Mappers
- **Infrastructure Layer Examples** - Repositories, Adapters, DI Container
- **Presentation Layer Examples** - Routes, Controllers, Schemas (Zod)
- **Custom DI Container** - Symbol-based tokens, lifetimes, composition root
- **Best Practices** - Do's and Don'ts for backend development
- **Common Patterns** - Result type, Domain Events, Repository pattern

### 6. Frontend Engineer

**Name**: `frontend-engineer`

**Purpose**: Frontend engineering with Clean Architecture, React 19, and TanStack ecosystem. Provides implementation examples and patterns for testable, maintainable applications.

**When to Use**:
- Implementing frontend features and components
- Creating use cases and gateways
- Designing state management with TanStack Store
- Setting up HTTP communication
- Implementing domain entities
- Organizing monorepo or standalone app structure

**Key Areas**:
- **Monorepo Structure** - apps/ + packages/ with Turborepo and Bun/pnpm workspaces
- **Feature-Based Clean Architecture** - domain, application, infrastructure, presentation
- **Gateway/Port Pattern** - Interfaces for HTTP, storage, events
- **Thin Use Cases** - Delegate to gateways
- **State Management** - TanStack Store (local state) + TanStack Query (server state)
- **HTTP Service** - Axios wrapper with interceptors and error handling
- **Testing Strategy** - Unit tests (mock gateways), component tests, E2E tests
- **Best Practices** - Do's and Don'ts for frontend development

> **📚 For detailed monorepo analysis**: See `docs/frontend-architecture-comparison.md`

### 7. Naming Conventions

**Name**: `naming-conventions`

**Purpose**: Comprehensive naming standards for files, directories, classes, functions, and variables.

**When to Use**:

- Creating new files, folders, or code structures
- Naming variables, functions, classes, or interfaces
- Reviewing code for naming consistency
- Refactoring existing code

**Key Areas**:

- File naming: `kebab-case` with descriptive suffixes
- Directory naming: Plural for collections, singular for modules
- Classes & Interfaces: `PascalCase`
- Functions & Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Boolean naming: `is`, `has`, `can`, `should` prefixes
- Interface vs Implementation naming
- DTO and Response naming
- Use Case naming

### 8. Error Handling Patterns

**Name**: `error-handling-patterns`

**Purpose**: Error handling patterns including exceptions, Result pattern, and validation strategies.

**When to Use**:

- Implementing error handling in functions
- Designing validation logic
- Creating custom exception types
- Implementing retry or recovery mechanisms

**Key Areas**:

- Use exceptions, not return codes
- Never return null for errors
- Provide context with exceptions
- Exception hierarchy (domain and infrastructure exceptions)
- Result pattern for expected failures
- Validation patterns (input validation at boundaries, domain validation)
- Error recovery patterns (retry logic, circuit breaker, fallback values)
- Error logging (structured logging)
- HTTP error handling with Hono

### 9. TypeScript Type Safety

**Name**: `typescript-type-safety`

**Purpose**: TypeScript type safety including type guards, branded types, and advanced type system features.

**When to Use**:

- Working with `unknown` types
- Implementing type guards
- Creating branded types for domain modeling
- Using discriminated unions
- Implementing advanced TypeScript patterns

**Key Areas**:

- NEVER use `any` - Use `unknown` with type guards
- Proper type guards (type predicates)
- Branded types for domain modeling
- Discriminated unions for polymorphic data
- Conditional types
- Mapped types (Partial, Readonly, Pick, Omit)
- Template literal types
- Function overloads
- Const assertions
- Utility types (NonNullable, Extract, Exclude, Record)
- Type narrowing (typeof, instanceof, in operator)
- TypeScript configuration (strict mode)

## Architecture

The plugin follows its own principles:

- **Single Responsibility**: Each skill focuses on ONE specific area
- **No Duplication**: Content is not repeated across skills
- **No Conflicts**: Skills complement each other without contradictions
- **Specialized**: Deep knowledge in focused areas
- **Composable**: Skills work together seamlessly

## Skill Activation

Skills automatically activate based on context:

1. **project-standards**: Task start, before commits, workflow questions
2. **clean-code-principles**: Writing functions, refactoring, code reviews
3. **solid-principles**: Class/module design, architecture decisions
4. **clean-architecture**: Project structure, layered architecture, dependency rule
5. **backend-engineer**: Backend implementation, APIs, repositories, use cases, DI
6. **frontend-engineer**: Frontend implementation, React components, monorepo structure, state management
7. **naming-conventions**: Creating or naming code elements
8. **error-handling-patterns**: Implementing error handling or validation
9. **typescript-type-safety**: Working with types, type guards, advanced TypeScript

## Manual Skill Invocation

You can explicitly request skills:

```
"Apply SOLID principles to this class"
"Structure this using Clean Architecture"
"Create a use case for user registration" (backend)
"Create a frontend feature with Clean Architecture" (frontend)
"How should I structure my monorepo?" (frontend)
"Implement a gateway for this API" (frontend)
"Set up TanStack Store for auth state" (frontend)
"Review naming conventions in this file"
"Help me with error handling"
"Implement type guards for this data"
"Keep this code simple (KISS principle)"
"What are the project standards?"
```

## Skill Relationships

### Foundation (All Projects)
```
project-standards (Critical Rules & Tech Stack)
    ↓
typescript-type-safety (Type System)
    ↓
error-handling-patterns (Error Handling)
    ↓
naming-conventions (Naming)
```

### Backend Path
```
solid-principles (SOLID Principles)
    ↓
clean-architecture (Layered Architecture)
    ↓
backend-engineer (Backend Implementation)
    ↓
clean-code-principles (Code Quality)
```

### Frontend Path
```
solid-principles (SOLID Principles - lighter)
    ↓
clean-architecture (Feature-Based Architecture)
    ↓
frontend-engineer (Frontend Implementation)
    ↓
clean-code-principles (Code Quality)
```

All skills work together to ensure:

1. Project standards are followed
2. Types are safe
3. Errors are handled properly
4. Names are clear
5. SOLID principles are applied appropriately
6. Architecture is layered and clean (backend) or feature-based (frontend)
7. Code is clean, testable, and maintainable

## Tech Stack

**For complete tech stack details, see `project-standards` skill**

**Quick Reference:**
- **Backend**: Bun, Hono, PostgreSQL + Drizzle ORM, Redis, BullMQ
- **Frontend**: React 19, Vite 6, TanStack Router, shadcn/ui, Tailwind CSS 4
- **Testing**: Bun test, React Testing Library, Playwright
- **Code Quality**: Biome (TS/JS/CSS), Prettier (Markdown), TypeScript strict mode

→ Use `project-standards` skill for detailed tech stack information

## Critical Rules Summary

**NEVER:**

- Use `any` type → Use `unknown` with type guards
- Use `bun test` → Use `bun run test`
- Commit without tests and type-check
- Commit directly to `main` or `dev`
- Return null for errors → Throw exceptions or return `undefined`
- Over-engineer simple solutions

**ALWAYS:**

- Run `bun run craft` after creating/moving files
- Create feature branches from `dev`
- Apply SOLID principles appropriately
- Follow naming conventions
- Handle errors with context
- Write type-safe code
- Keep code simple (KISS)
- Build only what's needed (YAGNI)

## Quality Standards

The plugin enforces:

1. **KISS**: Keep It Simple, Stupid (avoid over-engineering)
2. **YAGNI**: You Aren't Gonna Need It (build only what's needed)
3. **DRY**: Don't Repeat Yourself (Rule of Three)
4. **TDA**: Tell, Don't Ask (proper encapsulation)
5. **SOLID**: All five principles applied appropriately
6. **Type Safety**: No `any`, always use proper types
7. **Error Handling**: Exceptions with context, Result pattern for expected failures

## Common Patterns

### Value Object with Branded Type

```typescript
type Email = string & { readonly brand: unique symbol };

export function createEmail(value: string): Email {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new ValidationError("Invalid email format", { email: value });
  }
  return value as Email;
}
```

### Repository Pattern with Dependency Inversion

```typescript
export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | undefined>;
}

export class PostgresUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    // Implementation
  }
}
```

### Use Case with Error Handling

```typescript
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // Validate
    if (!this.isValidEmail(dto.email)) {
      throw new ValidationError("Invalid email", { email: dto.email });
    }

    // Business logic
    const hashedPassword = await this.passwordHasher.hash(dto.password);
    const user = new User(dto, hashedPassword);

    // Save
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new DatabaseError("Failed to save user", error);
    }
  }
}
```

### Result Pattern for Expected Failures

```typescript
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

async function findUser(id: string): Promise<Result<User, NotFoundError>> {
  const user = await repository.findById(id);

  if (!user) {
    return { success: false, error: new NotFoundError("User not found") };
  }

  return { success: true, value: user };
}
```

## Integration with Other Plugins

This plugin works seamlessly with:

- **QA Plugin**: Enforces quality gates and testing standards
- **DB Tools Plugin**: Ensures proper database patterns with Drizzle
- **UI Plugin**: Maintains component architecture standards
- **Git Plugin**: Enforces git workflow and commit standards

## File Structure

```
architecture-design/
├── .claude-plugin/
│   └── plugin.json
├── docs/
│   └── frontend-architecture-comparison.md   (Analysis & Recommendations)
├── package.json
├── README.md (this file)
└── skills/
    ├── backend-engineer.md              (Backend Implementation)
    ├── clean-architecture.md            (Layered Architecture)
    ├── clean-code-principles.md         (KISS, YAGNI, DRY, TDA)
    ├── error-handling-patterns.md       (Exceptions & Result Pattern)
    ├── frontend-engineer.md             (Frontend Implementation - NEW!)
    ├── naming-conventions.md            (Naming Standards)
    ├── project-standards.md             (Project Rules)
    ├── solid-principles.md              (SOLID Principles)
    └── typescript-type-safety.md        (Type Safety)
```

## Version

1.0.0

## License

MIT License

## Author

**Marcio Altoé**
Email: marcio.altoe@gmail.com

---

**Remember**: These skills work together to ensure code is not just functional, but maintainable, type-safe, and follows industry best practices. Quality is not optional!

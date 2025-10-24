# Core Development Rules

**For backend implementation examples and patterns, use the `backend-engineer` skill from architecture-design plugin**

**For frontend implementation examples and patterns, use the `frontend-engineer` skill from architecture-design plugin**

## **CRITICAL - NEVER IGNORE:**

- **ALWAYS** run `bun run craft` after creating/moving files to update barrel imports
- **NEVER** use `any` type - use `unknown` with type guards instead
- **NEVER** commit without running quality gates: format, lint, type-check and tests
- **NEVER** commit directly to `main` or `dev` branches
- **ALWAYS** create feature branches from `dev`

## Naming Conventions (Mandatory)

**For complete naming standards, use the `naming-conventions` skill from architecture-design plugin**

**Quick Reference:**

- `kebab-case` for file and folder names
- `PascalCase` for class names
- `camelCase` for function and variable names
- `SCREAMING_SNAKE_CASE` for constants

## Tech Stack

### Backend:

- Runtime: Bun
- Framework: Hono
- Database: PostgreSQL com Drizzle ORM
- Cache: Redis (via ioredis)
- Queue: BullMQ

### Frontend:

- Framework: React 19 + Vite 6
- Router: TanStack Router
- UI: shadcn/ui + Tailwind 4
- State Management: Zustand (global client state) + TanStack Query (server state)

**Architecture:** Simplified feature-based organization

- Pages orchestrate business logic (use cases)
- Components are pure UI (no stores/gateways)
- Stores (Zustand) are framework-agnostic, 100% testable
- Gateways injected via Context API for isolated testing

**Structure per feature:**

```
features/[name]/
├── components/   # Pure UI
├── pages/        # Use cases (orchestration)
├── stores/       # Zustand (state + actions)
├── gateways/     # Interface + HTTP + Fake
├── hooks/        # Custom hooks (optional)
└── types/        # TypeScript types
```

**NO Clean Architecture layers (domain/application/infrastructure/presentation)**

### Testing:

- Unit: Bun test + React Testing Library
- E2E: Playwright
- Coverage: Bun built-in

### Code Quality:

- Linting/Formatting: Biome (TS/JS/CSS)
- Markdown: Prettier
- TypeScript: Strict mode

## Backend Architecture (MANDATORY)

**Clean Architecture is REQUIRED for ALL backend code.**

**For complete architecture guidance, use these skills from architecture-design plugin:**

- `clean-architecture` - Layered architecture, dependency rule, DDD patterns
- `backend-engineer` - Implementation examples, DI Container, best practices
- `solid-principles` - SOLID principles application

### Quick Reference - Layers (dependency flow: outward → inward)

1. **Domain Layer** (innermost, no dependencies)

   - Entities, Value Objects, Aggregates, Domain Events
   - Ports: Interface contracts (repositories, services) - NO "I" prefix

2. **Application Layer** (depends on Domain only)

   - Use Cases: Application-specific business rules
   - DTOs: Data transfer between layers

3. **Infrastructure Layer** (depends on Application + Domain)

   - Repositories: Database implementations (implements domain/ports/repositories)
   - Adapters: External service implementations (Cache, Logger, Queue, APIs)
   - Config, Database, HTTP, Container (DI)

4. **Presentation Layer** (depends on Application)
   - Routes: Hono route registration
   - Controllers: Route handlers (business logic delegation)
   - Schemas: Zod validation schemas for requests/responses

### Critical Rules

- **NEVER** import infrastructure in domain layer
- **ALWAYS** inject dependencies via constructors
- **ALWAYS** define interfaces in `domain/ports/` (NO "I" prefix)
- **NEVER** expose domain entities directly in API responses
- Use DTOs/ViewModels for presentation layer

## Dependency Injection Container

**Use custom DI Container (NO external libraries like InversifyJS or TSyringe)**

**For complete DI implementation, see `backend-engineer` skill from architecture-design plugin**

**Quick Reference:**

- **Symbol-based tokens**: Type-safe DI with `Symbol('Name') as Token<Type>`
- **Lifetimes**: singleton (core, repos), scoped (use cases), transient (rare)
- **Registration by layer**: Separate register functions per layer
- **Composition root**: `infrastructure/container/main.ts`

## Barrel Files Strategy

**Use barrel files for clean imports:**

```typescript
// ✅ Good - uses barrel files
import { UserIdentity } from "@/domain/aggregate";
import { Email, Password } from "@/domain/value-object";

// ❌ Avoid - relative imports
import { UserIdentity } from "../../domain/aggregate/user-identity.aggregate";
```

**IMPORTANT**: Run `bun run craft` after creating/moving files to update barrel files.

## Git Standards

- Create feature branches from `dev`, never from `main`
- Never commit directly to `main` or `dev` branches
- Always run tests/type-check before committing (use `/quality:check`)
- Use `/git:commit` for conventional commits

## Error Handling Patterns

**For complete error handling guidance, use `error-handling-patterns` skill from architecture-design plugin**

**Quick Reference:**

- Use Result/Either types for expected failures
- Log errors with correlation IDs for tracing
- Implement circuit breakers for external services

## Security Stack

- Validation: Zod schemas at system boundaries
- Passwords: bcrypt hashing
- Secrets: Environment variables only
- Rate limiting on public endpoints

## MCP Server Usage Rules

**MANDATORY - ALWAYS FOLLOW:**

### Private Repository Access & Code Intelligence

- **ALWAYS** use **Octocode MCP** for:
  - Accessing private GitHub repositories (backend services, microservices)
  - Exploring repository structure and architectural patterns
  - Searching code across organizational repositories
  - Finding implementation examples in internal codebases
  - Analyzing commit history and PR evolution
  - Retrieving file contents from private repos
  - Framework-specific code discovery (e.g., Hono middleware patterns, React patterns)
  - Package dependency research (npm/PyPI metadata)

### Documentation Lookup

- **ALWAYS** use **Context7 MCP** for:
  - Comprehensive documentation search across multiple sources
  - Private documentation or internal resources
  - Library documentation and framework patterns
  - Import statements, API usage, configuration guidance
  - Version-specific implementation requirements
  - Need curated, version-specific framework patterns
  - Framework compliance verification (React, Hono, TanStack Router, etc.)

### Web Research & Documentation

- **ALWAYS** use **Perplexity MCP** for:

  - Technical research & documentation (hundreds of QPS)
  - Code patterns, benchmarks, and technical solutions
  - Real-time semantic search with superior accuracy
  - Developer-focused research and API documentation
  - Complex reasoning validation (30 QPS limit)
  - Conversational synthesis when EXA insufficient
  - Latest trends and emerging technologies

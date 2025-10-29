---
name: technical-design
description: Create comprehensive technical design documentation covering architecture, data models, API contracts, and implementation approach
---

# Technical Design Documentation

## Overview

Create clear, maintainable technical design documents that bridge specifications and implementation, providing developers with everything needed to build the system correctly.

**Core Principle:** Design documents are the blueprint. They answer "HOW" after specs answer "WHAT".

**Announce at start:** "I'm using the technical-design skill to transform the specification into a detailed technical design with architecture, data models, and API contracts."

---

## Quick Reference

| Component              | Purpose                      | Key Elements                    | Output                           |
| ---------------------- | ---------------------------- | ------------------------------- | -------------------------------- |
| **Architecture Pattern** | System structure           | Layers, boundaries, dependencies | Clean Architecture diagram       |
| **Tech Stack**         | Technology choices           | Framework, DB, cache, queue     | ADRs + rationale                 |
| **Data Model**         | Entities & relationships     | Entities, value objects, aggregates | Drizzle schema + diagrams    |
| **API Design**         | Contract definitions         | Endpoints, schemas, auth        | OpenAPI/Zod schemas              |
| **System Structure**   | Directory organization       | File paths, modules             | Project structure tree           |
| **Architecture Gates** | Quality validation           | 7 gates checked                 | Pass/Fail + Complexity Tracking  |

---

## When to Use This Skill

**Use this skill when:**

- Transforming specifications into technical architecture
- Defining system structure before implementation
- Making technology stack decisions
- Creating API contracts and data models
- Documenting architectural patterns

**Prerequisites:**

- Specification document complete (SPEC-{###}-{name}.md)
- Requirements and user stories defined
- Non-functional requirements documented

---

## The Process

### Phase 1: Specification Analysis

**Goal:** Extract technical requirements from specification

**Activities:**

1. Read specification: `docs/specs/SPEC-{###}-{name}.md`
2. Identify functional requirements that need technical decisions
3. Extract non-functional requirements (Performance, Security, Scalability, Observability, Maintainability)
4. Map user stories to technical components
5. Identify constraints and forces

**Questions to Answer:**

- What are the performance requirements? (NFR-P-###)
- What security requirements exist? (NFR-S-###)
- What scalability needs must be met? (NFR-SC-###)
- What observability is required? (NFR-O-###)
- What maintainability standards apply? (NFR-M-###)

**Output:** Technical requirements summary

---

### Phase 2: Architecture Pattern Selection

**Goal:** Choose the appropriate architectural pattern with ADR

#### 2.1 Explore Architecture Alternatives (2-3 Required)

**Common Patterns:**

1. **Clean Architecture** (Layered, strict boundaries)
   - Domain ’ Application ’ Infrastructure/Presentation
   - Best for: Complex business logic, DDD
   - Trade-off: More structure, higher learning curve

2. **Hexagonal Architecture** (Ports & Adapters)
   - Core ’ Ports (interfaces) ’ Adapters (implementations)
   - Best for: External integrations, testability
   - Trade-off: Similar to Clean Arch, different terminology

3. **Transactional Script** (Simple, direct)
   - Direct DB access from routes/controllers
   - Best for: CRUD apps, simple business logic
   - Trade-off: Simpler but couples to database

**Use MCP for Research:**

```javascript
// Perplexity: Compare patterns
const architectureComparison = await perplexity.ask([
  {
    role: "user",
    content: "Compare Clean Architecture vs Hexagonal Architecture vs Transactional Script for a {domain} application with {complexity level} business logic. Include maintainability, testability, and learning curve trade-offs.",
  },
]);

// Context7: Get pattern docs
const cleanArchDocs = await context7.getLibraryDocs({
  libraryId: "/clean-architecture",
  topic: "layered architecture patterns for TypeScript",
});

// Octocode: Find reference implementations
const refImpls = await octocode.searchRepositories({
  queries: [
    {
      topicsToSearch: ["clean-architecture", "typescript"],
      stars: ">500",
    },
  ],
});
```

#### 2.2 Create Architecture ADR

**Create ADR documenting choice:**

- Use `architecture-decision` skill
- Document 2-3 alternatives considered
- Validate against architecture gates
- Save to `docs/adr/ADR-####-architecture-pattern.md`

**Example:** "ADR-0001: Adopt Clean Architecture for Backend"

---

### Phase 3: Tech Stack Decisions

**Goal:** Select technologies for each layer with ADRs

#### 3.1 Backend Tech Stack

**Decisions Needed:**

- **Runtime**: Bun vs Node.js vs Deno
- **Framework**: Hono vs Express vs Fastify
- **Database**: PostgreSQL vs MongoDB vs MySQL
- **ORM**: Drizzle vs Prisma vs TypeORM
- **Cache** (if needed): Redis vs Memcached
- **Queue** (if needed): BullMQ vs RabbitMQ

**For Each Decision:**

1. Research with MCP (Perplexity + Context7 + Octocode)
2. Document 2-3 alternatives with pros/cons
3. Create ADR: `ADR-####-{decision-name}.md`
4. Validate against architecture gates

**Example ADRs:**

- `ADR-0002-choose-hono-web-framework.md`
- `ADR-0003-choose-postgresql-database.md`
- `ADR-0004-choose-drizzle-orm.md`

#### 3.2 Frontend Tech Stack (if applicable)

**Decisions Needed:**

- **Framework**: React 19 + Vite 6 (default from CLAUDE.md)
- **Router**: TanStack Router (default)
- **State**: Zustand + TanStack Query (default)
- **UI**: shadcn/ui + Tailwind 4 (default)

**Note:** These are defaults from CLAUDE.md. Create ADRs only if deviating.

#### 3.3 Tech Stack Summary

**Create tech stack section in design doc:**

```markdown
## Tech Stack

### Backend
- **Runtime**: Bun 1.x
  - Rationale: [Link to ADR-####]
- **Framework**: Hono v3
  - Rationale: [Link to ADR-0002-choose-hono-web-framework.md]
- **Database**: PostgreSQL 15
  - Rationale: [Link to ADR-0003-choose-postgresql-database.md]
- **ORM**: Drizzle ORM
  - Rationale: [Link to ADR-0004-choose-drizzle-orm.md]
- **Cache**: Redis 7
  - Rationale: [Link to ADR-####]

### Frontend
- **Framework**: React 19 + Vite 6
- **Router**: TanStack Router
- **State**: Zustand (client) + TanStack Query (server)
- **UI**: shadcn/ui + Tailwind 4
```

---

### Phase 4: Data Model Design

**Goal:** Define entities, value objects, and relationships

#### 4.1 Domain Entities

**Extract from requirements:**

- Identify nouns in functional requirements
- Determine which are entities (with identity) vs value objects (no identity)
- Define aggregates and aggregate roots

**Entity Template:**

```markdown
### Entity: {Name}

**Purpose**: {What this entity represents}

**Attributes**:
- `id`: UUID - Unique identifier
- `{attribute}`: {type} - {description}
- `createdAt`: timestamp - Creation timestamp
- `updatedAt`: timestamp - Last update timestamp

**Invariants**:
- {Business rule that must always be true}

**Relationships**:
- {Relationship to other entities}
```

**Example:**

```markdown
### Entity: User

**Purpose**: Represents a registered user in the system

**Attributes**:
- `id`: UUID - Unique identifier
- `email`: Email (value object) - User's email address (unique)
- `passwordHash`: string - bcrypt hashed password
- `displayName`: string - User's display name
- `createdAt`: timestamp - Account creation date
- `updatedAt`: timestamp - Last profile update

**Invariants**:
- Email must be unique across all users
- Password hash must use bcrypt with cost factor e12
- Display name must be 1-50 characters

**Relationships**:
- User has many Messages (one-to-many)
- User has many ChatRooms (many-to-many through UserChatRoom)
```

#### 4.2 Value Objects

**Identify immutable value concepts:**

```markdown
### Value Object: Email

**Purpose**: Represents a validated email address

**Validation**:
- Must match RFC 5322 pattern
- Must be d255 characters
- Case-insensitive comparison

**Methods**:
- `validate()`: Ensures email format is valid
- `toString()`: Returns lowercase email string
```

#### 4.3 Drizzle Schema

**Create Drizzle schema based on entities:**

```typescript
// src/infrastructure/database/schemas/user.schema.ts
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

#### 4.4 Data Model Diagram

**Create entity-relationship diagram:**

```
                                                            
     User                 Message                ChatRoom   
              $                       $                       $
 id (PK)              userId (FK)           id (PK)      
 email                roomId (FK)           name         
 passwordHash         content                createdAt    
 displayName          createdAt                           
 createdAt                         
 updatedAt         
                   
                     
                     
                 1:N relationship
```

---

### Phase 5: API Design

**Goal:** Define API endpoints with contracts

#### 5.1 Endpoint Inventory

**List all endpoints from user stories:**

```markdown
## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - New user registration

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:roomId` - Get message history
- `WS /api/ws/messages` - Real-time message stream

### Users
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update profile
```

#### 5.2 Endpoint Specifications

**For each endpoint, define:**

```markdown
### POST /api/auth/login

**Purpose**: Authenticate user and create session

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200)**:
```json
{
  "token": "jwt.token.here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid email format
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded

**Authentication**: None (public endpoint)

**Rate Limiting**: 5 requests per 10 minutes per IP

**Related Requirements**: FR-005, NFR-S-002, NFR-S-004
```

#### 5.3 Zod Validation Schemas

**Create Zod schemas for request/response validation:**

```typescript
// src/presentation/schemas/auth.schema.ts
import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(12, "Password must be e12 characters"),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    displayName: z.string(),
  }),
});
```

---

### Phase 6: System Structure

**Goal:** Define directory organization and module boundaries

#### 6.1 Backend Structure (Clean Architecture)

```markdown
## Backend Structure

```
src/
   domain/                 # Layer 1 (no dependencies)
      entities/          # User, Message, ChatRoom
      value-objects/     # Email, MessageContent
      aggregates/        # ChatRoom aggregate
      events/            # MessageSent, UserJoined
      ports/             # Interfaces (NO "I" prefix)
          repositories/  # UserRepository, MessageRepository
          services/      # External service interfaces

   application/           # Layer 2 (depends on Domain only)
      use-cases/         # SendMessage, GetMessageHistory
      dtos/              # SendMessageDto, MessageDto

   infrastructure/        # Layer 3 (depends on Application + Domain)
      repositories/      # UserRepositoryImpl, MessageRepositoryImpl
      adapters/          # External service implementations
         cache/         # RedisCache
         logger/        # WinstonLogger
         queue/         # BullMQQueue
      database/          # Drizzle schemas, migrations
      http/              # HTTP clients
      container/         # DI Container

   presentation/          # Layer 4 (depends on Application)
       routes/            # Route registration
       controllers/       # Route handlers
       schemas/           # Zod validation schemas
```
```

#### 6.2 Frontend Structure (Feature-Based)

```markdown
## Frontend Structure

```
features/
   auth/
      components/        # LoginForm, RegisterForm (pure UI)
      pages/             # LoginPage, RegisterPage (orchestration)
      stores/            # useAuthStore (Zustand)
      gateways/          # AuthGateway (Interface + HTTP + Fake)
      types/             # TypeScript types

   messages/
      components/        # MessageList, MessageInput
      pages/             # ChatPage
      stores/            # useMessagesStore
      gateways/          # MessagesGateway (Interface + HTTP + Fake)
      types/

   shared/
       components/        # Button, Input, etc.
       hooks/             # useWebSocket, useAuth
       utils/             # formatDate, etc.
```
```

---

### Phase 7: Architecture Gates Validation

**Goal:** Validate design against all 7 architecture gates

**The 7 Gates:**

1. **Simplicity Gate**: d3 projects, no future-proofing, Rule of Three before DRY
2. **Type Safety Gate**: No `any`, branded types for domain primitives, type guards
3. **Clean Code Gate**: Functions <20 lines, SOLID principles, meaningful names
4. **Test-First Gate**: TDD (Red-Green-Refactor), tests before implementation
5. **Clean Architecture Gate** (Backend): Domain  Application  Infrastructure/Presentation
6. **Feature-Based Architecture Gate** (Frontend): Pure components, injected gateways, Zustand stores
7. **Naming Conventions Gate**: kebab-case (files), PascalCase (classes), camelCase (functions)

**Validation Process:**

```markdown
### Phase -1: Pre-Implementation Gates

#### Simplicity Gate (Article VII)
- [ ] Using d3 projects? ’ **PASS**: Backend + Frontend + Shared (3 projects)
- [ ] No future-proofing? ’ **PASS**: Building only for current requirements
- [ ] Rule of Three before DRY? ’ **PASS**: Will extract abstractions after 3rd occurrence

#### Type Safety Gate
- [ ] No `any` types? ’ **PASS**: TypeScript strict mode enabled
- [ ] Branded types for domain? ’ **PASS**: Email, MessageContent are branded types
- [ ] Type guards for unknown? ’ **PASS**: Using Zod for runtime validation

#### Clean Code Gate
- [ ] Functions < 20 lines? ’ **PASS**: Enforced in linting rules
- [ ] SOLID principles? ’ **PASS**: Single Responsibility per class, DI used
- [ ] Meaningful names? ’ **PASS**: No abbreviations, descriptive names

#### Test-First Gate
- [ ] TDD approach? ’ **PASS**: Tests written before implementation (Red-Green-Refactor)
- [ ] Real dependencies over mocks? ’ **PASS**: Integration tests use real DB/Redis

#### Clean Architecture Gate (Backend)
- [ ] Dependency flow correct? ’ **PASS**: Domain  Application  Infrastructure/Presentation
- [ ] No implementation in domain? ’ **PASS**: Domain has only business logic, no frameworks
- [ ] Interfaces in domain/ports/? ’ **PASS**: Repository interfaces defined in domain

#### Feature-Based Architecture Gate (Frontend)
- [ ] Components pure UI? ’ **PASS**: No business logic, props only
- [ ] Gateways injected via Context? ’ **PASS**: Gateway pattern with Interface + HTTP + Fake
- [ ] Stores framework-agnostic? ’ **PASS**: Zustand stores are pure TypeScript

#### Naming Conventions Gate
- [ ] kebab-case for files? ’ **PASS**: user-repository.impl.ts
- [ ] PascalCase for classes? ’ **PASS**: UserRepository, SendMessageUseCase
- [ ] camelCase for functions? ’ **PASS**: sendMessage, getMessageHistory
- [ ] NO "I" prefix? ’ **PASS**: UserRepository not IUserRepository

**Complexity Tracking**: None - all gates PASS
```

**If Any Gate FAILS:**

Document in **Complexity Tracking** section:

```markdown
### Complexity Tracking

**Failed Gates:**

1. **Simplicity Gate - FAIL**: Using 4 projects (Backend, Frontend, Admin, Shared)
   - **Why necessary**: Admin dashboard requires separate deployment and permissions
   - **Problem it solves**: Security isolation between user-facing app and admin tools
   - **Why simpler rejected**: Single project would mix user/admin concerns, violating security

2. **Clean Architecture Gate - FAIL**: Repository uses framework-specific code
   - **Why necessary**: Drizzle query builder provides type safety we need
   - **Problem it solves**: Runtime type errors from raw SQL
   - **Why simpler rejected**: Raw SQL loses type safety benefits
```

---

### Phase 8: Document Creation

**Goal:** Generate complete technical design document

**Activities:**

1. Load `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/templates/technical-design.md`
2. Auto-number: Scan `docs/design/` for next DESIGN-### (e.g., DESIGN-001)
3. Fill all sections with architecture, data models, API contracts
4. Link to spec: `spec: SPEC-{###}`
5. Link to ADRs: Reference all ADRs created
6. Save to `docs/design/DESIGN-{###}-{name}.md`

**Template Sections:**

- **Header**: Design number, spec link, status, created date
- **Architecture Overview**: Pattern chosen, layers, dependencies
- **Tech Stack**: All technology decisions with ADR links
- **Data Model**: Entities, value objects, Drizzle schemas, ER diagram
- **API Design**: Endpoints, contracts, Zod schemas
- **System Structure**: Directory organization (backend + frontend)
- **Phase -1 Gates**: Architecture gates validation
- **Complexity Tracking**: Failed gates justification (if any)
- **Implementation Phases**: High-level phases (detailed tasks come later)

---

## Key Principles

### Principle 1: Docs as Code

**Keep docs in version control alongside code**

- Store in `docs/` directory in repository
- Use markdown for portability
- Update docs with code changes (not after)

### Principle 2: Diagrams Are Mandatory

**Visual representations clarify complex structures**

- Entity-relationship diagrams for data models
- Architecture diagrams for system structure
- Sequence diagrams for complex flows (if needed)

### Principle 3: Link Everything

**Create traceability through hyperlinks**

- Link design ’ spec
- Link design ’ ADRs
- Link API endpoints ’ requirements
- Link entities ’ user stories

### Principle 4: Make It Searchable

**Structure for discoverability**

- Use clear, consistent headings
- Include table of contents
- Use descriptive file names
- Add searchable keywords

### Principle 5: Keep It Concise

**High-level in design doc, details in separate files**

- Main design doc: Overview and decisions
- Detailed schemas: `implementation-details/` folder
- Code examples: Separate files, linked from doc

---

## Common Pitfalls

L **Don't:**

1. **Skip architecture ADRs** - Every major decision needs justification
2. **Copy-paste code into design docs** - Link to files instead
3. **Forget to validate gates** - All 7 gates must be checked
4. **Mix WHAT and HOW** - Design is HOW, spec is WHAT
5. **Leave ADR links as TODO** - Create ADRs before finalizing design
6. **Ignore NFRs in design** - Performance/security affect architecture
7. **Skip diagrams** - Text alone is hard to understand
8. **Make implementation decisions without research** - Use MCP first

 **Do:**

1. **Create ADRs for all major decisions** - Tech stack, architecture, database
2. **Use diagrams liberally** - ER diagrams, architecture diagrams
3. **Validate all 7 architecture gates** - Document PASS/FAIL honestly
4. **Link to specs and ADRs** - Full traceability
5. **Research with MCP before deciding** - Perplexity, Context7, Octocode
6. **Keep design doc high-level** - Details in separate files
7. **Update docs with code** - Treat docs as code artifacts
8. **Define clear module boundaries** - Domain, application, infrastructure, presentation

---

## Handoff Pattern

When technical design is complete:

**Announce:**

"Technical design complete: `docs/design/DESIGN-{###}-{name}.md`

**Architecture**: {Pattern name} (see ADR-####)

**Tech Stack**:
- Backend: {Runtime + Framework + DB + ORM}
- Frontend: {Framework + State + UI}

**ADRs Created**:
- ADR-####: {Architecture pattern}
- ADR-####: {Tech decision 1}
- ADR-####: {Tech decision 2}

**Architecture Gates**: {Summary - all PASS or note FAILs with justification}

**Data Model**: {N} entities, {N} value objects defined

**API Design**: {N} endpoints documented with Zod schemas

Ready to proceed to Planning phase?

If yes, I'll execute `/product-engineering:plan` to break this design into atomic, implementable tasks with TDD ordering."

**Wait for user confirmation before proceeding.**

---

*Powered by research from Perplexity MCP, Context7, Octocode, and industry best practices for technical documentation*

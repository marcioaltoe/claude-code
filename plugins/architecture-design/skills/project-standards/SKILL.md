---
name: project-standards
description: Project-specific standards and critical rules for the Bun + TypeScript stack. Use when starting development, before commits, or when user asks about project workflow. Examples - "project rules", "before commit checklist", "tech stack", "git workflow", "barrel files".
---

You are an expert in enforcing project-specific standards and critical development rules. You ensure all code follows the project's technical requirements and workflow.

## When to Engage

You should proactively assist:

- At the start of any development task
- Before committing code
- When user asks about project-specific standards
- When setting up new features or modules
- During onboarding to the project

## CRITICAL RULES - NEVER IGNORE

### Barrel Files

**ALWAYS run after creating/moving files:**

```bash
bun run craft
```

This updates barrel files (index.ts exports) for clean imports:

```typescript
// ✅ Good - uses barrel files
import { UserEntity, OrderEntity } from "@/domain/entities";
import { Email, UserId } from "@/domain/value-objects";

// ❌ Bad - relative imports
import { UserEntity } from "../../domain/entities/user.entity";
import { OrderEntity } from "../../domain/entities/order.entity";
```

**When to run:**

- After creating new files
- After moving/renaming files
- After deleting files
- Before committing changes

### Testing Commands

**NEVER use:**

```bash
bun test  # ❌ WRONG
```

**ALWAYS use:**

```bash
bun run test  # ✅ CORRECT
```

**Before every commit:**

```bash
bun run test        # Run all tests
bun run type-check  # Check TypeScript errors
```

### Type Safety

**NEVER use `any` type:**

```typescript
// ❌ FORBIDDEN
function process(data: any) {
  return data.value;
}

// ✅ CORRECT - Use unknown with type guards
function process(data: unknown) {
  if (typeof data === "object" && data !== null && "value" in data) {
    return (data as { value: unknown }).value;
  }
  throw new Error("Invalid data structure");
}

// ✅ CORRECT - Use proper types
interface ProcessData {
  value: string;
}

function process(data: ProcessData) {
  return data.value;
}
```

### Git Workflow

**NEVER commit directly to:**

- `main` branch
- `dev` branch

**ALWAYS:**

```bash
# Start from dev
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/user-authentication

# ... make changes ...

# Before committing
bun run craft        # Update barrel files
bun run test         # Run tests
bun run type-check   # Check types

# Commit
git add .
git commit -m "feat: implement user authentication"

# Push and create PR to dev
git push origin feature/user-authentication
```

**Branch naming conventions:**

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates

## Tech Stack

### Backend

- **Runtime**: Bun
- **Framework**: Hono
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis (via ioredis)
- **Queue**: BullMQ

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Router**: TanStack Router
- **UI**: shadcn/ui + Tailwind CSS 4

### Testing

- **Unit**: Bun test
- **Component**: React Testing Library
- **E2E**: Playwright
- **Coverage**: Bun built-in

### Code Quality

- **Linting/Formatting**: Biome (TypeScript/JavaScript/CSS)
- **Markdown**: Prettier
- **TypeScript**: Strict mode

## Bun Runtime Specifics

**Prefer Bun APIs over Node.js:**

```typescript
// ✅ Good - Use Bun APIs
import { Database } from "bun:sqlite";
import { serve } from "bun";

// Password hashing
const hashedPassword = await Bun.password.hash(password, {
  algorithm: "bcrypt",
  cost: 10,
});

// File operations
const file = Bun.file("./config.json");
const config = await file.json();

// UUID v7
const id = Bun.randomUUIDv7();
```

## MCP Server Usage

**MANDATORY - ALWAYS FOLLOW:**

### Octocode MCP - For Private Repositories

Use when you need:

- Accessing private GitHub repositories (backend services, microservices)
- Exploring repository structure and architectural patterns
- Searching code across organizational repositories
- Finding implementation examples in internal codebases
- Analyzing commit history and PR evolution
- Retrieving file contents from private repos
- Framework-specific code discovery (e.g., Hono middleware patterns, React patterns)
- Package dependency research (npm/PyPI metadata)

**Examples:**

- "Find authentication implementation in our backend repo"
- "Search for Hono middleware examples in our services"
- "Show me how we implement Clean Architecture in existing projects"
- "Find React component patterns in our frontend repos"

### Context7 MCP - For Documentation

Use when you need:

- Library documentation
- Framework patterns
- API reference
- Import statements
- Configuration guidance
- Version-specific features

**Examples:**

- "How to use Drizzle ORM relations?"
- "Hono middleware patterns?"
- "React 19 hook documentation?"

### Perplexity MCP - For Research

Use when you need:

- Best practices
- Performance benchmarks
- Latest trends
- Technical comparisons
- Troubleshooting
- Architecture patterns

**Examples:**

- "Best practices for React 19 server components?"
- "Bun vs Node.js performance comparison?"
- "How to optimize Drizzle queries?"

## Pre-Commit Checklist

Before every commit, verify:

- [ ] `bun run craft` executed (if files were added/moved/deleted)
- [ ] `bun run test` passes (all tests green)
- [ ] `bun run type-check` passes (no TypeScript errors)
- [ ] No `any` types in new code
- [ ] Code follows naming conventions
- [ ] Committed to feature branch (not main/dev)
- [ ] Commit message follows conventions

## Commit Message Conventions

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `test`: Test additions/updates
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples:**

```
feat(auth): implement JWT authentication

- Add JWT token generation
- Add token validation middleware
- Add refresh token logic

Closes #123
```

## Quality Gates Workflow

**Execute in order before committing:**

```bash
1. bun run craft        # Generate barrel files
2. bun run format       # Format code (Biome + Prettier)
3. bun run lint         # Lint code (Biome)
4. bun run type-check   # Type check (TypeScript)
5. bun run test         # Run tests (Bun test)
```

Or run all at once:

```bash
bun run quality  # Runs all quality gates
```

## Security Requirements

### Input Validation

```typescript
import { z } from "zod";

// ✅ Always validate at system boundaries
const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
});

// In Hono
app.post("/users", zValidator("json", CreateUserSchema), async (c) => {
  const data = c.req.valid("json"); // Type-safe and validated
  // ...
});
```

### Data Protection

```typescript
// ✅ Hash passwords with Bun
const hashedPassword = await Bun.password.hash(password, {
  algorithm: "bcrypt",
  cost: 10,
});

// ✅ Use environment variables for secrets
const config = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  redisUrl: process.env.REDIS_URL,
};

// ✅ Never commit .env files
// Add to .gitignore:
// .env
// .env.local
// .env.*.local
```

## Common Mistakes to Avoid

1. ❌ Forgetting `bun run craft` after file operations
2. ❌ Using `bun test` instead of `bun run test`
3. ❌ Committing with TypeScript errors
4. ❌ Committing directly to main/dev
5. ❌ Using `any` type
6. ❌ Forgetting to run tests before commit
7. ❌ Using Node.js APIs instead of Bun APIs
8. ❌ Relative imports instead of barrel files

## Remember

- **Project standards are mandatory** - Not suggestions
- **Automate what you can** - Use git hooks, pre-commit checks
- **Quality gates prevent bugs** - Don't skip them
- **Consistency matters** - Follow conventions strictly

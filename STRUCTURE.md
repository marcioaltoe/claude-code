# Marketplace Structure Overview

Complete technical reference and structure documentation for Claude Craftkit.

## Table of Contents

- [Directory Tree](#directory-tree)
- [Plugin Statistics](#plugin-statistics)
- [Plugin Descriptions](#plugin-descriptions)
- [Command Reference](#command-reference)
- [Specialized Agents](#specialized-agents)
- [Intelligent Skills](#intelligent-skills)
- [MCP Servers](#mcp-servers)
- [Hooks](#hooks)
- [Tech Stack Coverage](#tech-stack-coverage)
- [Plugin Details](#plugin-details)
- [Files Overview](#files-overview)
- [Customization](#customization)
- [Version Information](#version-information)
- [Maintenance](#maintenance)

## Directory Tree

Complete structure of Claude Craftkit:

```
claude-craftkit/
├── .claude-plugin/
│   └── marketplace.json              # Main marketplace manifest
│
├── plugins/
│   ├── db-tools/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json           # Plugin manifest
│   │   ├── commands/
│   │   │   ├── setup-drizzle.md
│   │   │   ├── create-schema.md
│   │   │   ├── generate-migration.md
│   │   │   └── create-query.md
│   │   └── skills/
│   │       └── database-architect.md
│   │
│   ├── ui/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   ├── add-shadcn-component.md
│   │   │   ├── create-custom-component.md
│   │   │   └── create-form.md
│   │   ├── skills/
│   │   │   ├── ui-designer.md
│   │   │   └── gesttione-design-system.md
│   │   └── README.md
│   │
│   ├── ai-sdk/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   ├── create-endpoint.md
│   │   │   └── add-function.md
│   │   └── skills/
│   │       └── ai-sdk-specialist.md
│   │
│   ├── quality/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   ├── setup-quality-gates.md
│   │   │   ├── create-test.md
│   │   │   └── quality-gates.md
│   │   └── skills/
│   │       └── quality-gates.md
│   │
│   ├── audio-notifications/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── hooks/
│   │   │   ├── audio_notification_hook.py
│   │   │   ├── audio_notification_hook.sh
│   │   │   └── hooks.json
│   │   └── README.md
│   │
│   ├── git/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   ├── commit.md
│   │   │   ├── commit-push-pr.md
│   │   │   └── clean_gone.md
│   │   ├── skills/
│   │   │   ├── git-commit.md
│   │   │   └── git-pr-creation.md
│   │   └── README.md
│   │
│   ├── reviewer/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   ├── download-issues.md
│   │   │   ├── fix-issues.md
│   │   │   └── pr-status.md
│   │   └── README.md
│   │
│   ├── ui-tests/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   ├── check.md
│   │   │   ├── take-screenshot.md
│   │   │   └── test-feature.md
│   │   └── skills/
│   │       └── web-tests.md
│   │
│   ├── architecture-design/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── skills/
│   │   │   ├── project-workflow.md
│   │   │   ├── code-standards.md
│   │   │   ├── clean-architecture.md
│   │   │   ├── naming-conventions.md
│   │   │   ├── error-handling-patterns.md
│   │   │   ├── typescript-type-safety.md
│   │   │   ├── backend-engineer.md
│   │   │   └── frontend-engineer.md
│   │   └── README.md
│   │
│   └── product-engineering/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       │   ├── discover.md
│       │   ├── specify.md
│       │   ├── design.md
│       │   ├── plan.md
│       │   └── validate.md
│       ├── templates/
│       │   ├── discovery.md
│       │   ├── spec.md
│       │   ├── technical-design.md
│       │   ├── adr.md
│       │   ├── implementation-plan.md
│       │   └── tasks.md
│       ├── agents/
│       │   ├── discovery-facilitator.md
│       │   ├── requirements-engineer.md
│       │   ├── solutions-architect.md
│       │   ├── task-planner.md
│       │   └── implementation-validator.md
│       ├── skills/
│       │   └── idea-refinement/
│       │       └── SKILL.md
│       ├── gates/
│       │   └── architecture-gates.md
│       ├── README.md
│       └── SUMMARY.md
│
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
├── STRUCTURE.md                      # This file
└── LICENSE                           # MIT License
```

## Plugin Statistics

### Summary Table

| Plugin              | Commands | Skills | Hooks | Agents | Templates | Category        |
| ------------------- | -------- | ------ | ----- | ------ | --------- | --------------- |
| db-tools            | 3        | 1      | 0     | 0      | 0         | Database        |
| ui                  | 3        | 2      | 0     | 0      | 0         | UI Architecture |
| ai-sdk              | 2        | 1      | 0     | 0      | 0         | AI              |
| quality             | 2        | 3      | 0     | 0      | 0         | Testing         |
| audio-notifications | 0        | 0      | 3     | 0      | 0         | QoL             |
| git                 | 3        | 2      | 0     | 0      | 0         | Workflow        |
| reviewer            | 3        | 0      | 0     | 0      | 0         | Development     |
| ui-tests            | 3        | 0      | 0     | 0      | 0         | Testing         |
| architecture-design | 0        | 8      | 0     | 0      | 0         | Development     |
| product-engineering | 5        | 1      | 0     | 5      | 6         | Workflow        |
| **TOTAL**           | **24**   | **18** | **3** | **5**  | **6**     | -               |

## Plugin Descriptions

### 1. Database Tools (`db-tools`)

**Category:** Database
**Author:** Leon van Zyl
**License:** MIT

Drizzle ORM and Postgres database management tools for Bun + Hono backend applications.

**Features:**

- Drizzle ORM integration with Bun + Hono
- PostgreSQL connection management with connection pooling
- Schema generation with TypeScript types
- Migration generation and management
- Type-safe query builders
- Relational query support
- Database schema validation

**Use Cases:**

- Setting up new database projects
- Creating and managing database schemas
- Generating type-safe migrations
- Building complex relational queries
- Database refactoring and evolution

### 2. UI Components (`ui`)

**Category:** UI Architecture
**Author:** Marcio Altoé
**License:** MIT

Comprehensive UI/UX toolkit for React applications with shadcn/ui, Tailwind CSS v4, and Clean Architecture patterns.

**Features:**

- 2 specialized skills: `ui-designer`, `gesttione-design-system` (architecture moved to architecture-design plugin)
- React 19 + Vite 6 + TanStack Router integration
- shadcn/ui component installation and customization
- TanStack ecosystem integration (Router, Query, Form, Table, Store)
- Design tokens and dark mode support
- Gesttione Design System with brand colors and metrics
- Form components with TanStack Form + Zod validation
- Responsive design with mobile-first approach
- WCAG 2.1 AA accessibility compliance

**Use Cases:**

- Setting up React project structure with Clean Architecture
- Installing shadcn/ui components
- Creating custom component libraries
- Building forms with validation
- Implementing design systems
- Configuring TanStack Router and Query
- Applying Gesttione brand identity
- Rapid UI prototyping

### 3. AI Integration (`ai-sdk`)

**Category:** AI
**Author:** Leon van Zyl
**License:** MIT

Vercel AI SDK integration helpers and patterns for Bun + Hono backend applications.

**Features:**

- Vercel AI SDK setup and configuration
- Streaming response implementation with Hono
- Multiple LLM provider support (OpenAI, Anthropic)
- Function calling patterns
- Chat endpoint generation
- Error handling and retries
- Token management

**Use Cases:**

- Setting up AI-powered chat interfaces
- Implementing streaming responses
- Adding function calling capabilities
- Integrating multiple AI providers
- Building AI-powered features

### 4. Testing & Quality (`quality`)

**Category:** Testing
**Author:** Marcio Altoé
**License:** MIT

Comprehensive quality gates workflow with testing, linting, formatting, and automation.

**Features:**

- 3 specialized skills: `test-engineer`, `quality-engineer`, `barrel-craft`
- Complete quality gates workflow with automated checks
- barrel-craft for automated barrel file management
- Biome configuration for linting/formatting (TS/JS/CSS)
- Prettier for markdown files
- TypeScript strict mode setup
- Bun built-in test with React Testing Library + Happy DOM
- Husky pre-commit hooks
- Test file generation with examples
- CI/CD integration helpers

**Use Cases:**

- Setting up complete quality gates workflow
- Automating code quality checks
- Writing unit tests for components and utilities
- Enforcing code standards
- Configuring pre-commit hooks
- Managing barrel files automatically

### 5. Audio Notifications (`audio-notifications`)

**Category:** Quality of Life
**Author:** Fred Lacs
**License:** MIT

Audio notifications for Claude Code - speaks notification messages out loud.

**Features:**

- Text-to-speech notifications via system TTS
- Event hook integration
- Configurable voice and speech rate
- Cross-platform support (macOS, Linux, Windows)
- Toggle on/off via config file
- Custom speech commands
- Accessibility enhancements

**Use Cases:**

- Getting audio feedback on long-running tasks
- Accessibility for visually impaired users
- Background task notifications
- Multi-tasking workflow enhancement

### 6. Commit Commands (`git`)

**Category:** Workflow
**Author:** Marcio Altoé
**License:** MIT

Git workflow automation with intelligent skills and quick commands for conventional commits and PR creation.

**Features:**

- **Hybrid architecture:** Autonomous skills + explicit commands
- Conventional Commits specification compliance
- Automated commit message generation
- Comprehensive PR descriptions with technical details
- GitHub CLI integration
- Branch validation and management
- Git workflow best practices

**Use Cases:**

- Automating git commit workflows
- Creating conventional commit messages
- Generating comprehensive PR descriptions
- Managing git branches
- Enforcing commit standards

### 7. PR Reviewer (`reviewer`)

**Category:** Development
**Author:** Marcio Altoé
**License:** MIT

CodeRabbit AI review management - download, organize, and fix PR review comments systematically.

**Features:**

- CodeRabbit AI integration
- Download PR review comments
- Organize issues by file and severity
- Track review status
- Systematic issue resolution workflow
- GitHub CLI integration

**Use Cases:**

- Managing CodeRabbit AI review feedback
- Tracking PR review progress
- Organizing and prioritizing review comments
- Systematic code review improvements

### 8. UI Tests (`ui-tests`)

**Category:** Testing
**Author:** Marcio Altoé
**License:** MIT

Browser automation and web testing with Playwright - auto-detects dev servers, creates test scripts, captures screenshots.

**Features:**

- Playwright browser automation
- Auto-detect development servers
- Screenshot capture and comparison
- Web page health checks (broken links, errors)
- Feature testing automation
- E2E test script generation

**Use Cases:**

- Browser automation and testing
- Visual regression testing
- Web page health monitoring
- E2E test creation
- Screenshot documentation

### 9. Architecture & Design (`architecture-design`)

**Category:** Development
**Author:** Marcio Altoé
**License:** MIT

Architecture and design patterns with SOLID principles, Clean Code standards, and TypeScript best practices for building maintainable applications.

**Features:**

- 8 specialized skills covering all architecture aspects
- SOLID principles + Clean Code standards (KISS, YAGNI, DRY, TDA) consolidated in `code-standards` skill
- Clean Architecture patterns (domain/application/infrastructure/presentation)
- Backend engineering with Hono, DDD, and custom DI Container
- Frontend engineering with React 19, TanStack ecosystem, and monorepo patterns
- TypeScript type safety best practices
- Comprehensive naming conventions
- Error handling patterns and strategies
- Project-specific standards for Bun + TypeScript stack

**Use Cases:**

- Enforcing SOLID principles in class design
- Implementing Clean Architecture patterns (backend and frontend)
- Backend development with Hono + Bun + Drizzle ORM
- Frontend development with React 19 + TanStack Router + TanStack Store
- Monorepo setup with Turborepo and Bun/pnpm workspaces
- Custom DI Container implementation with Symbol-based tokens
- Applying Clean Code standards
- TypeScript type safety guidance
- Naming conventions enforcement
- Error handling strategy implementation
- Project standards compliance

### 10. Product Engineering (`product-engineering`)

**Category:** Workflow
**Author:** Marcio Altoé
**License:** MIT

Complete workflow from idea to implementation: Discovery → Specification → Design → Planning → Validation with MCP integration, architecture gates, and full traceability.

**Features:**

- **5-phase workflow:** Discovery → Spec → Design → Plan → Validate
- **5 commands** (one per phase) for manual control between phases
- **5 specialized agents** for autonomous execution
- **6 templates** with YAML frontmatter and auto-numbering
- **7 architecture gates** enforce quality (Simplicity, Type Safety, Clean Code, Test-First, Clean Architecture, Feature-Based, Naming)
- **MCP integration** at every phase (Perplexity, Context7, Octocode)
- **Test-first methodology** (TDD mandatory with Red-Green-Refactor)
- **Full traceability:** Idea → Discovery → Spec → Design → Tasks → Code
- **Editable markdown output** for human review
- Architecture Decision Records (ADRs) for major technical decisions
- Integration with superpowers plugin for task execution

**Workflow:**
1. `/product-engineering:discover` - Rough idea → Discovery document (with market research)
2. `/product-engineering:specify` - Discovery → PRD with user stories and requirements
3. `/product-engineering:design` - PRD → Technical design + ADRs (architecture gates validation)
4. `/product-engineering:plan` - Design → Implementation plan + atomic tasks (5-20 min each)
5. `/product-engineering:validate` - Validate implementation against spec and gates

**Use Cases:**

- Transforming rough ideas into validated discovery documents
- Creating comprehensive PRDs with user stories and requirements
- Designing architecture with research-backed decisions
- Breaking designs into implementable tasks
- Validating implementations against requirements
- Enforcing architecture gates throughout development
- Maintaining traceability from idea to code
- Systematic product development workflow

## Command Reference

Complete list of all available commands across all plugins.

### Database Tools (3 commands)

| Command               | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| `/create-schema`      | Generate database table schemas with TypeScript types and relations |
| `/generate-migration` | Create database migration files based on schema changes             |
| `/create-query`       | Generate type-safe database queries with Drizzle query builder      |

### UI Components (3 commands)

| Command             | Description                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `/add-shadcn`       | Install shadcn/ui components using MCP server integration            |
| `/create-component` | Generate custom React components with TypeScript and Tailwind CSS    |
| `/create-form`      | Create forms with validation, error handling, and shadcn/ui elements |

### AI SDK (2 commands)

| Command            | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `/create-endpoint` | Create streaming chat API endpoints with error handling       |
| `/add-function`    | Implement AI function calling with type-safe tool definitions |

### Testing & Quality (2 commands)

| Command        | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `/create-test` | Generate test files with Bun test and React Testing Library examples |
| `/check`       | Run complete workflow: craft → format → lint → type-check → test     |

### Git Workflow (3 commands)

| Command           | Description                                                             |
| ----------------- | ----------------------------------------------------------------------- |
| `/commit`         | Quick commit with conventional format (explicit control)                |
| `/commit-push-pr` | Complete workflow: stage → commit → push → create PR (explicit control) |
| `/clean`          | Clean up local branches that have been deleted on the remote            |

**Note:** The git plugin also includes 2 autonomous skills (`git-commit` and `git-pr-creation`) that work automatically based on context. See [Intelligent Skills](#intelligent-skills) section.

### PR Reviewer (3 commands)

| Command              | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `/download-issues`   | Download CodeRabbit AI review comments for a Pull Request     |
| `/fix-issues`        | Fix issues for a given PR systematically                      |
| `/pr-status`         | Check status of PR review issues                              |

### UI Tests (3 commands)

| Command            | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `/check`           | Check webpage for issues (broken links, errors, etc.)         |
| `/take-screenshot` | Take screenshots of web pages                                 |
| `/test-feature`    | Test a webapp feature with Playwright                         |

### Product Engineering (5 commands)

| Command                        | Description                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| `/product-engineering:discover` | PHASE 1: Transform rough idea into validated discovery document with MCP-powered research    |
| `/product-engineering:specify`  | PHASE 2: Create PRD with user stories, functional/non-functional requirements, and traceability |
| `/product-engineering:design`   | PHASE 3: Design architecture with ADRs, tech stack decisions, and architecture gates validation |
| `/product-engineering:plan`     | PHASE 4: Break design into atomic tasks (5-20 min each) with full traceability              |
| `/product-engineering:validate` | PHASE 5: Validate implementation against spec, requirements, and architecture gates          |

## Intelligent Skills

Skills are autonomous capabilities that Claude invokes automatically based on context.

### 1. database-architect

**Plugin:** db-tools
**Type:** Autonomous skill
**Focus:** Database design and Drizzle ORM

**Invocation Examples:**

- "set up database with Drizzle"
- "create a users table"
- "design a schema for blog posts"

**Capabilities:**

- Schema design and optimization
- Database normalization strategies
- Migration planning and execution
- Query optimization and indexing
- Relational data modeling
- Type-safe query generation
- Database best practices enforcement

### 2. ui-designer

**Plugin:** ui
**Type:** Autonomous skill
**Focus:** UI/UX with shadcn/ui and Tailwind CSS v4

**Invocation Examples:**

- "create a pricing card component"
- "design a responsive navigation"
- "build a form with validation"

**Capabilities:**

- Component design and architecture (React 19 + Vite)
- Responsive layout implementation
- Accessibility (WCAG 2.1 AA) compliance
- Design system integration
- Tailwind v4 utility optimization
- Component composition patterns
- Theme and dark mode management

### 3. gesttione-design-system

**Plugin:** ui
**Type:** Autonomous skill
**Focus:** Gesttione brand identity and design system

**Invocation Examples:**

- "use Gesttione brand colors"
- "create revenue metric card"
- "apply Gesttione design system"

**Capabilities:**

- Gesttione brand color system (6 core colors)
- Metric color semantics (revenue, CMV, purchases, costs, etc.)
- Surface color generation with color-mix()
- Typography system (Geist, Lora, Geist Mono)
- Dashboard component patterns
- WCAG AA/AAA accessibility with brand colors

### 4. architecture-auditor

**Plugin:** architecture-design
**Type:** Autonomous skill
**Focus:** Architecture audit and compliance verification

**Invocation Examples:**

- "audit frontend against CLAUDE.md"
- "what doesn't match our architecture"
- "find inconsistencies with backend patterns"
- "check if features follow clean architecture"

**Capabilities:**

- Comprehensive codebase analysis
- Architecture pattern evaluation
- Technical debt assessment
- Documentation compliance verification (CLAUDE.md, specs, ADRs)
- Frontend and backend architecture review
- Design pattern validation
- Dependency rule enforcement
- Layer separation verification

### 5. ai-sdk-specialist

**Plugin:** ai-sdk
**Type:** Autonomous skill
**Focus:** Vercel AI SDK and LLM integration

**Invocation Examples:**

- "create a chat endpoint"
- "add AI streaming"
- "implement function calling"

**Capabilities:**

- LLM integration patterns
- Streaming response implementation
- Function calling setup
- Error handling and retries
- Token management strategies
- Multi-provider support (OpenAI, Anthropic)
- AI SDK configuration best practices

### 6. test-engineer

**Plugin:** quality
**Type:** Autonomous skill
**Focus:** Test creation and testing best practices

**Invocation Examples:**

- "create tests for this component"
- "write unit tests"
- "add test coverage"

**Capabilities:**

- Test file generation with Bun test
- React Testing Library patterns
- Mock and stub creation
- Test organization and structure
- Coverage analysis
- Testing best practices enforcement

### 7. quality-engineer

**Plugin:** quality
**Type:** Autonomous skill
**Focus:** Code quality and linting configuration

**Invocation Examples:**

- "set up quality gates"
- "configure linting"
- "set up code quality tools"

**Capabilities:**

- Complete quality gates workflow setup
- Biome configuration for linting/formatting (TS/JS/CSS)
- Prettier for markdown
- TypeScript strict mode setup
- Husky pre-commit hooks
- Quality workflow automation

### 8. barrel-craft

**Plugin:** quality
**Type:** Autonomous skill
**Focus:** Barrel file management and exports

**Invocation Examples:**

- "update barrel files"
- "organize exports"
- "configure barrel-craft"

**Capabilities:**

- Automated barrel file generation
- Export management and organization
- barrel-craft configuration
- Import path optimization
- Module structure maintenance

### 9. git-commit

**Plugin:** git
**Type:** Autonomous skill
**Description:** Automatically detects when to commit and creates conventional commits

**Invocation Examples:**

- "commit these changes"
- "save this work"
- "I'm done with this feature, let's commit"
- "create a commit for the auth updates"

**Capabilities:**

- Analyzes code changes automatically
- Generates conventional commit messages
- Validates branch (prevents commits to main/dev)
- Runs quality checks (tests, type checking)
- Follows Conventional Commits specification
- Provides context-aware commit messages

**Workflow:**

1. Analyzes staged and unstaged changes
2. Determines appropriate commit type and scope
3. Generates descriptive commit message
4. Validates branch and project state
5. Executes commit with proper format

### 10. git-pr-creation

**Plugin:** git
**Type:** Autonomous skill
**Description:** Automatically creates comprehensive PRs when work is complete

**Invocation Examples:**

- "create a PR"
- "ready for review"
- "open a pull request"
- "submit this to dev"
- "all tests passing, let's get this reviewed"

**Capabilities:**

- Automatically detects when work is ready
- Analyzes all commits in branch
- Creates comprehensive PR descriptions
- Follows Conventional Commits for titles
- GitHub CLI integration
- Technical documentation with code examples
- Best practices for code review

**Workflow:**

1. Verifies GitHub CLI authentication
2. Analyzes commits from dev..HEAD
3. Categorizes changes by type
4. Generates PR title (conventional format)
5. Creates detailed PR body with examples
6. Executes gh pr create command

### 11. project-workflow

**Plugin:** architecture-design
**Type:** Autonomous skill
**Focus:** Development workflow and quality gates for Bun + TypeScript stack

**Invocation Examples:**

- "Before commit"
- "Quality gates"
- "Workflow checklist"
- "Bun commands"
- "Pre-commit checks"

**Capabilities:**

- Pre-commit checklist (mandatory execution order)
- Quality gates workflow (craft → format → lint → type-check → test)
- Bun-specific commands (`bun run test` vs `bun test`)
- Bun runtime APIs (password hashing, file operations, UUID v7, SQLite)
- Barrel files workflow (`bun run craft`)
- Common workflow mistakes prevention
- Quick reference for commit workflow

**Note:** For complete project rules and standards, see CLAUDE.md (global instructions)

### 12. code-standards

**Plugin:** architecture-design
**Type:** Autonomous skill
**Focus:** Code design standards including SOLID principles (SRP, OCP, LSP, ISP, DIP) and Clean Code patterns (KISS, YAGNI, DRY, TDA)

**Invocation Examples:**

- "Apply SOLID principles to this class"
- "Keep this code simple"
- "Refactor this function"
- "Designing new module"
- "Architecture review needed"
- "Code review needed"
- "Avoid over-engineering"
- "Is this too complex?"

**Capabilities:**

**SOLID Principles (OOP Design):**
- Single Responsibility Principle (SRP) - One reason to change per class/module
- Open/Closed Principle (OCP) - Open for extension, closed for modification
- Liskov Substitution Principle (LSP) - Subtypes must be substitutable for base types
- Interface Segregation Principle (ISP) - Small, focused interfaces over large ones
- Dependency Inversion Principle (DIP) - Depend on abstractions, not concretions

**Clean Code Principles (Simplicity & Pragmatism):**
- KISS (Keep It Simple, Stupid) - Simplicity over complexity
- YAGNI (You Aren't Gonna Need It) - Build only what's needed right now
- DRY (Don't Repeat Yourself) - Apply abstraction after Rule of Three (3 occurrences)
- TDA (Tell, Don't Ask) - Tell objects what to do, don't ask for data and make decisions

**Function Design & Code Organization:**
- Keep functions < 20 lines
- Meaningful names over comments
- Single level of abstraction per function
- Early returns to reduce nesting
- Anti-pattern detection (God classes, premature optimization, clever code, magic numbers)
- When to apply principles (and when NOT to over-apply)

### 13. clean-architecture

**Plugin:** architecture-design
**Type:** Autonomous skill
**Focus:** Clean Architecture including layered architecture, dependency rule, and DDD patterns

**Invocation Examples:**

- "Structure this using Clean Architecture"
- "Create a use case for user registration"
- "Design domain entities"
- "Implement repository pattern"

**Capabilities:**

- The Dependency Rule - Dependencies point inward toward domain
- Domain Layer - Pure business logic (Entities, Value Objects, Domain Services)
- Application Layer - Use Cases, DTOs, Ports (interfaces)
- Infrastructure Layer - Adapters (repositories, external services)
- Presentation Layer - Controllers, routes, HTTP/CLI handling
- Repository pattern and Dependency Injection
- Testing strategy (pure unit tests for domain, mocked tests for application)
- Anti-patterns to avoid (anemic domain model, fat controllers)

### 14. naming-conventions

**Plugin:** architecture-design
**Type:** Autonomous skill
**Focus:** Comprehensive naming standards for files, directories, classes, functions, and variables

**Invocation Examples:**

- "Review naming conventions in this file"
- "Creating new files"
- "Naming this function"
- "Refactor variable names"

**Capabilities:**

- File naming: `kebab-case` with descriptive suffixes
- Directory naming: Plural for collections, singular for modules
- Classes & Interfaces: `PascalCase`
- Functions & Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Boolean naming: `is`, `has`, `can`, `should` prefixes
- Interface vs Implementation naming
- DTO and Response naming
- Use Case naming

### 15. error-handling-patterns

**Plugin:** architecture-design
**Type:** Autonomous skill
**Focus:** Error handling patterns including exceptions, Result pattern, and validation strategies

**Invocation Examples:**

- "Help me with error handling"
- "Implement validation logic"
- "Create custom exception types"
- "Add retry mechanism"

**Capabilities:**

- Use exceptions, not return codes
- Never return null for errors
- Provide context with exceptions
- Exception hierarchy (domain and infrastructure exceptions)
- Result pattern for expected failures
- Validation patterns (input validation at boundaries, domain validation)
- Error recovery patterns (retry logic, circuit breaker, fallback values)
- Structured error logging
- HTTP error handling with Hono

### 16. typescript-type-safety

**Plugin:** architecture-design
**Type:** Autonomous skill
**Focus:** TypeScript type safety including type guards, branded types, and advanced type system features

**Invocation Examples:**

- "Implement type guards for this data"
- "Working with unknown types"
- "Create branded types"
- "Advanced TypeScript patterns"

**Capabilities:**

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
- TypeScript strict mode configuration

### 17. backend-engineer

**Plugin:** architecture-design
**Type:** Autonomous skill
**Focus:** Backend engineering with Clean Architecture, DDD, and Hono framework

**Invocation Examples:**

- "Create a backend API"
- "Implement repository pattern"
- "Add use case"
- "Backend structure"
- "Setup dependency injection"

**Capabilities:**

- Domain Layer examples (Entities, Value Objects, Ports)
- Application Layer examples (Use Cases, DTOs, Mappers)
- Infrastructure Layer examples (Repositories, Adapters, DI Container)
- Presentation Layer examples (Routes, Controllers, Schemas with Zod)
- Custom DI Container with Symbol-based tokens
- Lifetime management (singleton, scoped, transient)
- Composition root pattern
- Best practices for backend development
- Common patterns (Result type, Domain Events, Repository pattern)
- Clean Architecture with Hono + Bun + Drizzle ORM

### 18. frontend-engineer

**Plugin:** architecture-design
**Type:** Autonomous skill
**Focus:** Frontend engineering with Clean Architecture, React 19, and TanStack ecosystem

**Invocation Examples:**

- "Create a frontend feature"
- "Implement gateway pattern"
- "Setup monorepo structure"
- "State management with TanStack Store"
- "React component architecture"

**Capabilities:**

- Monorepo structure (apps/ + packages/ with Turborepo)
- Feature-based Clean Architecture (domain, application, infrastructure, presentation)
- Gateway/Port pattern for HTTP, storage, events
- Thin Use Cases that delegate to gateways
- State Management (TanStack Store for local state + TanStack Query for server state)
- HTTP Service with Axios interceptors and error handling
- TanStack Router file-based routing with type safety
- Testing strategy (unit tests with mock gateways, component tests, E2E tests)
- Best practices for frontend development
- React 19 + Vite 6 + TanStack ecosystem integration

### 19. pull-request-skill

**Plugin:** reviewer
**Type:** Autonomous skill
**Focus:** Pull Request review management for CodeRabbit AI

**Invocation Examples:**

- "download PR reviews"
- "fix CodeRabbit issues for PR 123"
- "check review status"
- "organize review comments by severity"

**Capabilities:**

- Download CodeRabbit AI review comments from GitHub PRs
- Organize issues by severity (critical, major, trivial)
- Track issue resolution status
- Systematically guide through review feedback
- Generate review summaries and reports
- Prioritize fixes by impact
- Monitor progress on review resolution

### 20. web-tests

**Plugin:** ui-tests
**Type:** Autonomous skill
**Focus:** Browser automation with Playwright

**Invocation Examples:**

- "test this page"
- "take screenshots of responsive design"
- "test login flow"
- "check for broken links"
- "validate form submission"

**Capabilities:**

- Complete browser automation with Playwright
- Auto-detects running dev servers
- E2E testing for web applications
- Responsive design validation (mobile, tablet, desktop)
- Form testing and validation
- Screenshot capture across viewports
- Login flow testing
- Broken link detection
- Custom test script generation
- Saves tests to working directory for reusability

### 21. idea-refinement

**Plugin:** product-engineering
**Type:** Autonomous skill
**Focus:** Transform rough ideas into validated discovery documents

**Invocation Examples:**

- "I have an idea for a new feature"
- "Help me refine this product concept"
- "Research this idea"
- "Validate this product idea"

**Capabilities:**

- Socratic questioning to elicit details (one question at a time)
- MCP-powered market research (Perplexity for trends, Context7 for docs, Octocode for reference implementations)
- Problem validation and solution exploration
- Alternative analysis (always explore 2-3 alternatives)
- Evidence-based recommendations
- Discovery document generation with YAML frontmatter
- YAGNI enforcement (no technical decisions at discovery phase)
- Research-first approach with targeted questions

**Process (6 phases):**
1. Initial Understanding - Grasp the rough idea
2. Market Research - Use MCP servers for competitive analysis and trends
3. Problem Validation - Ensure problem is real and worth solving
4. Solution Exploration - Explore 2-3 alternative approaches
5. Recommendation & Decision - Evidence-based recommendation
6. Discovery Documentation - Generate docs/discovery/DISC-{###}-{name}.md

**MCP Integration Pattern:**
- Perplexity: Market research, competitors, trends, best practices
- Context7: Framework documentation, implementation patterns
- Octocode: Reference implementations from GitHub repositories

## Hooks

Hooks are event handlers that execute on specific Claude Code events.

### audio-notifications Plugin

The audio-notifications plugin provides event hooks for text-to-speech notifications.

**Hook Files:**

- `audio_notification_hook.py` - Python implementation
- `audio_notification_hook.sh` - Shell script implementation
- `hooks.json` - Hook configuration

**Configuration File:** `~/.claude/audio_notifications.json`

```json
{
  "audio_off": false,
  "speech_command": "say"
}
```

**Options:**

- `audio_off`: Boolean to enable/disable audio (default: false)
- `speech_command`: System TTS command:
  - macOS: `"say"` or `"say -v Victoria"`
  - Linux: `"spd-say"` or `"espeak"`
  - Windows: Configure via PowerShell speech

**Events Handled:**

- Task completion notifications
- Error notifications
- Long-running process updates

## Tech Stack Coverage

This marketplace provides comprehensive support for modern web development:

✅ **Backend Runtime:** Bun (TypeScript runtime)
✅ **Backend Framework:** Hono (lightweight, fast web framework)
✅ **Database:** PostgreSQL with Drizzle ORM (migrations, queries, schemas, relations)
✅ **Frontend Framework:** React 19 with Vite 6
✅ **Routing:** TanStack Router (file-based, type-safe)
✅ **UI Styling:** Tailwind CSS v4 with design tokens and dark mode
✅ **UI Components:** shadcn/ui component library
✅ **State Management:** TanStack Query + Zustand + TanStack Store
✅ **Forms:** TanStack Form + Zod validation
✅ **Architecture:** Clean Architecture (domain/application/infrastructure/presentation)
✅ **Design System:** Gesttione brand colors and metrics
✅ **AI Integration:** Vercel AI SDK with OpenAI & Anthropic support
✅ **Testing:** Bun built-in test + React Testing Library + Happy DOM
✅ **Code Quality:** Biome (TS/JS/CSS) + Prettier (markdown) + barrel-craft
✅ **Pre-commit Hooks:** Husky with quality gates
✅ **Quality of Life:** Audio notifications for task completion
✅ **Git Workflow:** Conventional Commits and automated PR creation

## Plugin Details

### db-tools

- **Version:** 1.0.0
- **Author:** Leon van Zyl
- **License:** MIT
- **Category:** Database
- **Keywords:** drizzle, postgres, orm, migrations, database

### ui

- **Version:** 1.0.0
- **Author:** Marcio Altoé
- **License:** MIT
- **Category:** UI Architecture
- **Keywords:** react, vite, tanstack-router, shadcn, tailwind, clean-architecture, design-system, gesttione

### ai-sdk

- **Version:** 1.0.0
- **Author:** Leon van Zyl
- **License:** MIT
- **Category:** AI
- **Keywords:** ai, vercel-ai-sdk, llm, streaming, openai, anthropic

### quality

- **Version:** 1.0.0
- **Author:** Marcio Altoé
- **License:** MIT
- **Category:** Testing
- **Keywords:** bun-test, quality-gates, biome, prettier, barrel-craft, husky, testing, typescript

### audio-notifications

- **Version:** 1.0.0
- **Author:** Fred Lacs
- **License:** MIT
- **Category:** Quality of Life
- **Keywords:** audio, notifications, tts, accessibility, text-to-speech

### git

- **Version:** 1.0.0
- **Author:** Marcio Altoé
- **License:** MIT
- **Category:** Workflow
- **Keywords:** git, commit, conventional-commits, pull-request, workflow, automation, skills
- **Architecture:** Hybrid approach with autonomous skills and explicit commands

### reviewer

- **Version:** 1.0.0
- **Author:** Marcio Altoé
- **License:** MIT
- **Category:** Development
- **Keywords:** github, pr, code-review, coderabbit, automation, reviewer

### ui-tests

- **Version:** 1.0.0
- **Author:** Marcio Altoé
- **License:** MIT
- **Category:** Testing
- **Keywords:** playwright, browser-automation, testing, e2e, screenshots, web-testing

### architecture-design

- **Version:** 1.0.0
- **Author:** Marcio Altoé
- **License:** MIT
- **Category:** Development
- **Keywords:** architecture, design-patterns, code-standards, solid-principles, clean-code, typescript, naming-conventions, best-practices

### product-engineering

- **Version:** 1.0.0
- **Author:** Marcio Altoé
- **License:** MIT
- **Category:** Workflow
- **Keywords:** product-engineering, discovery, specification, prd, technical-design, architecture-decision-records, adr, implementation-planning, requirements-engineering, mcp-integration, traceability

## Files Overview

### Marketplace Level

- **1** Marketplace manifest (`.claude-plugin/marketplace.json`)
- **1** Main README (README.md)
- **1** Quick start guide (QUICKSTART.md)
- **1** Structure documentation (STRUCTURE.md)
- **1** License file (LICENSE)

### Plugin Level

- **10** Plugin manifests (`plugin.json` in each plugin)
- **24** Command files (`.md` files in `commands/` directories)
- **18** Skill definitions (`.md` files in `skills/` directories)
- **5** Agent definitions (in product-engineering)
- **6** Template files (in product-engineering)
- **3** Hook files (in audio-notifications)
- **8** Plugin READMEs (db-tools, ui, quality, git, reviewer, ui-tests, architecture-design, product-engineering)

**Total: 75 files** providing comprehensive Claude Code development support.

## Installation Size

Approximate sizes:

- Commands: ~30-40 KB total
- Agents: ~10-20 KB total
- Skills: ~15-25 KB total
- Hooks: ~5-10 KB total
- Manifests: ~3-5 KB total
- Documentation: ~25-30 KB total

**Total marketplace size: ~90-130 KB** (text files only, no dependencies)

## Customization

### Modifying Commands

1. Edit `.md` files in `plugins/[plugin-name]/commands/`
2. Update command logic and instructions
3. Reinstall plugin: `/plugin uninstall` then `/plugin install`

### Modifying Skills

1. Edit `.md` files in `plugins/[plugin-name]/skills/`
2. Update skill description (determines when Claude invokes it)
3. Update skill instructions and capabilities
4. Reinstall plugin

**Important:** The skill `description` field is critical - it determines when Claude automatically invokes the skill. Be specific about trigger phrases and use cases.

### Adding New Plugins

1. Create directory: `plugins/your-plugin-name/`
2. Add `.claude-plugin/plugin.json` with metadata
3. Add `commands/` and/or `skills/` directories
4. Update `.claude-plugin/marketplace.json`
5. Install: `/plugin install your-plugin-name@claude-craftkit`

### Plugin Structure Template

```
plugins/your-plugin-name/
├── .claude-plugin/
│   └── plugin.json           # Required: Plugin metadata
├── commands/                 # Optional: Slash commands (explicit control)
│   └── your-command.md
├── skills/                   # Optional: Autonomous skills (intelligent invocation)
│   └── your-skill.md
├── hooks/                    # Optional: Event hooks
│   └── hooks.json
└── README.md                 # Optional: Plugin documentation
```

### Creating Custom Commands

Command files (`.md`) should follow this structure:

```markdown
---
allowed-tools: Bash(git add:*), Bash(git commit:*)
description: Brief description of what this command does
---

## Your Command Instructions

Instructions for Claude on how to execute this command...
```

### Creating Custom Skills

Skill files (`.md`) should follow this structure:

```markdown
---
name: your-skill-name
description: Detailed description of when to use this skill, with trigger examples. The more specific, the better Claude can determine when to invoke it automatically.
---

## Your Skill Instructions

Instructions for Claude on how to execute this skill...
```

**Key Differences:**

- **Commands** are explicitly invoked by users (`/command-name`) for direct control
- **Skills** are automatically invoked by Claude based on context and user intent

## Version Information

- **Marketplace Version:** 1.0.0
- **All Plugin Versions:** 1.0.0
- **Created:** 2025
- **Maintainer:** Marcio Altoé (marcio.altoe@gmail.com)
- **Contributors:** Leon van Zyl, Fred Lacs

## Maintenance

### Updating Plugins

1. Make changes to plugin files
2. Update version in `plugin.json`
3. Update marketplace version if needed
4. Test changes locally
5. Reinstall plugin:
   ```bash
   /plugin uninstall plugin-name@claude-craftkit
   /plugin install plugin-name@claude-craftkit
   ```

### Publishing Updates

1. Update version numbers
2. Update CHANGELOG (if exists)
3. Tag release in git
4. Push to GitHub
5. Create GitHub Release
6. Users update via: `/plugin update`

---

**For installation and usage tutorials, see [QUICKSTART.md](QUICKSTART.md).**
**For overview and examples, see [README.md](README.md).**

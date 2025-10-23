# Marketplace Structure Overview

Complete technical reference and structure documentation for the Claude Code Marketplace.

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

Complete structure of the Claude Code Marketplace:

```
claude-code-marketplace/
├── .claude-plugin/
│   └── marketplace.json              # Main marketplace manifest
│
├── plugins/
│   ├── database-tools/
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
│   ├── ui-components/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   ├── add-shadcn-component.md
│   │   │   ├── create-custom-component.md
│   │   │   └── create-form.md
│   │   ├── skills/
│   │   │   ├── ui-designer.md
│   │   │   ├── frontend-architect.md
│   │   │   └── gesttione-design-system.md
│   │   └── README.md
│   │
│   ├── ai-integration/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   ├── setup-ai-sdk.md
│   │   │   ├── create-chat-endpoint.md
│   │   │   └── add-function-calling.md
│   │   └── skills/
│   │       └── ai-integration-specialist.md
│   │
│   ├── testing-quality/
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
│   └── commit-commands/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       │   ├── commit.md
│       │   ├── commit-push-pr.md
│       │   └── clean_gone.md
│       ├── skills/
│       │   ├── git-commit.md
│       │   └── git-pr-creation.md
│       └── README.md
│
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
├── STRUCTURE.md                      # This file
└── LICENSE                           # MIT License
```

## Plugin Statistics

### Summary Table

| Plugin              | Commands | Skills | Hooks | Category        |
| ------------------- | -------- | ------ | ----- | --------------- |
| database-tools      | 4        | 1      | 0     | Database        |
| ui-components       | 3        | 3      | 0     | UI Architecture |
| ai-integration      | 3        | 1      | 0     | AI              |
| testing-quality     | 3        | 1      | 0     | Testing         |
| audio-notifications | 0        | 0      | 3     | QoL             |
| commit-commands     | 3        | 2      | 0     | Workflow        |
| **TOTAL**           | **16**   | **8**  | **3** | -               |

## Plugin Descriptions

### 1. Database Tools (`database-tools`)

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

### 2. UI Components (`ui-components`)

**Category:** UI Architecture
**Author:** Marcio Altoe
**License:** MIT

Comprehensive UI/UX toolkit for React applications with shadcn/ui, Tailwind CSS v4, and Clean Architecture patterns.

**Features:**

- 3 specialized skills: `ui-designer`, `frontend-architect`, `gesttione-design-system`
- React 19 + Vite 6 + TanStack Router integration
- shadcn/ui component installation and customization
- Clean Architecture implementation (domain/application/infrastructure/presentation)
- TanStack ecosystem (Router, Query, Form, Table, Store)
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

### 3. AI Integration (`ai-integration`)

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

### 4. Testing & Quality (`testing-quality`)

**Category:** Testing
**Author:** Marcio Altoe
**License:** MIT

Comprehensive quality gates workflow with testing, linting, formatting, and automation.

**Features:**

- Complete quality gates workflow (`quality-gates` skill)
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

### 6. Commit Commands (`commit-commands`)

**Category:** Workflow
**Author:** Marcio Altoe
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

## Command Reference

Complete list of all available commands across all plugins.

### Database Tools (4 commands)

| Command               | Description                                                                      |
| --------------------- | -------------------------------------------------------------------------------- |
| `/setup-drizzle`      | Initialize Drizzle ORM with Postgres connection, schema setup, and configuration |
| `/create-schema`      | Generate database table schemas with TypeScript types and relations              |
| `/generate-migration` | Create database migration files based on schema changes                          |
| `/create-query`       | Generate type-safe database queries with Drizzle query builder                   |

### UI Components (3 commands)

| Command                    | Description                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| `/add-shadcn-component`    | Install shadcn/ui components using MCP server integration            |
| `/create-custom-component` | Generate custom React components with TypeScript and Tailwind CSS    |
| `/create-form`             | Create forms with validation, error handling, and shadcn/ui elements |

### AI Integration (3 commands)

| Command                 | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `/setup-ai-sdk`         | Initialize Vercel AI SDK with provider configuration          |
| `/create-chat-endpoint` | Create streaming chat API endpoints with error handling       |
| `/add-function-calling` | Implement AI function calling with type-safe tool definitions |

### Testing & Quality (3 commands)

| Command                | Description                                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| `/setup-quality-gates` | Configure complete quality gates workflow with all tools               |
| `/create-test`         | Generate test files with Bun test and React Testing Library examples  |
| `/quality-gates`       | Run complete workflow: craft → format → lint → type-check → test      |

### Commit Commands (3 commands)

| Command           | Description                                                             |
| ----------------- | ----------------------------------------------------------------------- |
| `/commit`         | Quick commit with conventional format (explicit control)                |
| `/commit-push-pr` | Complete workflow: stage → commit → push → create PR (explicit control) |
| `/clean_gone`     | Clean up local branches that have been deleted on the remote            |

**Note:** The commit-commands plugin also includes 2 autonomous skills (`git-commit` and `git-pr-creation`) that work automatically based on context. See [Intelligent Skills](#intelligent-skills) section.

## Intelligent Skills

Skills are autonomous capabilities that Claude invokes automatically based on context.

### 1. database-architect

**Plugin:** database-tools
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

**Plugin:** ui-components
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

### 3. frontend-architect

**Plugin:** ui-components
**Type:** Autonomous skill
**Focus:** Clean Architecture and TanStack ecosystem

**Invocation Examples:**
- "set up React project with Clean Architecture"
- "organize feature modules"
- "configure TanStack Router"

**Capabilities:**

- Clean Architecture implementation
- React 19 patterns and best practices
- TanStack ecosystem integration (Router, Query, Form, Table, Store)
- State management strategy (Zustand, TanStack Query)
- Code organization and feature modules
- Type-safe routing and navigation
- Performance patterns

### 4. gesttione-design-system

**Plugin:** ui-components
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

### 5. ai-integration-specialist

**Plugin:** ai-integration
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

### 6. quality-gates

**Plugin:** testing-quality
**Type:** Autonomous skill
**Focus:** Complete quality workflow

**Invocation Examples:**
- "set up quality gates"
- "configure testing"
- "run quality checks"

**Capabilities:**

- Complete quality gates workflow setup
- barrel-craft configuration for exports
- Biome for linting/formatting (TS/JS/CSS)
- Prettier for markdown
- TypeScript strict mode
- Bun test with React Testing Library
- Husky pre-commit hooks

### 7. git-commit

**Plugin:** commit-commands
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

### 8. git-pr-creation

**Plugin:** commit-commands
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

### database-tools

- **Version:** 1.0.0
- **Author:** Leon van Zyl
- **License:** MIT
- **Category:** Database
- **Keywords:** drizzle, postgres, orm, migrations, database

### ui-components

- **Version:** 1.0.0
- **Author:** Marcio Altoe
- **License:** MIT
- **Category:** UI Architecture
- **Keywords:** react, vite, tanstack-router, shadcn, tailwind, clean-architecture, design-system, gesttione

### ai-integration

- **Version:** 1.0.0
- **Author:** Leon van Zyl
- **License:** MIT
- **Category:** AI
- **Keywords:** ai, vercel-ai-sdk, llm, streaming, openai, anthropic

### testing-quality

- **Version:** 1.0.0
- **Author:** Marcio Altoe
- **License:** MIT
- **Category:** Testing
- **Keywords:** bun-test, quality-gates, biome, prettier, barrel-craft, husky, testing, typescript

### audio-notifications

- **Version:** 1.0.0
- **Author:** Fred Lacs
- **License:** MIT
- **Category:** Quality of Life
- **Keywords:** audio, notifications, tts, accessibility, text-to-speech

### commit-commands

- **Version:** 1.0.0
- **Author:** Marcio Altoe
- **License:** MIT
- **Category:** Workflow
- **Keywords:** git, commit, conventional-commits, pull-request, workflow, automation, skills
- **Architecture:** Hybrid approach with autonomous skills and explicit commands

## Files Overview

### Marketplace Level

- **1** Marketplace manifest (`.claude-plugin/marketplace.json`)
- **1** Main README (README.md)
- **1** Quick start guide (QUICKSTART.md)
- **1** Structure documentation (STRUCTURE.md)
- **1** License file (LICENSE)

### Plugin Level

- **6** Plugin manifests (`plugin.json` in each plugin)
- **16** Command files (`.md` files in `commands/` directories)
- **8** Skill definitions (`.md` files in `skills/` directories)
- **3** Hook files (in audio-notifications)
- **2** Plugin READMEs (ui-components, audio-notifications, commit-commands)

**Total: 40 files** providing comprehensive Claude Code development support.

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
5. Install: `/plugin install your-plugin-name@claude-code-marketplace`

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
- **Maintainer:** Marcio Altoe (marcio.altoe@gmail.com)
- **Contributors:** Leon van Zyl, Fred Lacs

## Maintenance

### Updating Plugins

1. Make changes to plugin files
2. Update version in `plugin.json`
3. Update marketplace version if needed
4. Test changes locally
5. Reinstall plugin:
   ```bash
   /plugin uninstall plugin-name@claude-code-marketplace
   /plugin install plugin-name@claude-code-marketplace
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

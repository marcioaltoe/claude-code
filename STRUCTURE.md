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
│   │   └── agents/
│   │       └── database-architect.md
│   │
│   ├── ui-components/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── .mcp.json                 # shadcn MCP server
│   │   ├── commands/
│   │   │   ├── add-shadcn-component.md
│   │   │   ├── create-custom-component.md
│   │   │   └── create-form.md
│   │   └── agents/
│   │       └── ui-designer.md
│   │
│   ├── ai-integration/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   ├── setup-ai-sdk.md
│   │   │   ├── create-chat-endpoint.md
│   │   │   └── add-function-calling.md
│   │   └── agents/
│   │       └── ai-integration-specialist.md
│   │
│   ├── testing-quality/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── .mcp.json                 # Playwright MCP server
│   │   ├── commands/
│   │   │   ├── setup-vitest.md
│   │   │   ├── create-test.md
│   │   │   ├── setup-playwright.md
│   │   │   └── setup-eslint.md
│   │   └── agents/
│   │       └── quality-engineer.md
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

| Plugin              | Commands | Agents | Skills | MCP Servers    | Hooks |
| ------------------- | -------- | ------ | ------ | -------------- | ----- |
| database-tools      | 4        | 1      | 0      | 0              | 0     |
| ui-components       | 3        | 1      | 0      | 1 (shadcn)     | 0     |
| ai-integration      | 3        | 1      | 0      | 0              | 0     |
| testing-quality     | 4        | 1      | 0      | 1 (playwright) | 0     |
| audio-notifications | 0        | 0      | 0      | 0              | 3     |
| commit-commands     | 3        | 0      | 2      | 0              | 0     |
| **TOTAL**           | **17**   | **4**  | **2**  | **2**          | **3** |

## Plugin Descriptions

### 1. Database Tools (`database-tools`)

**Category:** Database
**Author:** Leon van Zyl
**License:** MIT

Drizzle ORM and Postgres database management tools for Next.js projects.

**Features:**
- Drizzle ORM integration with Next.js
- PostgreSQL connection management
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

**Category:** UI
**Author:** Leon van Zyl
**License:** MIT

shadcn/ui and Tailwind CSS component generation and design utilities.

**Features:**
- shadcn/ui component installation via MCP server
- Custom React component generation
- Tailwind CSS utility integration
- Form components with validation
- Design system integration
- Responsive design helpers
- Accessibility (a11y) compliance

**Use Cases:**
- Installing shadcn/ui components
- Creating custom component libraries
- Building forms with validation
- Implementing design systems
- Rapid UI prototyping

### 3. AI Integration (`ai-integration`)

**Category:** AI
**Author:** Leon van Zyl
**License:** MIT

Vercel AI SDK integration helpers and patterns for Next.js applications.

**Features:**
- Vercel AI SDK setup and configuration
- Streaming response implementation
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
**Author:** Leon van Zyl
**License:** MIT

Testing, linting, and code quality tools for Next.js projects.

**Features:**
- Vitest configuration for unit testing
- Playwright setup for E2E testing via MCP server
- ESLint configuration with Next.js rules
- TypeScript strict mode setup
- Test file generation with examples
- Coverage reporting configuration
- CI/CD integration helpers

**Use Cases:**
- Setting up testing infrastructure
- Writing unit tests for components and utilities
- Creating E2E test suites
- Enforcing code quality standards
- Configuring CI/CD pipelines

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

| Command                 | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `/setup-ai-sdk`         | Initialize Vercel AI SDK with provider configuration               |
| `/create-chat-endpoint` | Create streaming chat API endpoints with error handling            |
| `/add-function-calling` | Implement AI function calling with type-safe tool definitions      |

### Testing & Quality (4 commands)

| Command             | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `/setup-vitest`     | Configure Vitest for unit testing with Next.js                 |
| `/create-test`      | Generate test files with examples and best practices           |
| `/setup-playwright` | Configure Playwright for E2E testing via MCP server            |
| `/setup-eslint`     | Enhanced ESLint configuration with TypeScript and Next.js rules|

### Commit Commands (3 commands)

| Command           | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| `/commit`         | Quick commit with conventional format (explicit control)              |
| `/commit-push-pr` | Complete workflow: stage → commit → push → create PR (explicit control)|
| `/clean_gone`     | Clean up local branches that have been deleted on the remote          |

**Note:** The commit-commands plugin also includes 2 autonomous skills (`git-commit` and `git-pr-creation`) that work automatically based on context. See [Intelligent Skills](#intelligent-skills) section.

## Specialized Agents

Agents are invoked via the Task tool for complex, multi-step workflows.

### 1. database-architect

**Plugin:** database-tools
**Model:** Configurable
**Focus:** Database design and Drizzle ORM

**Capabilities:**
- Schema design and optimization
- Database normalization strategies
- Migration planning and execution
- Query optimization and indexing
- Relational data modeling
- Type-safe query generation
- Database best practices enforcement

**When to Use:**
- Designing complex database schemas
- Optimizing existing database structures
- Planning major schema migrations
- Implementing relational patterns
- Database performance tuning

### 2. ui-designer

**Plugin:** ui-components
**Model:** Configurable
**Focus:** UI/UX with shadcn/ui and Tailwind CSS

**Capabilities:**
- Component design and architecture
- Responsive layout implementation
- Accessibility (a11y) compliance
- Design system integration
- Tailwind utility optimization
- Component composition patterns
- Theme and styling management

**When to Use:**
- Designing complex UI components
- Implementing responsive layouts
- Building accessible interfaces
- Creating design system components
- Refactoring UI architecture

### 3. ai-integration-specialist

**Plugin:** ai-integration
**Model:** Configurable
**Focus:** Vercel AI SDK and LLM integration

**Capabilities:**
- LLM integration patterns
- Streaming response implementation
- Function calling setup
- Error handling and retries
- Token management strategies
- Multi-provider support (OpenAI, Anthropic)
- AI SDK configuration best practices

**When to Use:**
- Implementing AI-powered features
- Setting up streaming chat interfaces
- Configuring function calling
- Integrating multiple LLM providers
- Optimizing AI API usage

### 4. quality-engineer

**Plugin:** testing-quality
**Model:** Configurable
**Focus:** Testing and code quality

**Capabilities:**
- Unit test design (Vitest)
- E2E test scenarios (Playwright)
- Test coverage strategies
- Linting and formatting (ESLint)
- CI/CD integration
- Test-driven development patterns
- Quality metrics and reporting

**When to Use:**
- Setting up comprehensive test suites
- Designing complex test scenarios
- Configuring CI/CD pipelines
- Implementing quality gates
- Test strategy planning

## Intelligent Skills

Skills are autonomous capabilities that Claude invokes automatically based on context.

### 1. git-commit

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

### 2. git-pr-creation

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

## MCP Servers

MCP (Model Context Protocol) servers provide external tool integration.

### shadcn (ui-components plugin)

**Purpose:** shadcn/ui component integration
**Configuration:** `.mcp.json` in ui-components plugin
**Usage:** Automatically available when plugin is installed

**Capabilities:**
- Browse shadcn/ui component catalog
- Install components with dependencies
- Configure components.json
- Handle version compatibility
- Manage Tailwind configuration

### playwright (testing-quality plugin)

**Purpose:** Playwright E2E testing integration
**Configuration:** `.mcp.json` in testing-quality plugin
**Usage:** Automatically available when plugin is installed

**Capabilities:**
- Configure Playwright for Next.js
- Generate test files
- Manage browser contexts
- Handle test fixtures
- Configure CI/CD integration

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

✅ **Database:** PostgreSQL with Drizzle ORM (migrations, queries, schemas, relations)
✅ **UI Framework:** React 19 with Tailwind CSS and responsive design
✅ **UI Components:** shadcn/ui component library
✅ **AI Integration:** Vercel AI SDK with OpenAI & Anthropic support
✅ **Testing:** Vitest (unit tests) + Playwright (E2E) + ESLint
✅ **Code Quality:** TypeScript strict mode, ESLint, Prettier
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
- **Author:** Leon van Zyl
- **License:** MIT
- **Category:** UI
- **Keywords:** shadcn, tailwind, ui, components, design, styling

### ai-integration

- **Version:** 1.0.0
- **Author:** Leon van Zyl
- **License:** MIT
- **Category:** AI
- **Keywords:** ai, vercel-ai-sdk, llm, streaming, openai, anthropic

### testing-quality

- **Version:** 1.0.0
- **Author:** Leon van Zyl
- **License:** MIT
- **Category:** Testing
- **Keywords:** testing, vitest, playwright, eslint, quality, typescript

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
- **17** Command files (`.md` files in `commands/` directories)
- **4** Agent definitions (`.md` files in `agents/` directories)
- **2** Skill definitions (`.md` files in `skills/` directory)
- **2** MCP server configurations (`.mcp.json` files)
- **3** Hook files (in audio-notifications)
- **2** Plugin READMEs (audio-notifications, commit-commands)

**Total: 41 files** providing comprehensive Claude Code development support.

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

### Modifying Agents

1. Edit `.md` files in `plugins/[plugin-name]/agents/`
2. Update agent capabilities and instructions
3. Reinstall plugin

### Modifying Skills

1. Edit `.md` files in `plugins/[plugin-name]/skills/`
2. Update skill description (determines when Claude invokes it)
3. Update skill instructions and capabilities
4. Reinstall plugin

**Important:** The skill `description` field is critical - it determines when Claude automatically invokes the skill. Be specific about trigger phrases and use cases.

### Adding New Plugins

1. Create directory: `plugins/your-plugin-name/`
2. Add `.claude-plugin/plugin.json` with metadata
3. Add `commands/`, `agents/`, and/or `skills/` directories
4. Update `.claude-plugin/marketplace.json`
5. Install: `/plugin install your-plugin-name@claude-code-marketplace`

### Plugin Structure Template

```
plugins/your-plugin-name/
├── .claude-plugin/
│   └── plugin.json           # Required: Plugin metadata
├── commands/                 # Optional: Slash commands (explicit control)
│   └── your-command.md
├── agents/                   # Optional: Specialized agents (complex workflows)
│   └── your-agent.md
├── skills/                   # Optional: Autonomous skills (intelligent invocation)
│   └── your-skill.md
├── hooks/                    # Optional: Event hooks
│   └── hooks.json
├── .mcp.json                 # Optional: MCP server config
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
- **Commands** are explicitly invoked by users (`/command-name`)
- **Skills** are automatically invoked by Claude based on context
- **Agents** are invoked via Task tool for complex, multi-step workflows

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

# Quick Start Guide

Get started with Claude Craftkit plugins in 5 minutes. This tutorial will walk you through installation, setup, and building your first feature.

## Step 1: Install the Marketplace

### Option 1: Via Plugin System (Recommended)

```bash
# Add this repository as a marketplace
/plugin marketplace add marcioaltoe/claude-craftkit
```

### Option 2: Manual Git Clone

**Global Installation (Available Everywhere):**

```bash
cd ~/.claude/plugins/marketplaces
git clone https://github.com/marcioaltoe/claude-craftkit.git
/plugin marketplace add claude-craftkit
```

**Project-Specific Installation:**

```bash
cd /path/to/your/project
mkdir -p .claude/plugins/marketplaces
cd .claude/plugins/marketplaces
git clone https://github.com/marcioaltoe/claude-craftkit.git
/plugin marketplace add ./claude-craftkit
```

### Option 3: Download Release

1. Download from [GitHub Releases](https://github.com/marcioaltoe/claude-craftkit/releases)
2. Extract to:
   - Global: `~/.claude/plugins/marketplaces/claude-craftkit`
   - Project: `<your-project>/.claude/plugins/marketplaces/claude-craftkit`
3. Add marketplace: `/plugin marketplace add claude-craftkit`

## Step 2: Install Plugins

### Install All Plugins at Once

```bash
/plugin install db-tools@claude-craftkit
/plugin install ui@claude-craftkit
/plugin install ai-sdk@claude-craftkit
/plugin install quality@claude-craftkit
/plugin install audio-notifications@claude-craftkit
/plugin install git@claude-craftkit
/plugin install reviewer@claude-craftkit
/plugin install ui-tests@claude-craftkit
/plugin install architecture-design@claude-craftkit
/plugin install product-engineering@claude-craftkit
```

### Or Install Selectively Based on Your Needs

**For Database Development:**

```bash
/plugin install db-tools@claude-craftkit
```

**For UI Development:**

```bash
/plugin install ui@claude-craftkit
```

**For AI Features:**

```bash
/plugin install ai-sdk@claude-craftkit
```

**For Testing:**

```bash
/plugin install quality@claude-craftkit
```

**For Audio Feedback:**

```bash
/plugin install audio-notifications@claude-craftkit
```

**For Git Workflow Automation:**

```bash
/plugin install git@claude-craftkit
```

**For PR Review Management:**

```bash
/plugin install reviewer@claude-craftkit
```

**For Browser Automation & E2E Testing:**

```bash
/plugin install ui-tests@claude-craftkit
```

**For Architecture & Design Best Practices:**

```bash
/plugin install architecture-design@claude-craftkit
```

**For Product Engineering Workflow (Idea → PRD → Implementation):**

```bash
/plugin install product-engineering@claude-craftkit
```

### Verify Installation

Run `/help` to confirm the marketplace is loaded and plugins are available.

**Restart Claude Code** if plugins don't show up immediately.

## Step 3: Initialize Your Stack

### Set up Database (Drizzle + Postgres)

Simply ask Claude to set up Drizzle:

```
Set up Drizzle ORM with PostgreSQL for my Bun + Hono project
```

The `database-architect` skill will handle the setup automatically.

### Set up UI (shadcn/ui)

```
/add-shadcn button
/add-shadcn form
/add-shadcn card
```

Install the shadcn/ui components you need for your project.

### Set up AI SDK (Optional)

Simply ask Claude to set up the Vercel AI SDK:

```
Set up Vercel AI SDK for my Bun + Hono project with OpenAI/Anthropic support
```

The `ai-sdk-specialist` skill will configure everything automatically.

### Set up Testing & Quality (Optional)

Simply ask Claude to configure quality gates:

```
Set up complete quality gates for my project with barrel-craft, Biome, Prettier, TypeScript, and Bun test
```

The `quality-gates` skill will configure everything automatically.

## Step 4: Create Your First Feature

Let's build a complete user profile feature with database, forms, and validation.

### 1. Create Database Schema

```
/create-schema
```

When prompted, create a `users` table with:

- `id` (UUID, primary key)
- `name` (text)
- `email` (text, unique)
- `created_at` (timestamp)

### 2. Generate Migration

```
/generate-migration
```

This creates a migration file for your schema changes.

### 3. Create Database Query

```
/create-query
```

Generate type-safe queries for:

- Get user by ID
- Update user profile
- List all users

### 4. Create Form Component

```
/create-form
```

Generate a user profile edit form with:

- Name input (required, min 2 chars)
- Email input (required, email format)
- Submit button
- Error handling

## Step 5: Build with Natural Language

You don't need to remember all the commands! Just describe what you need:

### Example 1: Complete CRUD Feature

```
Create a complete CRUD feature for blog posts:
- Database schema with posts table (title, content, author, published_at)
- API routes for create, read, update, delete
- Form components for creating and editing posts
- List view with shadcn/ui table component
- Pagination support
```

Claude will automatically:

- Use `database-architect` skill to design the schema
- Use `ui-designer` skill for React components with shadcn/ui and Tailwind CSS
- Use architecture-design plugin's `frontend-engineer` skill for feature-based structure
- Generate all necessary code with proper typing
- Implement validation and error handling

### Example 2: Backend API with Clean Architecture

```
Create a user authentication API with Clean Architecture:
- Domain entities (User, Email value object)
- Use cases (RegisterUser, LoginUser, GetUserProfile)
- Repository pattern with Drizzle ORM
- Custom DI Container with Symbol-based tokens
- Hono routes with Zod validation
- JWT authentication middleware
- Error handling with custom exceptions
```

Claude will automatically:

- Use architecture-design plugin's `backend-engineer` skill for Clean Architecture implementation
- Create Domain Layer (entities, value objects, ports)
- Create Application Layer (use cases, DTOs)
- Create Infrastructure Layer with HTTP sublayer (repositories, adapters, controllers, DI container, HTTP server)
- Implement custom DI Container with proper lifetimes (singleton, scoped, transient)
- Generate all code following SOLID principles and Clean Architecture patterns

### Example 3: AI Chat Feature

```
Add a chatbot to my app:
- Chat endpoint with streaming responses
- Function calling for database queries
- UI component with message history using shadcn/ui
- Error boundaries and loading states
```

The `ai-sdk-specialist` skill will set up everything you need.

### Example 4: Quality Gates Setup

```
Set up complete quality gates for my project:
- barrel-craft for automated exports
- Biome for linting/formatting (TS/JS/CSS)
- Prettier for markdown
- TypeScript strict mode
- Bun test with React Testing Library
- Husky pre-commit hooks
- Create sample tests for user authentication flow
```

The `quality-gates` skill will configure your testing infrastructure and quality workflow.

### Example 5: Git Workflow (Hybrid Approach)

**Autonomous (Skills):**

```
"I'm done with this feature, commit it for me"
→ git-commit skill creates conventional commit automatically

"This is ready for review"
→ git-pr-creation skill creates comprehensive PR with description
```

**Explicit (Commands):**

```
/commit                # Quick commit when you want control
/commit-push-pr        # Full workflow when you know exactly what to do
/clean                 # Branch cleanup
```

### Example 6: Product Engineering Workflow (Idea → Implementation)

**Complete workflow from rough idea to validated implementation:**

```bash
# Phase 1: Discover
/product-engineering:discover
# Transforms rough idea → discovery document (with MCP research)
# Output: docs/discovery/DISC-001-feature-name.md

# Phase 2: Specify
/product-engineering:specify
# Creates PRD with user stories and requirements
# Output: docs/specs/SPEC-001-feature-name.md + feature branch

# Phase 3: Design
/product-engineering:design
# Designs architecture with ADRs and gates validation
# Output: docs/design/DESIGN-001-feature-name.md + docs/adr/ADR-*.md

# Phase 4: Plan
/product-engineering:plan
# Breaks design into atomic tasks (5-20 min each)
# Output: docs/plans/PLAN-001-feature-name.md + docs/tasks/TASKS-001-feature-name.md

# Execute tasks (using superpowers plugin)
/superpowers:execute-plan

# Phase 5: Validate
/product-engineering:validate
# Validates implementation against spec and architecture gates
# Output: Validation report with coverage, gaps, recommendations
```

**Key Features:**

- MCP-powered research at every phase (Perplexity, Context7, Octocode)
- 7 architecture gates enforce quality
- Test-first methodology (TDD mandatory)
- Full traceability: Idea → Discovery → Spec → Design → Tasks → Code
- Manual adjustments between phases
- Editable markdown output with YAML frontmatter

> For complete command reference, see [STRUCTURE.md](STRUCTURE.md#command-reference).

## Environment Variables

After setup, you may need these in `.env`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# AI (if using AI SDK)
OPENAI_API_KEY="sk-..."
# or
ANTHROPIC_API_KEY="sk-ant-..."

# Redis (if using cache/sessions)
REDIS_URL="redis://localhost:6379"

# Other services as needed
JWT_SECRET="your-secret-here"
API_PORT="3000"
```

## Audio Notifications Setup

The audio-notifications plugin works automatically once installed. To customize:

Create `~/.claude/audio_notifications.json`:

```json
{
  "audio_off": false,
  "speech_command": "say"
}
```

**Options:**

- `audio_off`: Set to `true` to disable audio
- `speech_command`: Custom TTS command (e.g., `"say -v Victoria"` on macOS, `"spd-say"` on Linux)

## Common Workflows

### Building a SaaS Dashboard

```
Create a SaaS dashboard with:
- User authentication with JWT and Redis sessions
- PostgreSQL database with Drizzle ORM
- Subscription management table
- Backend API with Hono routes and proper error handling
- Dashboard layout with shadcn/ui (React 19 + Vite)
- Data tables with sorting and filtering
- E2E tests for critical flows
```

### E-commerce Product Page

```
Build a product page:
- Product schema (name, price, description, images, inventory)
- Product detail component with image gallery
- Add to cart functionality
- Inventory validation
- Unit tests for cart logic
```

### Real-time Chat Application

```
Create a chat application:
- WebSocket integration
- Message storage in PostgreSQL
- Streaming AI responses using Vercel AI SDK
- Chat UI with message history
- Online status indicators
- Function calling for commands
```

## Pro Tips

1. **Interactive Plugin Manager**: Use `/plugin` to browse and manage plugins interactively
2. **Check Available Commands**: Use `/help` to see all available commands
3. **Natural Language First**: Just describe what you need - Claude understands context
4. **Combine Agents**: Claude automatically uses multiple agents for complex tasks
5. **Iterate Quickly**: Start with commands for scaffolding, then refine with conversation
6. **Skills vs Commands**: Let skills work automatically, use commands when you want explicit control
7. **Check Plugin Docs**: Each plugin has detailed docs in `plugins/<plugin-name>/`

## Troubleshooting

### Plugins not showing up?

- Restart Claude Code after installation
- Verify marketplace was added: `/plugin marketplace list`
- Check plugin installation: `/plugin list`

### Commands not working?

- Ensure plugin is installed: `/plugin list`
- Check for typos in command names
- Use `/help` to see all available commands
- Try reinstalling: `/plugin uninstall <name>@claude-craftkit` then `/plugin install <name>@claude-craftkit`

### Audio notifications not playing?

- Check system volume
- Verify TTS command is available:
  - macOS: `which say`
  - Linux: `which spd-say`
- Check config file: `~/.claude/audio_notifications.json`
- Set `audio_off: false` in config

### Database connection issues?

- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check database credentials
- Test connection: `psql $DATABASE_URL`

### shadcn/ui components not installing?

- Ensure you have `components.json` in project root
- Run `/add-shadcn --help` for options
- Check Bun version (latest stable recommended)

### Git commands failing?

- Verify GitHub CLI is installed: `gh --version`
- Authenticate: `gh auth login`
- Check remote repository is configured: `git remote -v`

## Next Steps

**Learn More:**

- [README.md](README.md) - Overview and plugin summary
- [STRUCTURE.md](STRUCTURE.md) - Complete command reference and technical details
- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code/plugins) - Official documentation

**Customize:**

- Explore plugin directories in `plugins/` to see how they work
- Create custom commands by adding `.md` files to `commands/`
- Create custom skills for your specific workflows
- See [STRUCTURE.md](STRUCTURE.md#customization) for customization guide

**Contribute:**

- Fork the repository
- Create new plugins or improve existing ones
- Submit pull requests
- Report issues on [GitHub](https://github.com/marcioaltoe/claude-craftkit/issues)

## Support

For issues or questions:

- **Issues:** [GitHub Issues](https://github.com/marcioaltoe/claude-craftkit/issues)
- **Repository:** [github.com/marcioaltoe/claude-craftkit](https://github.com/marcioaltoe/claude-craftkit)
- **Email:** marcio.altoe@gmail.com
- **Documentation:** Use `/help` in Claude Code

---

**Happy coding with Claude Craftkit!** 🚀

Start building and let Claude handle the boilerplate.

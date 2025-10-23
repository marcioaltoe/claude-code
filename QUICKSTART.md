# Quick Start Guide

Get started with Claude Code Marketplace plugins in 5 minutes. This tutorial will walk you through installation, setup, and building your first feature.

## Step 1: Install the Marketplace

### Option 1: Via Plugin System (Recommended)

```bash
# Add this repository as a marketplace
/plugin marketplace add marcioaltoe/claude-code
```

### Option 2: Manual Git Clone

**Global Installation (Available Everywhere):**

```bash
cd ~/.claude/plugins/marketplaces
git clone https://github.com/marcioaltoe/claude-code.git
/plugin marketplace add claude-code
```

**Project-Specific Installation:**

```bash
cd /path/to/your/project
mkdir -p .claude/plugins/marketplaces
cd .claude/plugins/marketplaces
git clone https://github.com/marcioaltoe/claude-code.git
/plugin marketplace add ./claude-code
```

### Option 3: Download Release

1. Download from [GitHub Releases](https://github.com/marcioaltoe/claude-code/releases)
2. Extract to:
   - Global: `~/.claude/plugins/marketplaces/claude-code`
   - Project: `<your-project>/.claude/plugins/marketplaces/claude-code`
3. Add marketplace: `/plugin marketplace add claude-code`

## Step 2: Install Plugins

### Install All Plugins at Once

```bash
/plugin install database-tools@claude-code
/plugin install ui-components@claude-code
/plugin install ai-integration@claude-code
/plugin install testing-quality@claude-code
/plugin install audio-notifications@claude-code
/plugin install commit-commands@claude-code
```

### Or Install Selectively Based on Your Needs

**For Database Development:**
```bash
/plugin install database-tools@claude-code
```

**For UI Development:**
```bash
/plugin install ui-components@claude-code
```

**For AI Features:**
```bash
/plugin install ai-integration@claude-code
```

**For Testing:**
```bash
/plugin install testing-quality@claude-code
```

**For Audio Feedback:**
```bash
/plugin install audio-notifications@claude-code
```

**For Git Workflow Automation:**
```bash
/plugin install commit-commands@claude-code
```

### Verify Installation

Run `/help` to confirm the marketplace is loaded and plugins are available.

**Restart Claude Code** if plugins don't show up immediately.

## Step 3: Initialize Your Stack

### Set up Database (Drizzle + Postgres)

```
/setup-drizzle
```

Follow the prompts to configure Drizzle ORM with your Postgres database.

### Set up UI (shadcn/ui)

```
/add-shadcn-component button
/add-shadcn-component form
/add-shadcn-component card
```

Install the shadcn/ui components you need for your project.

### Set up AI SDK (Optional)

```
/setup-ai-sdk
```

Configure the Vercel AI SDK if you're building AI-powered features.

### Set up Testing (Optional)

```
/setup-vitest
/setup-playwright
```

Configure testing frameworks for your project.

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
- Use `database-architect` agent to design the schema
- Use `ui-designer` agent to create components
- Generate all necessary code with proper typing
- Implement validation and error handling

### Example 2: AI Chat Feature

```
Add a chatbot to my app:
- Chat endpoint with streaming responses
- Function calling for database queries
- UI component with message history using shadcn/ui
- Error boundaries and loading states
```

The `ai-integration-specialist` agent will set up everything you need.

### Example 3: Testing Suite

```
Set up testing for my Next.js project:
- Vitest for unit tests
- Playwright for E2E tests
- ESLint configuration
- Create sample tests for user authentication flow
```

The `quality-engineer` agent will configure your testing infrastructure.

### Example 4: Git Workflow (Hybrid Approach)

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
/clean_gone            # Branch cleanup
```

> For complete command reference, see [STRUCTURE.md](STRUCTURE.md#command-reference).

## Environment Variables

After setup, you may need these in `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# AI (if using AI SDK)
OPENAI_API_KEY="sk-..."
# or
ANTHROPIC_API_KEY="sk-ant-..."

# Other services as needed
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
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
- User authentication with NextAuth
- PostgreSQL database with Drizzle ORM
- Subscription management table
- Dashboard layout with shadcn/ui
- Data tables with sorting and filtering
- API routes with proper error handling
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
- Try reinstalling: `/plugin uninstall <name>@claude-code` then `/plugin install <name>@claude-code`

### Audio notifications not playing?

- Check system volume
- Verify TTS command is available:
  - macOS: `which say`
  - Linux: `which spd-say`
- Check config file: `~/.claude/audio_notifications.json`
- Set `audio_off: false` in config

### Database connection issues?

- Verify `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Check database credentials
- Test connection: `psql $DATABASE_URL`

### shadcn/ui components not installing?

- Ensure you have `components.json` in project root
- Run `/add-shadcn-component --help` for options
- Check Node.js version (requires 18+)

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
- Report issues on [GitHub](https://github.com/marcioaltoe/claude-code/issues)

## Support

For issues or questions:

- **Issues:** [GitHub Issues](https://github.com/marcioaltoe/claude-code/issues)
- **Repository:** [github.com/marcioaltoe/claude-code](https://github.com/marcioaltoe/claude-code)
- **Email:** marcio.altoe@gmail.com
- **Documentation:** Use `/help` in Claude Code

---

**Happy coding with Claude Code Marketplace!** 🚀

Start building and let Claude handle the boilerplate.

# Claude Code Marketplace

A comprehensive plugin and skill marketplace for Claude Code, providing specialized agents, commands, and utilities to enhance your development workflow.

## Overview

Transform your Claude Code experience with a curated collection of plugins designed for modern web development. From database management with Drizzle ORM to UI components with shadcn/ui, AI integration with Vercel AI SDK, and intelligent git workflows - everything you need to build production-ready applications faster.

**What makes this marketplace special:**

- 🎯 **17 specialized commands** for common development tasks
- ⚡ **8 intelligent skills** that work proactively
- 🏗️ **Clean Architecture** patterns for React applications
- 🎨 **Hybrid architecture** - choose between automation and explicit control
- 🎨 **Design system** support (Gesttione branding included)

## Quick Links

- 📚 **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- 📖 **[Complete Reference](STRUCTURE.md)** - Detailed documentation and API reference

## Plugin Summary

| Plugin              | Commands | Skills | Category        |
| ------------------- | -------- | ------ | --------------- |
| database-tools      | 4        | 1      | Database        |
| ui-components       | 3        | 3      | UI Architecture |
| ai-integration      | 3        | 1      | AI              |
| testing-quality     | 4        | 1      | Testing         |
| audio-notifications | -        | -      | QoL             |
| commit-commands     | 3        | 2      | Workflow        |
| **Total**           | **17**   | **8**  | -               |

> For detailed plugin descriptions, capabilities, and available commands, see [STRUCTURE.md](STRUCTURE.md).

## Quick Start

### Installation

Add this marketplace to Claude Code:

```bash
# Add marketplace
/plugin marketplace add marcioaltoe/claude-code

# Install all plugins
/plugin install database-tools@claude-code
/plugin install ui-components@claude-code
/plugin install ai-integration@claude-code
/plugin install testing-quality@claude-code
/plugin install audio-notifications@claude-code
/plugin install commit-commands@claude-code
```

Or use the interactive installer: `/plugin` → Browse Plugins

> For manual installation and other options, see [QUICKSTART.md](QUICKSTART.md).

### Verify Installation

Run `/help` to confirm plugins are loaded and see available commands.

## Example Workflows

**Database Setup:**

```
Set up Drizzle ORM with Postgres for my Bun + Hono backend
```

Claude uses the `database-architect` skill and `/setup-drizzle` command.

**UI Development:**

```
Build a user dashboard with Clean Architecture:
- React 19 + Vite + TanStack Router
- shadcn/ui components with Gesttione brand colors
- Responsive layout with dark mode
- State management with TanStack Query
```

Claude uses `ui-designer`, `frontend-architect`, and `gesttione-design-system` skills.

**Git Workflow (Hybrid):**

```
# Autonomous: Just say what you want
"I'm done with this feature, commit it"

# Explicit: Force execution
/commit
/commit-push-pr
```

The `commit-commands` plugin offers both autonomous skills and explicit commands.

**AI Integration:**

```
Create a streaming chat endpoint with function calling
```

Claude uses the `ai-integration-specialist` skill with Vercel AI SDK.

## Tech Stack Coverage

This marketplace provides comprehensive support for:

- **Backend:** Bun runtime + Hono framework + PostgreSQL with Drizzle ORM
- **Frontend:** React 19 + Vite 6 + TanStack Router (file-based routing)
- **UI:** shadcn/ui + Tailwind CSS v4 + Design tokens + Dark mode
- **State:** TanStack Query + Zustand + TanStack Store
- **Forms:** TanStack Form + Zod validation
- **Architecture:** Clean Architecture (domain/application/infrastructure/presentation)
- **AI:** Vercel AI SDK with OpenAI & Anthropic support
- **Testing:** Bun built-in test + React Testing Library + Happy DOM
- **Code Quality:** Biome (TS/JS/CSS) + Prettier (markdown) + barrel-craft
- **Workflow:** Git automation with Conventional Commits and PR creation
- **QoL:** Audio notifications for long-running tasks

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Installation, setup, and first project tutorial
- **[STRUCTURE.md](STRUCTURE.md)** - Complete reference: all commands, agents, skills, customization
- **[Claude Code Docs](https://docs.claude.com/en/docs/claude-code/plugins)** - Official plugin documentation

## Contributing

Contributions are welcome! To add or improve plugins:

1. Fork the repository
2. Create or edit plugin files in `plugins/`
3. Update `.claude-plugin/marketplace.json` if adding new plugins
4. Test locally by reinstalling the plugin
5. Submit a pull request

For plugin structure and customization guide, see [STRUCTURE.md](STRUCTURE.md#customization).

## Support

- **Issues:** [GitHub Issues](https://github.com/marcioaltoe/claude-code/issues)
- **Repository:** [github.com/marcioaltoe/claude-code](https://github.com/marcioaltoe/claude-code)
- **Email:** marcio.altoe@gmail.com

## Requirements

- Claude Code CLI installed
- Bun runtime for backend development
- Appropriate tools for specific plugins (PostgreSQL, etc.)

## License

MIT License - See [LICENSE](LICENSE) for details.

## References

- [Leon van Zyl](https://github.com/leonvanzyl/claude-code)
- [Fred Lacs](https://github.com/fredlacs/claude-code).

## Learn More

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code/overview)
- [Plugin System Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
- [Agent SDK Documentation](https://docs.claude.com/en/api/agent-sdk/overview)

---

**Built for Claude Code users by Marcio Altoe**
Happy coding! 🚀

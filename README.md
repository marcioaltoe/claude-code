# Claude Craftkit

A comprehensive plugin and skill marketplace for Claude Code, providing specialized agents, commands, and utilities to enhance your development workflow.

## Overview

Transform your Claude Code experience with a curated collection of plugins designed for modern web development. From database management with Drizzle ORM to UI components with shadcn/ui, and intelligent git workflows - everything you need to build production-ready applications faster.

**What makes this marketplace special:**

- 🎯 **16 specialized commands** for common development tasks
- ⚡ **20 intelligent skills** that work proactively
- 🏗️ **Clean Architecture** patterns for backend and frontend applications
- 🎨 **Hybrid architecture** - choose between automation and explicit control
- 🎨 **Design system** support (Gesttione branding included)
- 📐 **SOLID principles** and TypeScript best practices enforcement
- ✅ **100% compliant** with official Claude Code documentation patterns

## Quick Links

- 📚 **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- 📖 **[Complete Reference](STRUCTURE.md)** - Detailed documentation and API reference

## Plugin Summary

| Plugin              | Commands | Agents | Skills | Category        |
| ------------------- | -------- | ------ | ------ | --------------- |
| db-tools            | 3        | 0      | 1      | Database        |
| ui                  | 3        | 0      | 2      | UI Architecture |
| quality             | 2        | 0      | 3      | Testing         |
| audio-notifications | -        | 0      | -      | QoL             |
| git                 | 2        | 0      | 2      | Workflow        |
| reviewer            | 3        | 0      | 1      | Development     |
| ui-tests            | 3        | 0      | 1      | Testing         |
| architecture-design | -        | 0      | 10     | Development     |
| **Total**           | **16**   | **0**  | **20** | -               |

> For detailed plugin descriptions, capabilities, and available commands, see [STRUCTURE.md](STRUCTURE.md).

## Quick Start

### Installation

Add this marketplace to Claude Code:

```bash
# Add marketplace
/plugin marketplace add marcioaltoe/claude-craftkit

# Install all plugins
/plugin install db-tools@claude-craftkit
/plugin install ui@claude-craftkit
/plugin install quality@claude-craftkit
/plugin install audio-notifications@claude-craftkit
/plugin install git@claude-craftkit
/plugin install reviewer@claude-craftkit
/plugin install ui-tests@claude-craftkit
/plugin install architecture-design@claude-craftkit
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

Claude uses the `database-architect` skill to set up Drizzle ORM.

**UI Development:**

```
Build a user dashboard with Clean Architecture:
- React 19 + Vite + TanStack Router
- shadcn/ui components with Gesttione brand colors
- Responsive layout with dark mode
- State management with TanStack Query
```

Claude uses `ui-designer`, `gesttione-design-system`, and architecture-design plugin's `frontend-engineer` skills.

**Git Workflow (Hybrid):**

```
# Autonomous: Just say what you want
"I'm done with this feature, commit it"

# Explicit: Force execution
/commit
/commit-push-pr
```

The `git` plugin offers both autonomous skills and explicit commands.

## Tech Stack Coverage

This marketplace provides comprehensive support for:

- **Backend:** Bun runtime + Hono framework + PostgreSQL with Drizzle ORM
- **Frontend:** React 19 + Vite 6 + TanStack Router (file-based routing)
- **UI:** shadcn/ui + Tailwind CSS v4 + Design tokens + Dark mode
- **State:** TanStack Query + Zustand + TanStack Store
- **Forms:** TanStack Form + Zod validation
- **Architecture:** Clean Architecture (domain/application/infrastructure with HTTP layer)
- **Testing:** Vitest + React Testing Library
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

- **Issues:** [GitHub Issues](https://github.com/marcioaltoe/claude-craftkit/issues)
- **Repository:** [github.com/marcioaltoe/claude-craftkit](https://github.com/marcioaltoe/claude-craftkit)
- **Email:** marcio.altoe@gmail.com

## Requirements

- Claude Code CLI installed
- Bun runtime for backend development
- Appropriate tools for specific plugins (PostgreSQL, etc.)

## References

- [Rodrigo Branas](https://branas.io/)
- [Pedro Nauck](https://compozy.com/)
- [Tech Leads Club](https://www.techleads.club)
- [Leon van Zyl](https://github.com/leonvanzyl/claude-code)
- [Fred Lacs](https://github.com/fredlacs/claude-code)
- [adrianpuiu](https://github.com/adrianpuiu/claude-skills-marketplace)
- [Bryan Lackey](https://github.com/lackeyjb/playwright-skill)
- [Obra/Superpowers](https://github.com/obra/superpowers)

## Learn More

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code/overview)
- [Slash Commands Documentation](https://docs.claude.com/en/docs/claude-code/slash-commands)
- [Plugin System Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
- [Subagents Documentation](https://docs.claude.com/en/docs/claude-code/sub-agents)
- [Anthropics Skills Documentation](https://docs.claude.com/en/docs/claude-code/skills)
- [Hooks Documentation](https://docs.claude.com/en/docs/claude-code/hooks)
- [Claude Code Setting Documentation](https://docs.claude.com/en/docs/claude-code/settings)

## License

MIT License - See [LICENSE](LICENSE) for details.

---

**Built for Claude Code users by Marcio Altoé**
Happy coding! 🚀

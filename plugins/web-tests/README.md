# Web Tests Plugin for Claude Code

**Test your webapps with Playwright** - Auto-detects dev servers, saves test scripts and screenshots to your working directory.

A [Claude Code Plugin](https://docs.claude.com/en/docs/claude-code/plugins) that enables automated browser testing with Playwright. Works as a global tool - install once, use anywhere.

## Features

- **Auto-detect dev servers** - Finds running dev servers on common ports
- **Visible browser by default** - See tests run in real-time
- **Saves to working directory** - Test scripts and screenshots saved to `.web-tests/`
- **Slash commands** - Easy-to-use commands for common tasks
- **Zero per-repo setup** - Install once, works in any project
- **Custom automation** - Claude writes tests specific to your needs

## Installation

### Via Claude Code Plugin System

```bash
# Install the plugin
/plugin marketplace add marcioaltoe/claude-craftkit
/plugin install web-tests@web-tests

# Setup dependencies (first time only)
cd ~/.claude/plugins/marketplaces/web-tests/skills/web-tests
npm run setup
```

### Manual Installation

```bash
# Clone to Claude plugins directory
cd ~/.claude/plugins
git clone https://github.com/marcioaltoe/claude-craftkit.git
cd claude-craftkit/plugins/web-tests/skills/web-tests

# Install dependencies
npm run setup
```

## Quick Start

After installation, use slash commands for common tasks:

```bash
# Test a feature
/test --test-type login

# Take screenshots across viewports
/screenshot --viewports all

# Check for broken links
/check --check-type links
```

Or just ask Claude to test something:

```
"Test if the contact form works"
"Take screenshots of the dashboard on mobile and desktop"
"Check for broken links on the homepage"
```

## Slash Commands

### `/test` - Run automated tests

Test webapp features with Playwright:

```bash
/test --test-type login              # Test login flow
/test --test-type form               # Test form submission
/test --test-type responsive         # Test across viewports
/test --url http://localhost:3001    # Test specific URL
```

### `/screenshot` - Capture screenshots

Take screenshots across different viewports:

```bash
/screenshot                          # Screenshot current dev server
/screenshot --viewports all          # Desktop, tablet, mobile
/screenshot --viewports mobile       # Mobile only
/screenshot --url https://example.com
```

### `/check` - Check for issues

Find broken links, console errors, and other issues:

```bash
/check --check-type links            # Find broken links
/check --check-type console          # Check for JS errors
/check --check-type images           # Find missing images
/check --check-type a11y             # Basic accessibility check
/check --check-type all              # Run all checks
```

## How It Works

1. **Install globally** - One-time setup in Claude Code
2. **Work in any repo** - No per-project installation needed
3. **Run commands** - Use slash commands or ask Claude
4. **View results** - Test scripts and screenshots saved to `.web-tests/`

### Output Directory Structure

```
your-repo/
└── .web-tests/
    ├── scripts/          # Reusable test scripts
    │   ├── test-login.js
    │   ├── test-form.js
    │   └── screenshot.js
    ├── screenshots/      # Screenshots with timestamps
    │   ├── desktop-2025-10-23T12-30-45.png
    │   └── mobile-2025-10-23T12-30-51.png
    └── reports/          # Check reports
        └── check-links-2025-10-23.md
```

## Usage Examples

### Test Login Flow

```bash
/test --test-type login
```

Claude will:
1. Detect your dev server (e.g., http://localhost:3001)
2. Create a test script in `.web-tests/scripts/`
3. Fill in credentials and submit
4. Verify redirect to dashboard
5. Report success/failure

### Responsive Screenshots

```bash
/screenshot --viewports all
```

Claude will:
1. Detect your dev server
2. Create screenshot script
3. Capture desktop (1920x1080), tablet (768x1024), mobile (375x667)
4. Save to `.web-tests/screenshots/`

### Check for Broken Links

```bash
/check --check-type links
```

Claude will:
1. Scan all links on the page
2. Test each link (internal and external)
3. Report broken links with status codes
4. Save report to `.web-tests/reports/`

## How It Works Technically

This plugin uses a **global tool pattern**:

1. **Skill Installed Once**: Lives in `~/.claude/plugins/web-tests/`
2. **CWD Pattern**: Uses `CWD` environment variable to save outputs to user's repo
3. **Execution Flow**:
   ```bash
   # Command executed by Claude
   CWD=$(pwd) cd ~/.claude/plugins/web-tests/skills/web-tests && \
   node run.js .web-tests/scripts/test.js
   ```
4. **Output Resolution**: `helpers.takeScreenshot()` uses `process.env.CWD` to save to user's directory

This allows one installation to work across all your projects!

## Configuration

**Environment Variables:**

- `CWD` - Working directory (auto-set by commands to user's repo)
- `HEADLESS` - Browser visibility (default: `false` = visible)
- `SLOW_MO` - Slow down actions in ms (default: `0`)

**Browser:**

- Default: Chromium (installed via setup)
- Optional: Firefox, WebKit (`npm run install-all-browsers`)

## Advanced Usage

For custom automation, ask Claude to write specific tests:

```
"Test the multi-step checkout flow"
"Verify the search filters work correctly"
"Test that the image gallery loads all thumbnails"
"Check if the mobile menu opens and closes"
```

Claude will create custom Playwright code tailored to your request.

## Tips

- **Auto-detection** - Checks ports 3000, 3001, 5173, 8080, etc.
- **Visible browser** - Default behavior for easier debugging
- **Reusable scripts** - Test scripts saved in `.web-tests/scripts/`
- **Git-friendly** - Add `.web-tests/` to `.gitignore` if needed

## Troubleshooting

**Playwright not installed:**
```bash
cd ~/.claude/plugins/marketplaces/web-tests/skills/web-tests
npm run setup
```

**Tests not running:**
- Verify dev server is running
- Check that you're in the correct project directory

**Screenshots in wrong location:**
- Commands automatically use your working directory
- Outputs always go to `.web-tests/` in current directory

## Tech Stack

- **Playwright** ^1.48.0 - Browser automation
- **Node.js** >= 14.0.0 - Runtime
- **Chromium** - Default browser (auto-installed)

## License

MIT License - see [LICENSE](LICENSE) file

## Learn More

- [Claude Code Plugins](https://docs.claude.com/en/docs/claude-code/plugins)
- [Claude Code Skills](https://docs.claude.com/en/docs/claude-code/skills)
- [Playwright Documentation](https://playwright.dev)
- [Quick Start Guide](QUICKSTART.md)

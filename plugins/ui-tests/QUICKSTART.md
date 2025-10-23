# Quick Start - Web Tests Plugin

Get started with automated web testing in 5 minutes.

## Installation

### Option 1: Via Claude Code Plugin System (Recommended)

```bash
# Add marketplace and install
/plugin marketplace add marcioaltoe/claude-craftkit
/plugin install ui-tests@ui-tests

# Navigate to skill and setup (one-time)
cd ~/.claude/plugins/marketplaces/ui-tests/skills/web-tests
npm run setup
```

### Option 2: Manual Installation

```bash
# Clone to Claude plugins
cd ~/.claude/plugins
git clone https://github.com/marcioaltoe/claude-craftkit.git
cd claude-craftkit/plugins/ui-tests/skills/web-tests

# Install dependencies
npm run setup
```

This installs Playwright and Chromium browser once globally.

## Basic Usage

### 1. Start Your Dev Server

```bash
# In your project
npm run dev
# or
bun run dev
```

### 2. Use Slash Commands

**Test a feature:**
```bash
/test --test-type login
```

**Take screenshots:**
```bash
/screenshot --viewports all
```

**Check for issues:**
```bash
/check --check-type links
```

### 3. Or Just Ask Claude

```
"Test if the contact form submits correctly"
"Take a screenshot of the homepage on mobile"
"Check for broken links"
```

## Common Tasks

### Test Login Flow

```bash
/test --test-type login
```

Claude will:
- Detect your dev server
- Fill in test credentials
- Submit the form
- Verify redirect to dashboard
- Report results

### Responsive Screenshots

```bash
/screenshot --viewports all
```

Captures:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

Saved to: `.web-tests/screenshots/`

### Check for Broken Links

```bash
/check --check-type links
```

Reports:
- All broken links
- HTTP status codes
- Link locations

Saved to: `.web-tests/reports/`

## What Gets Created

After running tests, you'll see:

```
your-repo/
└── .web-tests/
    ├── scripts/          # Test scripts (reusable)
    ├── screenshots/      # Screenshots with timestamps
    └── reports/          # Check reports
```

**Pro tip:** Add `.web-tests/` to your `.gitignore`:

```bash
echo ".web-tests/" >> .gitignore
```

## Workflow

1. **Run command** - Use slash command or ask Claude
2. **Watch browser** - See test run in real-time (visible by default)
3. **Review results** - Check console output and screenshots
4. **Re-run if needed** - Scripts saved in `.web-tests/scripts/`

## Tips

- **Auto-detection** - No need to specify URL if dev server is running
- **Visible browser** - Easier to debug (headless available if needed)
- **Timestamped files** - Never overwrites previous results
- **Reusable scripts** - Edit and re-run saved test scripts

## Next Steps

- Explore the [README](README.md) for more details
- Ask Claude to test specific features
- Create custom automation workflows

## Troubleshooting

**"No dev servers detected"**
- Start your dev server first
- Or provide URL: `/test --url http://localhost:3001`

**"Playwright not installed"**
```bash
cd ~/.claude/plugins/marketplaces/ui-tests/skills/web-tests
npm run setup
```

**Need help?**
- Ask Claude: "How do I test X with the web-tests plugin?"
- Check the [README](README.md) for more examples

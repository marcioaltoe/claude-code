# Plugin Architecture - Web Tests

Complete technical documentation of the web-tests plugin structure and implementation.

## Directory Structure

```
plugins/ui-tests/
├── .claude-plugin/              # Plugin metadata
│   ├── plugin.json             # Main plugin configuration
│   └── marketplace.json        # Marketplace listing
├── commands/                    # Slash commands
│   ├── test.md                 # /test command documentation
│   ├── screenshot.md           # /screenshot command documentation
│   └── check.md                # /check command documentation
├── skills/
│   └── web-tests/              # The actual skill
│       ├── run.js              # Universal executor (entry point)
│       ├── package.json        # Dependencies
│       ├── SKILL.md            # Skill documentation (Claude reads this)
│       └── lib/
│           └── helpers.js      # Utility functions
├── README.md                    # User documentation
├── QUICKSTART.md               # 5-minute quick start
├── STRUCTURE.md                # This file
├── LICENSE                     # MIT License
└── .gitignore                  # Git ignore rules

user-repo/                      # Where user works (separate location)
└── .web-tests/                 # Output directory (created by skill)
    ├── scripts/                # Test scripts (reusable)
    ├── screenshots/            # Screenshots with timestamps
    └── reports/                # Check reports
```

## Core Components

### 1. run.js - Universal Executor

**Location**: `skills/web-tests/run.js`

**Purpose**: Entry point for all test execution. Handles:
- Playwright installation check
- Code execution (file, inline, stdin)
- Module resolution
- Temp file management
- CWD environment variable support

**Key Features**:
```javascript
// Changes to skill directory for proper module resolution
process.chdir(__dirname);

// Shows CWD info for debugging
if (process.env.CWD) {
  console.log(`📁 Working directory: ${process.env.CWD}`);
  console.log(`📸 Screenshots will be saved to: ${process.env.CWD}/.web-tests/screenshots/`);
}

// Auto-installs Playwright if missing
if (!checkPlaywrightInstalled()) {
  installPlaywright();
}
```

**Execution Modes**:
1. **File**: `node run.js test.js`
2. **Inline**: `node run.js "await page.goto(...)"`
3. **Stdin**: `cat test.js | node run.js`

### 2. lib/helpers.js - Utility Functions

**Location**: `skills/web-tests/lib/helpers.js`

**Purpose**: Reusable Playwright utilities that simplify common tasks.

**Key Functions**:

```javascript
// Auto-detects running dev servers
detectDevServers(customPorts = [])
// Returns: ['http://localhost:3001', 'http://localhost:5173']

// Takes screenshots with CWD support
takeScreenshot(page, name, options = {})
// Saves to: ${CWD}/.web-tests/screenshots/${name}-${timestamp}.png

// Safe click with retry
safeClick(page, selector, options = {})

// Safe type with clear
safeType(page, selector, text, options = {})

// Handle cookie banners
handleCookieBanner(page, timeout = 3000)

// Extract table data
extractTableData(page, tableSelector)
```

**CWD Implementation**:
```javascript
async function takeScreenshot(page, name, options = {}) {
  const fs = require('fs');
  const path = require('path');

  // Use CWD if provided, otherwise use process.cwd()
  const workingDir = process.env.CWD || process.cwd();
  const outputDir = path.join(workingDir, '.web-tests', 'screenshots');

  // Create directory if doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(outputDir, `${name}-${timestamp}.png`);

  await page.screenshot({
    path: filename,
    fullPage: options.fullPage !== false,
    ...options
  });

  console.log(`📸 Screenshot saved: ${filename}`);
  return filename;
}
```

### 3. SKILL.md - Skill Documentation

**Location**: `skills/web-tests/SKILL.md`

**Purpose**: Documentation that Claude reads to understand how to use the skill.

**Key Sections**:
1. **CRITICAL WORKFLOW**: Step-by-step execution pattern
2. **Common Patterns**: Pre-built test examples
3. **Available Helpers**: Function reference
4. **Tips**: Best practices

**Example Workflow**:
```
1. Detect dev servers (detectDevServers())
2. Write test script to .web-tests/scripts/
3. Execute: CWD=$(pwd) cd $SKILL_DIR && node run.js .web-tests/scripts/test.js
```

### 4. Slash Commands

**Location**: `commands/*.md`

**Purpose**: User-friendly command interfaces for common tasks.

**Structure**:
```markdown
---
description: Command description
---

<param>--param</param>

## Command Documentation
...
```

**Commands**:
- `/test --test-type login`: Run automated tests
- `/screenshot --viewports all`: Capture screenshots
- `/check --check-type links`: Check for issues

## Global Tool Pattern

### Architecture

```
┌─────────────────────────────────────────────────┐
│ Skill Directory (Global)                        │
│ ~/.claude/plugins/ui-tests/                    │
│ ├── run.js         ← Executor                   │
│ └── lib/helpers.js ← Utilities                  │
└────────────┬────────────────────────────────────┘
             │
             │ CWD environment variable
             │
┌────────────▼────────────────────────────────────┐
│ User Repository (Any project)                   │
│ /path/to/user/project/                          │
│ └── .web-tests/    ← Output directory           │
│     ├── scripts/   ← Test scripts                │
│     ├── screenshots/ ← Screenshots              │
│     └── reports/   ← Check reports              │
└─────────────────────────────────────────────────┘
```

### Execution Flow

1. **User runs command**:
   ```bash
   /test --test-type login
   ```

2. **Claude executes internally**:
   ```bash
   CWD=$(pwd) cd ~/.claude/plugins/ui-tests/skills/web-tests && \
   node run.js .web-tests/scripts/test-login.js
   ```

3. **Script execution**:
   - `run.js` changes to skill directory (module resolution)
   - Sets `process.env.CWD` to user's repo
   - Executes test script
   - `helpers.takeScreenshot()` uses `process.env.CWD` for output

4. **Output saved**:
   ```
   /path/to/user/repo/.web-tests/screenshots/login-2025-10-23.png
   ```

### Benefits

✅ **One Installation**: Install once, use everywhere
✅ **Isolated Outputs**: Each repo has its own `.web-tests/`
✅ **No Per-Repo Setup**: No need to install in every project
✅ **Centralized Updates**: Update skill in one place
✅ **Git-Friendly**: `.web-tests/` stays in user's repo

## Module Resolution

### Challenge

Scripts need to access:
1. Playwright (installed in skill directory)
2. helpers.js (in skill directory)
3. But save outputs to user's directory

### Solution

```javascript
// run.js changes to skill directory
process.chdir(__dirname); // ~/.claude/plugins/ui-tests/skills/web-tests/

// This allows:
const { chromium } = require('playwright');        // ✅ Found in skill node_modules
const helpers = require('./lib/helpers');          // ✅ Found relative to skill

// But helpers.takeScreenshot() uses:
const workingDir = process.env.CWD || process.cwd(); // User's repo
```

## Configuration

### plugin.json

```json
{
  "name": "ui-tests",
  "version": "1.0.0",
  "description": "Web testing and browser automation with Playwright",
  "author": {
    "name": "Claude Craftkit"
  },
  "license": "MIT",
  "repository": "https://github.com/marcioaltoe/claude-craftkit",
  "keywords": [
    "claude-skill",
    "web-tests",
    "playwright",
    "automation"
  ]
}
```

### package.json

```json
{
  "name": "ui-tests",
  "version": "1.0.0",
  "main": "run.js",
  "scripts": {
    "setup": "npm install && npx playwright install chromium",
    "install-all-browsers": "npx playwright install chromium firefox webkit"
  },
  "dependencies": {
    "playwright": "^1.48.0"
  }
}
```

## Environment Variables

### CWD (Current Working Directory)

**Purpose**: Tells helpers where to save outputs

**Set by**: Slash commands automatically
```bash
CWD=$(pwd) node run.js test.js
```

**Used by**: `helpers.takeScreenshot()` and other output functions
```javascript
const workingDir = process.env.CWD || process.cwd();
const outputDir = path.join(workingDir, '.web-tests', 'screenshots');
```

### HEADLESS

**Purpose**: Browser visibility control

**Values**:
- `false` (default): Visible browser
- `true`: Headless mode

**Usage**:
```javascript
const browser = await chromium.launch({
  headless: process.env.HEADLESS !== 'false'
});
```

### SLOW_MO

**Purpose**: Slow down operations for debugging

**Values**: Milliseconds (default: 0)

**Usage**:
```javascript
const browser = await chromium.launch({
  slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
});
```

## Best Practices

### For Skill Development

1. **Always use CWD pattern**: Check `process.env.CWD` for outputs
2. **Create directories**: Use `fs.mkdirSync(dir, { recursive: true })`
3. **Timestamp outputs**: Avoid overwriting with timestamps
4. **Log clearly**: Show where files are saved
5. **Handle errors**: Graceful fallbacks and clear messages

### For Users

1. **Add to .gitignore**: `echo ".web-tests/" >> .gitignore`
2. **Use slash commands**: Easier than manual execution
3. **Watch browser**: Default visible mode helps debugging
4. **Reuse scripts**: Scripts in `.web-tests/scripts/` are reusable

## Testing the Plugin

### Manual Testing

```bash
# 1. Install dependencies
cd ~/.claude/plugins/ui-tests/skills/web-tests
npm run setup

# 2. Test basic execution
echo "console.log('test')" | node run.js

# 3. Test with CWD
cd /tmp
mkdir test-project && cd test-project
CWD=$(pwd) node ~/.claude/plugins/ui-tests/skills/web-tests/run.js "
const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.goto('https://example.com');
await helpers.takeScreenshot(page, 'test');
await browser.close();
"

# 4. Verify output
ls -la .web-tests/screenshots/
```

### Expected Output

```
test-project/
└── .web-tests/
    └── screenshots/
        └── test-2025-10-23T15-30-45.png
```

## Troubleshooting

### Common Issues

**"Playwright not found"**
```bash
cd ~/.claude/plugins/ui-tests/skills/web-tests
npm run setup
```

**"Screenshots not in .web-tests/"**
- Verify `CWD` is set: `echo $CWD`
- Check execution: Add `console.log(process.env.CWD)` in script

**"Module not found"**
- Ensure `run.js` changes to skill directory: `process.chdir(__dirname)`
- Verify dependencies installed: `ls node_modules/playwright`

**"Browser doesn't open"**
- Check `headless` setting: Should be `false` for visible
- Verify display available: `echo $DISPLAY`

## Further Reading

- [README.md](README.md) - User documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [SKILL.md](skills/web-tests/SKILL.md) - Skill documentation
- [Playwright Documentation](https://playwright.dev) - Playwright API

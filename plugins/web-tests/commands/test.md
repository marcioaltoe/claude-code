---
description: Test a webapp feature with Playwright
---

<url>--url</url>
<test-type>--test-type</test-type>

## Test Webapp Feature

Run automated browser tests for your webapp using Playwright. Tests are saved to `.web-tests/` in your current working directory.

**Works from any directory** - Saves test scripts and screenshots to your working directory's `.web-tests/` folder.

## How It Works

When you run `/test`, Claude will:

1. **Auto-detect running dev servers** (or use the provided URL)
2. **Create a custom test script** in `.web-tests/scripts/`
3. **Execute the test** with visible browser
4. **Save screenshots** to `.web-tests/screenshots/`
5. **Show results** with console output

## Usage

```bash
# Test specific feature
/test --test-type login

# Test with specific URL
/test --url http://localhost:3001 --test-type form

# Test responsive design
/test --test-type responsive

# Test page load
/test --url https://example.com --test-type page-load
```

## Common Test Types

- `login` - Test login flow and authentication
- `form` - Test form filling and submission
- `responsive` - Test across multiple viewports (desktop, tablet, mobile)
- `page-load` - Test if page loads correctly
- `navigation` - Test navigation and routing
- `custom` - Claude will ask what to test

## What Claude Will Do

1. **Auto-detect dev server** (if testing localhost)
2. **Write test script** to `.web-tests/scripts/test-{type}-{timestamp}.js`
3. **Execute test** using: `CWD=$(pwd) cd <skill-dir> && node run.js .web-tests/scripts/test-*.js`
4. **Report results** with any errors or successes
5. **Save screenshots** automatically to `.web-tests/screenshots/`

## Output Structure

```
your-repo/
└── .web-tests/
    ├── scripts/
    │   └── test-login-2025-10-23.js
    └── screenshots/
        ├── login-page-2025-10-23T12-30-45.png
        └── dashboard-2025-10-23T12-30-50.png
```

## Environment Variables

Claude can use these environment variables:

- `CWD` - Your current working directory (auto-set)
- `HEADLESS` - Set to `true` for background execution (default: `false`)
- `SLOW_MO` - Slow down actions for debugging (default: `0`)

## Examples

```bash
# Test login with credentials
/test --test-type login

# Test contact form
/test --test-type form --url http://localhost:3001/contact

# Test homepage across viewports
/test --test-type responsive --url http://localhost:3001
```

## Tips

- Tests run with **visible browser** by default (easier to debug)
- **Screenshots are automatic** - saved to `.web-tests/screenshots/`
- **Test scripts are reusable** - found in `.web-tests/scripts/`
- **Auto-detects servers** - no need to specify URL for localhost

## See Also

- `/screenshot` - Take screenshots of pages
- `/check` - Check for broken links or issues

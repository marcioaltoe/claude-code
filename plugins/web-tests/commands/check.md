---
description: Check webpage for issues (broken links, errors, etc.)
---

<url>--url</url>
<check-type>--check-type</check-type>

## Check Webpage for Issues

Automatically check webpages for common issues like broken links, console errors, missing images, or accessibility problems.

**Works from any directory** - Saves report to your working directory's `.web-tests/` folder.

## How It Works

When you run `/check`, Claude will:

1. **Auto-detect dev server** (or use provided URL)
2. **Create check script** in `.web-tests/scripts/`
3. **Run automated checks** based on check-type
4. **Generate report** in `.web-tests/reports/`
5. **Show summary** of findings

## Usage

```bash
# Check for broken links
/check --check-type links

# Check for console errors
/check --url http://localhost:3001 --check-type console

# Check for missing images
/check --check-type images

# Check accessibility
/check --check-type a11y

# Check all issues
/check --check-type all
```

## Check Types

- `links` - Find broken links (404s, timeouts)
- `console` - Capture JavaScript errors and warnings
- `images` - Check for missing or broken images
- `a11y` - Basic accessibility checks (ARIA, alt text, etc.)
- `performance` - Basic performance metrics
- `all` - Run all checks

## What Claude Will Do

1. **Auto-detect dev server** (if no URL provided)
2. **Create check script** in `.web-tests/scripts/check-{type}-{timestamp}.js`
3. **Execute checks** with: `CWD=$(pwd) cd <skill-dir> && node run.js .web-tests/scripts/check-*.js`
4. **Generate report** in `.web-tests/reports/`
5. **Display summary** of issues found

## Output Structure

```
your-repo/
└── .web-tests/
    ├── scripts/
    │   └── check-links-2025-10-23.js
    └── reports/
        └── check-links-2025-10-23.md
```

## Report Contents

The report will include:

- **Summary** - Total issues found
- **Details** - Each issue with location and description
- **Severity** - Critical, Warning, Info
- **Suggestions** - How to fix each issue

## Examples

```bash
# Check for broken links
/check --check-type links

# Check for console errors on specific page
/check --url http://localhost:3001/dashboard --check-type console

# Full health check
/check --check-type all

# Check accessibility
/check --url http://localhost:3001 --check-type a11y
```

## What Gets Checked

**Links:**
- External links (status codes)
- Internal links (navigation)
- Anchor links
- Download links

**Console:**
- JavaScript errors
- Network failures
- Console warnings

**Images:**
- Missing images (404s)
- Broken src attributes
- Missing alt text

**Accessibility:**
- Missing ARIA labels
- Color contrast (basic)
- Semantic HTML
- Keyboard navigation

**Performance:**
- Page load time
- Resource sizes
- Number of requests

## Tips

- **Run before deployment** - Catch issues early
- **Check after changes** - Verify nothing broke
- **Commit reports** - Track issues over time
- **Automated quality checks** - Quick health check

## See Also

- `/test` - Run automated tests
- `/screenshot` - Take screenshots

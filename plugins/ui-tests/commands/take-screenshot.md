---
description: Take screenshots of web pages
---

<url>--url</url>
<viewports>--viewports</viewports>

## Take Screenshots

Capture screenshots of web pages across different viewports. Screenshots are saved to `.web-tests/screenshots/` in your working directory.

**Works from any directory** - Saves screenshots to your working directory's `.web-tests/screenshots/` folder.

## How It Works

When you run `/screenshot`, Claude will:

1. **Auto-detect dev server** (or use provided URL)
2. **Create screenshot script** in `.web-tests/scripts/`
3. **Capture screenshots** across specified viewports
4. **Save to** `.web-tests/screenshots/` with timestamps
5. **Report** file locations

## Usage

```bash
# Screenshot current dev server
/screenshot

# Screenshot specific URL
/screenshot --url http://localhost:3001

# Screenshot across all viewports
/screenshot --viewports all

# Screenshot specific viewports
/screenshot --viewports desktop,mobile

# Screenshot external site
/screenshot --url https://example.com --viewports desktop
```

## Viewport Options

- `all` - Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- `desktop` - 1920x1080
- `tablet` - 768x1024
- `mobile` - 375x667
- `custom` - Claude will ask for dimensions

## What Claude Will Do

1. **Auto-detect dev server** (if no URL provided)
2. **Create screenshot script** in `.web-tests/scripts/screenshot-{timestamp}.js`
3. **Execute script** with: `CWD=$(pwd) cd <skill-dir> && node run.js .web-tests/scripts/screenshot-*.js`
4. **Take screenshots** across specified viewports
5. **Report file locations**

## Output Structure

```
your-repo/
└── .web-tests/
    ├── scripts/
    │   └── screenshot-2025-10-23.js
    └── screenshots/
        ├── desktop-2025-10-23T12-30-45.png
        ├── tablet-2025-10-23T12-30-48.png
        └── mobile-2025-10-23T12-30-51.png
```

## Screenshot Options

Claude can configure:

- **Full page** - Captures entire scrollable page (default: `true`)
- **Specific element** - Screenshot just one element
- **Visible viewport** - Only visible portion
- **Wait for load** - Waits for page to fully load

## Examples

```bash
# Quick screenshot of current dev server
/screenshot

# Screenshot homepage across all devices
/screenshot --url http://localhost:3001 --viewports all

# Mobile-only screenshot
/screenshot --viewports mobile

# Screenshot specific page
/screenshot --url http://localhost:3001/dashboard --viewports desktop
```

## Tips

- Screenshots include **full page** by default (scrolls entire page)
- **Timestamps in filenames** prevent overwriting
- **Saved in working directory** - easy to commit or share
- **Browser visible** - see what's being captured

## See Also

- `/test` - Run automated tests
- `/check` - Check for broken links or issues

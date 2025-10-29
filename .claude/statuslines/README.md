# Claude Code Statusline Options

Two statusline options for Claude Code.

---

## Option 1: Simple Statusline (Python)

**File:** `statusline.py`

### What it shows

**Line 1:** Model and Output Style

```
🧠 Claude | ⚡ default
```

**Line 2:** Directory and Git Info

```
📁 tools/claude-craftkit | 🌿 main ±3
```

### Features

- ✅ Multi-line display (2 lines)
- ✅ Model name with emoji
- ✅ Output style indicator
- ✅ Last two directory levels
- ✅ Git branch and change count
- ✅ Color-coded (soft pastels)
- ✅ Minimal mode available
- ✅ Fast Python execution

### Configuration

Add to `.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "uv run ~/.claude/statuslines/statusline.py",
    "padding": 0
  }
}
```

### Customization

Set environment variable for minimal colors:

```bash
export CLAUDE_STATUS_COLOR_SCHEME=minimal
```

---

## Option 2: ccstatusline (Recommended)

**📦 Package:** [ccstatusline](https://github.com/sirmalloc/ccstatusline) by [@sirmalloc](https://github.com/sirmalloc)

### What it shows

Highly customizable statusline with interactive TUI configuration:

```
🧠 Sonnet | ~/dev/tools/claude-craftkit | main | S: 0 | U: 5 | A: 25 | Model: Sonnet 4.5 | Ctx: 112.3k | ⎇ main | (+247,-32)
```

### Features

- ✅ **Interactive TUI** - Terminal UI for easy configuration
- ✅ **All widgets** - Model, git, context %, tokens, session clock, block timer, cost, and more
- ✅ **Powerline support** - Beautiful arrow separators and themes
- ✅ **Multiple lines** - Configure as many status lines as you need
- ✅ **Custom commands** - Execute shell commands for dynamic data
- ✅ **Flex separators** - Auto-alignment and spacing
- ✅ **Color modes** - 16-color, 256-color, and truecolor support
- ✅ **Zero config** - Works out of the box with sensible defaults
- ✅ **Bun/Node.js** - Fast execution with bunx or npx
- ✅ **Windows support** - Full compatibility with PowerShell, cmd, and WSL

### Installation

**No installation needed!** Run directly:

```bash
# Using Bun (recommended - faster)
bunx ccstatusline@latest

# Or using npm
npx ccstatusline@latest
```

This launches the interactive TUI where you can:

- Configure multiple status lines
- Add/remove/reorder widgets
- Customize colors and formatting
- Install to Claude Code settings
- Preview in real-time

### Quick Setup

1. **Run the TUI**:

   ```bash
   bunx ccstatusline@latest
   ```

2. **Configure your statusline**:

   - Press `Enter` to edit widgets
   - Press `a` to add widgets
   - Press `d` to delete widgets
   - Press `c` to customize colors
   - Press `i` to install to Claude Code

3. **Your settings are auto-saved** to `~/.config/ccstatusline/settings.json`

### Claude Code Integration

After configuration, ccstatusline automatically updates your `.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bunx ccstatusline@latest",
    "padding": 0
  }
}
```

### Available Widgets

**Information Widgets:**

- 🧠 Model Name - Shows current Claude model
- 📊 Context Percentage - Shows context usage (% of 200k or 160k usable)
- 📏 Context Length - Shows current context in tokens
- 💰 Session Cost - Shows total session cost in USD
- 📁 Current Working Directory - Shows working directory

**Git Widgets:**

- 🌿 Git Branch - Current branch name
- 📝 Git Changes - Uncommitted insertions/deletions (+42,-10)
- 🌳 Git Worktree - Current worktree name

**Token Widgets:**

- 🔤 Tokens Input - Input tokens used
- 🔤 Tokens Output - Output tokens used
- 🔤 Tokens Cached - Cached tokens used
- 🔤 Tokens Total - Total tokens used

**Time Widgets:**

- ⏱️ Session Clock - Time since session start (2hr 15m)
- ⏳ Block Timer - Time in current 5-hour block or progress bar

**Other Widgets:**

- ⚡ Output Style - Current output style
- 🔢 Version - Claude Code version
- 📐 Terminal Width - Terminal width (debugging)
- ✏️ Custom Text - Your custom text
- ⚙️ Custom Command - Execute shell commands
- ➖ Separator - Visual dividers
- ↔️ Flex Separator - Expands to fill space

### Advanced Features

**Powerline Mode:**

```
  🧠 Sonnet   ~/projects/app   main   +5   Ctx: 18.6k   2hr 15m
```

Beautiful arrow separators, caps, and themes.

**Custom Commands:**
Execute any shell command and display output:

```bash
# Show current time
date +%H:%M

# Show git commit hash
git rev-parse --short HEAD

# Integrate other tools
npx -y ccusage@latest statusline
```

**Multiple Status Lines:**
Configure 2, 3, or more independent status lines with different widgets.

**Raw Value Mode:**
Toggle labels on/off:

- Normal: `Model: Claude 3.5 Sonnet`
- Raw: `Claude 3.5 Sonnet`

### Themes

ccstatusline includes built-in themes you can copy and customize:

- Default
- Minimal
- Developer
- Pro
- And more...

---

## Comparison

| Feature            | Simple (Python)     | ccstatusline                 |
| ------------------ | ------------------- | ---------------------------- |
| **Setup**          | Copy file           | Zero install (npx/bunx)      |
| **Configuration**  | Edit JSON manually  | Interactive TUI              |
| **Lines**          | 2 lines (fixed)     | Unlimited                    |
| **Model info**     | ✅ Yes              | ✅ Yes                       |
| **Output style**   | ✅ Yes              | ✅ Yes                       |
| **Git info**       | ✅ Branch + changes | ✅ Branch, changes, worktree |
| **Context %**      | ❌ No               | ✅ Yes                       |
| **Tokens**         | ❌ No               | ✅ Input/Output/Cached/Total |
| **Session info**   | ❌ No               | ✅ Clock, Cost, Block Timer  |
| **Custom widgets** | ❌ No               | ✅ Text + Commands           |
| **Powerline**      | ❌ No               | ✅ Yes                       |
| **Themes**         | ❌ No               | ✅ Yes                       |
| **Colors**         | Soft pastels        | 16/256/truecolor modes       |
| **Customization**  | Minimal             | Extensive                    |
| **Dependencies**   | Python + uv         | Bun or Node.js               |
| **Speed**          | Fast                | Fast (faster with Bun)       |

---

## Recommendation

**Use ccstatusline** - It's the complete solution:

- ✅ Zero installation (npx/bunx)
- ✅ Interactive TUI configuration
- ✅ All the widgets you need
- ✅ Professional Powerline support
- ✅ Active development and community

**Use Simple (Python)** only if:

- ❌ You can't install Node.js/Bun
- ❌ You prefer minimal 2-line display
- ❌ You don't need context % or advanced features

---

## 🎨 ANSI Color Codes Reference

### Basic Colors (16 colors)

#### Foreground (text)
```bash
30 = Black
31 = Red
32 = Green
33 = Yellow
34 = Blue
35 = Magenta
36 = Cyan
37 = White
```

#### Foreground Bright
```bash
90 = Bright Black (Gray)
91 = Bright Red
92 = Bright Green
93 = Bright Yellow
94 = Bright Blue
95 = Bright Magenta
96 = Bright Cyan
97 = Bright White
```

#### Background
```bash
40-47   = Basic backgrounds (same order as foreground)
100-107 = Bright backgrounds
```

### Usage Format

```bash
# Basic format
\033[COLORm

# With bold
\033[01;COLORm

# Examples
\033[36m      # Cyan
\033[01;36m   # Cyan Bold
\033[91m      # Bright Red
\033[01;32m   # Green Bold

# Reset
\033[0m       # Reset all formatting
```

### 256 Colors (extended palette)

```bash
# Format
\033[38;5;NUMBERm   # Foreground
\033[48;5;NUMBERm   # Background

# Where NUMBER = 0-255
```

#### Popular 256 Colors
```bash
75  = Soft Sky Blue
110 = Soft Light Blue
114 = Soft Green
176 = Soft Pink/Mauve
202 = Orange
214 = Yellow/Gold
232-255 = Grayscale (232=black, 255=white)
```

### Truecolor (16 million colors)

```bash
# Format
\033[38;2;R;G;Bm   # Foreground RGB
\033[48;2;R;G;Bm   # Background RGB

# Examples
\033[38;2;255;87;51m    # Coral
\033[38;2;100;200;255m  # Light Blue
```

### Modifiers

```bash
0 = Reset
1 = Bold
2 = Dim
3 = Italic
4 = Underline
5 = Blink
7 = Reverse (invert colors)
8 = Hidden
```

### Practical Examples

```bash
# Cyan bold text
echo -e "\033[01;36mCyan Bold Text\033[0m"

# Red text with yellow background
echo -e "\033[31;43mRed on Yellow\033[0m"

# Bright green text
echo -e "\033[92mBright Green\033[0m"

# 256 color - soft blue
echo -e "\033[38;5;75mSoft Blue (75)\033[0m"

# Truecolor - orange
echo -e "\033[38;2;255;165;0mOrange RGB\033[0m"
```

### Test Colors in Terminal

```bash
# Test basic colors
for i in {30..37}; do
  echo -e "\033[${i}m Color $i \033[0m"
done

# Test 256 colors
for i in {0..255}; do
  printf "\033[38;5;${i}m%3d " $i
  [ $((($i + 1) % 16)) -eq 0 ] && echo
done
echo -e "\033[0m"
```

### Common Combinations

```bash
\033[01;36m    # Cyan Bold
\033[01;33m    # Yellow Bold
\033[01;32m    # Green Bold
\033[01;31m    # Red Bold
\033[96m       # Bright Cyan
\033[38;5;75m  # Soft Sky Blue (256)
\033[38;5;176m # Soft Pink (256)
```

### Colors Used in statusline.py

```bash
\033[38;5;75m   # 🧠 Soft Sky Blue (model)
\033[38;5;110m  # 📁 Soft Light Blue (directory)
\033[38;5;114m  # 🌿 Soft Green (git)
\033[38;5;176m  # ⚡ Soft Pink/Mauve (output style)
\033[38;5;245m  # Gray (no git message)
```

---

## Troubleshooting

### ccstatusline not working

1. **Check installation**:

   ```bash
   # Test with bunx
   bunx ccstatusline@latest

   # Or test with npx
   npx ccstatusline@latest
   ```

2. **Check Bun/Node.js**:

   ```bash
   # Check Bun
   bun --version

   # Check Node.js
   node --version
   ```

3. **Verify Claude settings**:

   ```bash
   # Check settings file
   cat ~/.claude/settings.json
   ```

4. **Reset configuration**:

   ```bash
   # Remove saved settings
   rm ~/.config/ccstatusline/settings.json

   # Run TUI again
   bunx ccstatusline@latest
   ```

### Python statusline not showing

1. Check `uv` is installed: `which uv`
2. Test script: `echo '{}' | uv run .claude/statuslines/statusline.py`
3. Verify settings.json syntax

---

## Resources

**ccstatusline:**

- 📦 GitHub: https://github.com/sirmalloc/ccstatusline
- 📚 npm: https://www.npmjs.com/package/ccstatusline
- 🌟 1.7k+ stars
- 👥 Active community
- 📖 Full API documentation

**Simple Statusline:**

- 📁 File: `.claude/statuslines/statusline.py`
- 🐍 Requires: Python + uv
- 📝 Minimal and fast

---

## Files

```
.claude/statuslines/
├── statusline.py              # Simple Python statusline
└── README.md                  # This file
```

**Note:** ccstatusline stores its configuration in `~/.config/ccstatusline/settings.json` automatically.

---

## Credits

**ccstatusline:**

- Created by [Matthew Breedlove (@sirmalloc)](https://github.com/sirmalloc)
- Licensed under MIT
- Built for Claude Code by Anthropic

**Simple Statusline:**

- Created for Claude Craftkit
- Python implementation
- MIT License

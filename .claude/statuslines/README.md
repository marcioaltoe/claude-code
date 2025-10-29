# Claude Code Statusline Options

Two statusline configurations available for Claude Code.

## Option 1: Simple Statusline (Current - Python)

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
- ✅ Model name with brain emoji
- ✅ Output style indicator
- ✅ Last two directory levels
- ✅ Git branch and change count
- ✅ Color-coded (soft pastels)
- ✅ Minimal mode available
- ✅ Fast Python execution

### Configuration

Already configured in `.claude/settings.json`:

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

## Option 2: Matt Pocock's Statusline (Git + Context %)

**Files:** `matt-pocock-wrapper.sh`, `matt-pocock-command.sh`, `ccstatusline-settings.json`

### What it shows

Single line with comprehensive git info and context tracking:

```
tools/claude-craftkit | main | S: 0 | U: 1 | A: 0 | 17.3%
```

Where:

- `tools/claude-craftkit` - Repository name (cyan)
- `main` - Git branch (green)
- `S: 0` - Staged files (yellow)
- `U: 1` - Unstaged/modified files (yellow)
- `A: 0` - Untracked files (yellow)
- `17.3%` - **Context window usage** (yellow) ⚠️

### Features

- ✅ Single-line compact display
- ✅ Detailed git status (staged, unstaged, untracked)
- ✅ **Context percentage tracking** (critical for AI quality!)
- ✅ Repository name (customizable base path)
- ✅ Color-coded ANSI output
- ✅ Performance optimized (--no-optional-locks)

### Why Context % Matters

**Most important metric for maintaining AI quality:**

- **< 40%** - ✅ Optimal performance
- **40-60%** - ⚠️ Good, monitor closely
- **> 60%** - 🔴 Start new session for best results

### Installation

#### 1. Install ccstatusline

**Option A: Using Bun (recommended for this project)**
```bash
bun install -g ccstatusline
```

**Option B: Using npm**
```bash
npm install -g ccstatusline
```

> Note: The wrapper script uses `bunx` for better performance. If you don't have Bun installed, change `bunx` to `npx` in `matt-pocock-wrapper.sh` line 11.

#### 2. Copy config

```bash
cp .claude/statuslines/ccstatusline-settings.json ~/.config/ccstatusline/settings.json
```

#### 3. Update settings.json

Edit `.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statuslines/matt-pocock-wrapper.sh",
    "padding": 0
  }
}
```

#### 4. Customize repository path (Optional)

If your repos are NOT in `~/repos/`, edit `.claude/statuslines/matt-pocock-command.sh` line 12:

```bash
# Change from:
if [[ "$cwd" == "$HOME/repos/"* ]]; then
    repo_name=$(echo "$cwd" | sed "s|^$HOME/repos/||")

# To (example for ~/dev/):
if [[ "$cwd" == "$HOME/dev/"* ]]; then
    repo_name=$(echo "$cwd" | sed "s|^$HOME/dev/||")
```

#### 5. Restart Claude Code

---

## Comparison

| Feature          | Simple (Python)   | Matt Pocock's             |
| ---------------- | ----------------- | ------------------------- |
| **Lines**        | 2 lines           | 1 line                    |
| **Model info**   | ✅ Shows model    | ❌ No                     |
| **Output style** | ✅ Shows style    | ❌ No                     |
| **Directory**    | ✅ Last 2 levels  | ✅ Repo name              |
| **Git branch**   | ✅ Yes            | ✅ Yes                    |
| **Git details**  | Change count (±3) | Staged/Unstaged/Untracked |
| **Context %**    | ❌ No             | ✅ **Yes**                |
| **Dependencies** | Python + uv       | Bun/Node.js + ccstatusline |
| **Speed**        | Fast              | Fast (faster with Bun)     |

## Recommendation

- **Use Simple (Python)** if you want **2-line display** with model + output style info
- **Use Matt Pocock's** if you want **compact 1-line** with context % + detailed git status

**For serious AI work:** Matt Pocock's statusline is recommended because **context percentage is the most critical metric** for maintaining optimal AI quality.

---

## Troubleshooting

### Python statusline not showing

1. Check `uv` is installed: `which uv`
2. Test script: `echo '{}' | uv run .claude/statuslines/statusline.py`
3. Verify settings.json syntax

### Matt Pocock's statusline not showing

1. Check ccstatusline: `which ccstatusline`
2. Install if missing: `bun install -g ccstatusline` (or `npm install -g ccstatusline`)
3. Check Bun: `which bunx` (if missing, change `bunx` to `npx` in wrapper script)
4. Test script: `echo '{"current_dir":"'$(pwd)'"}' | bash .claude/statuslines/matt-pocock-wrapper.sh`
5. Verify scripts are executable: `ls -la .claude/statuslines/*.sh`

### Switch between statuslines

Edit `.claude/settings.json` and change the `command`:

```json
// For Python (simple):
"command": "uv run ~/.claude/statuslines/statusline.py"

// For Matt Pocock's:
"command": "bash ~/.claude/statuslines/matt-pocock-wrapper.sh"
```

Then restart Claude Code.

---

## Credits

**Simple Statusline (statusline.py):**

- Created for Claude Craftkit project
- Multi-line design with soft colors

**Matt Pocock's Statusline:**

- Based on ["Creating The Perfect Claude Code Status Line"](https://www.aihero.dev/creating-the-perfect-claude-code-status-line)
- By **Matt Pocock** ([aihero.dev](https://aihero.dev))
- Adapted for Claude Craftkit

---

## Files

```
.claude/statuslines/
├── statusline.py                   # Simple statusline (current)
├── matt-pocock-command.sh          # Matt Pocock's git info script
├── matt-pocock-wrapper.sh          # Matt Pocock's wrapper script
├── ccstatusline-settings.json      # ccstatusline configuration
└── README.md                       # This file
```

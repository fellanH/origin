# Origin

Dynamic dashboard desktop app with a panel manager and developer plugin API.

Built with Tauri 2, React 19, Vite 7, Tailwind CSS 4, and Zustand.

## Vision

Origin is a keyboard-driven split-panel workspace where every panel runs a plugin. The shell provides layout, persistence, and a plugin API — all functionality comes from the community.

It is free, open source (MIT), and will always be. See [docs/GOALS.md](docs/GOALS.md) for the full project commitment and roadmap.

## Prerequisites

- [Rust toolchain](https://rustup.rs/) (required by Tauri)
- Node.js 20+
- macOS (primary target; Tauri 2 desktop)

## Development

```bash
# Install dependencies
npm install

# Run in development mode (Tauri + Vite hot reload)
npm run tauri dev

# Build for production
npm run tauri build
```

## Project Layout

```
src/          React 19 frontend (components, store, plugins, types)
src-tauri/    Rust/Tauri backend (commands, capabilities, config)
plugins/      @origin/* plugin packages (npm workspaces)
  api/        @origin/api — plugin type contract (PluginManifest, PluginContext)
  hello/      @origin/hello — reference plugin implementation
  template/   @origin/template — scaffold for new plugin authors
docs/         Spec, research, SOPs, standards
```

## What It Is

Origin is a developer-focused tiling window manager as a desktop app. The shell provides only panel layout and plugin slots — all functionality comes from plugins. v1 proves the core: keyboard-driven split panels and a working plugin API. Built as a personal tool first, designed to be extensible for other developers.

## Architecture at a Glance

| Layer        | Choice                              | Notes                                                          |
| ------------ | ----------------------------------- | -------------------------------------------------------------- |
| Desktop      | Tauri 2.10.2                        | Frameless, macOS traffic lights via `titleBarStyle: "Overlay"` |
| Frontend     | React 19 + Vite 7 + TypeScript      |                                                                |
| Styling      | Tailwind CSS 4 + shadcn/ui          | v4 only — breaking changes from v3                             |
| Panel layout | `react-resizable-panels` v4         | v4 renames several APIs                                        |
| State        | Zustand v5 + `@tauri-store/zustand` | File-backed; not localStorage                                  |
| Build        | Vite 7, npm workspaces              | Plugins in `plugins/`                                          |

## Keyboard Shortcuts

| Shortcut    | Action                              |
| ----------- | ----------------------------------- |
| CMD+D       | Split panel horizontally            |
| CMD+Shift+D | Split panel vertically              |
| CMD+W       | Close focused panel                 |
| CMD+T       | New workspace tab                   |
| CMD+Shift+W | Close active workspace tab          |
| CMD+1–9     | Switch to workspace by position     |
| CMD+S       | Save current layout as named config |

## Plugin System

v1 plugins are npm workspace packages in `plugins/`. Each plugin:

- Depends on `@origin/api` for type contracts (`PluginManifest`, `PluginContext`)
- Exports a `manifest` and a default React component
- Is registered in `origin.plugins.json` and `src/plugins/registry.ts`

Loading is build-time only in v1 — all plugins must be present at build time via Vite dynamic import. `@origin/hello` is the canonical reference implementation. See `plugins/template/` to scaffold a new plugin, and `docs/SOP/add-plugin.md` for the registration walkthrough. Runtime loading (v2) is documented in `docs/research/vite-plugin-loading.md`.

---

## Working with Claude Code

This project uses Claude Code as its primary development agent. `CLAUDE.md` is the agent's entry point — it contains architecture decisions, critical gotchas, and SOPs that every agent session loads automatically.

### Starting an agent session

```bash
npm run claude
# expands to: claude --plugin-dir .claude/plugin --dangerously-skip-permissions
```

The `--plugin-dir` flag loads project-scoped slash commands:

| Command                   | When to use                                    |
| ------------------------- | ---------------------------------------------- |
| `/origin:pre-code`        | Before writing any component, hook, or command |
| `/origin:issue-lifecycle` | Before picking up a GitHub issue               |
| `/origin:git-workflow`    | Branching, commits, PR workflow                |
| `/origin:complete-work`   | After finishing a task — closes the loop       |

### Supervisor / worker pattern

For longer sprints, run a **supervisor** Claude session alongside a **worker** session. The supervisor reads the project state, writes scoped prompts, and monitors progress — the worker executes tasks one at a time with a fresh context per issue.

```
tmux sessions:
  admin      ← supervisor Claude (reads state, writes prompts, monitors)
  agent-1    ← worker Claude (executes tasks, commits)
```

---

## tmux Workflow

### Recommended `.tmux.conf`

```conf
set -s escape-time 0                     # fixes Esc lag in Claude's TUI
set -g default-terminal "tmux-256color"
set -ga terminal-overrides ",xterm-256color:Tc"
set -g history-limit 50000               # Claude sessions produce high output
set -g mouse on
set -g allow-passthrough on              # OSC 52 clipboard + OSC 8 hyperlinks
setw -q -g utf8 on
set -g pane-base-index 0                 # required for Claude Agent Teams routing
set -g base-index 0
```

### Session setup

```bash
# Create worker session
tmux new-session -s agent-1
# In the agent-1 pane:
cd /path/to/origin && npm run claude

# In a separate terminal, create supervisor session
tmux new-session -s admin
```

### `send-agent` — reliable prompt delivery

Add to `~/.zshrc`. Uses `tmux load-buffer` + `paste-buffer` instead of `send-keys` to avoid Claude Code's paste-truncation bug (#1490):

```bash
send-agent() {
  local target="${1:-agent-1:0.0}"
  cat > /tmp/agent-prompt.txt
  tmux send-keys -t "$target" "/clear" Enter
  sleep 4
  tmux send-keys -t "$target" "" Enter   # dismiss autocomplete confirm
  sleep 1
  tmux load-buffer /tmp/agent-prompt.txt
  tmux paste-buffer -t "$target"
  sleep 1
  tmux send-keys -t "$target" "" Enter
}
```

Usage:

```bash
send-agent << 'EOF'
Read CLAUDE.md first. [current state in one sentence].

[Scoped task steps]

Done when:
- [concrete criteria]
- npx tsc --noEmit passes

Commit as: type(#issue): description
Do not move on to any other task after this commit.
EOF
```

### Checking on the agent

```bash
tmux capture-pane -t agent-1:0.0 -p -S -50
```

### Known tmux + Claude Code issues

| Issue                                                   | Impact                    | Workaround                                                   |
| ------------------------------------------------------- | ------------------------- | ------------------------------------------------------------ |
| `/clear` wipes tmux scrollback (#16310)                 | History lost on each task | Keep a separate shell pane                                   |
| Flickering at 4k–6k scroll events/sec (#9935)           | Visual jitter             | Use Ghostty terminal (DEC 2026 native)                       |
| Large paste freeze (#1490)                              | Terminal hangs            | Use `load-buffer` + `paste-buffer` (handled by `send-agent`) |
| `pane-base-index 1` breaks Agent Teams routing (#23527) | Teammates idle            | Keep `pane-base-index 0`                                     |

---

## Documentation

| Doc                                                | Description                                        |
| -------------------------------------------------- | -------------------------------------------------- |
| [`docs/SPEC.md`](docs/SPEC.md)                     | Full product spec v1.2 — authoritative             |
| [`docs/STANDARDS.md`](docs/STANDARDS.md)           | Coding standards — TypeScript, React, Zustand, CSS |
| [`docs/SOP/index.md`](docs/SOP/index.md)           | Standard operating procedures (SOPs)               |
| [`docs/SOP/add-plugin.md`](docs/SOP/add-plugin.md) | Adding a new plugin — step-by-step                 |
| [`docs/plans/poc.md`](docs/plans/poc.md)           | PoC plan (complete — for reference)                |
| [`docs/research/index.md`](docs/research/index.md) | Research index + key findings                      |
| [`docs/research/risks.md`](docs/research/risks.md) | Pre-build risk register                            |

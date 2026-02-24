# Changelog

## [0.2.0] - 2026-02-24

### Added

- **Terminal plugin** (`@origin/terminal`) — full PTY-backed terminal using xterm.js v6 + WebGL renderer. Spawns `$SHELL -l` with `COLORTERM=truecolor` so Claude Code and other TUI tools render correctly. Uses `Channel<Vec<u8>>` streaming (not `app.emit`). Includes `fix-path-env` so Homebrew/nvm tools are found.
- **File Tree plugin** (`@origin/filetree`) — browse the local filesystem with lazy directory expansion. Persists selected root folder per panel.
- **Monaco Editor plugin** (`@origin/monaco`) — VS Code editor in a panel. Open files via dialog, language detection from extension, dirty tracking, save to disk.
- **Notepad plugin** (`@origin/notepad`) — full-height textarea with 800ms autosave. Content stored per panel in AppData.
- **Browser plugin** (`@origin/browser`) — iframe panel with URL bar, Go button, and reload. Persists last URL per panel.
- **GitHub PRs plugin** (`@origin/github`) — live PR list for any owner/repo. Shows draft/ready status, labels, author, relative time. Auto-refreshes every 5 minutes.
- **Plugin install flow** — Install button in the Plugin Browser modal is now wired. Shows loading → success/error feedback. "Restart to activate" shown on success (v1 build-time plugins).
- **Community registry fetch** — Plugin Browser fetches live community plugins from the GitHub Pages registry alongside built-in plugins.
- **Documentation site** — `origin-site` with 4 pages: Home, Getting Started, Plugin API reference, and Showcase.

### Changed

- All 6 core plugins registered in the BUNDLED map in `registry.ts` — visible in the Plugin Browser immediately on first launch.

## [0.1.0] - 2026-02-24

### Added

- Tiling layout engine with `react-resizable-panels` v4
- Plugin system: build-time Vite dynamic import, `@origin/hello` example plugin
- Plugin Browser modal with community registry fetch
- Keyboard navigation: directional focus (CMD+Opt+HJKL), panel resize, last-workspace toggle
- macOS code signing, GitHub Actions release pipeline (aarch64 + x86_64)
- Auto-updater via `tauri-plugin-updater`
- Homebrew cask tap (`fellanH/homebrew-note`)
- Multi-workspace support with workspace tabs

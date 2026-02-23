# origin — Manual Verification Checklist

Run through this after `npm run tauri:dev` is open. These items cannot be verified by the build process alone.

---

## Core shell

- [x] `npm run tauri:dev` starts without errors in terminal
- [x] App opens showing tab bar + centered empty-state block (keyboard hints visible)
- [x] Traffic lights are at correct position (aligned vertically with tab text)
- [x] Window is draggable from the empty space in the tab bar

---

## Tabs

- [x] `[+]` button opens a new empty workspace tab
- [x] `CMD+T` opens a new empty workspace tab
- [x] Clicking a tab switches the panel layout instantly
- [x] `[×]` on a tab closes it
- [x] `CMD+Shift+W` closes the active tab
- [x] Closing the last tab resets to one empty workspace (app does not close)
- [x] `CMD+1` / `CMD+2` switch between tabs by position
- [x] Double-clicking a tab label makes it editable inline; Enter commits, Escape cancels
- [x] Tab state persists across app restarts (all workspaces restored)

---

## Split panels

- [x] `CMD+D` splits the active panel into two horizontal panels; new panel is focused
- [x] `CMD+Shift+D` splits the active panel into two vertical panels; new panel is focused
- [x] Panels can be split recursively (3+ levels deep)
- [x] Dragging the divider resizes sibling panels proportionally
- [x] `CMD+W` closes the focused panel; sibling expands to fill
- [x] Closing the last panel in a tab returns that tab to empty-state
- [x] Clicking a panel changes focus (visible focus ring on active panel)
- [x] `CMD+W` does NOT close the native window when panels are open

---

## Plugins

- [x] Empty panel shows EmptyState with `@origin/hello` listed (name + icon visible)
- [x] Clicking `@origin/hello` in EmptyState mounts the Hello component in that panel
- [x] Hello component shows the panel ID
- [x] Plugin assignments survive tab switching (plugin still mounted when you return)
- [x] Splitting a panel that has a plugin: original panel keeps the plugin, new panel shows EmptyState
- [ ] A crashing plugin shows an inline error in its panel; other panels are unaffected

---

## Saved configs

- [x] `[Saved ▾]` button is visible in the tab bar after `[+]`
- [x] Clicking `[Saved ▾]` opens a dropdown with "Save current" at the top
- [x] "Save current" shows an inline name input; Enter commits, Escape cancels
- [x] `CMD+S` opens the Saved dropdown and enters save mode
- [ ] Clicking a saved config in the dropdown opens its layout in a new tab
- [ ] Plugin assignments are restored when a config is loaded
- [ ] Hovering a config in the dropdown reveals a `×` delete button on the right
- [ ] Clicking `×` removes that config from the dropdown
- [ ] Clicking outside the dropdown closes it
- [ ] Saved configs persist across app restarts

---

## Persistence

- [x] Panel layout (splits + resize) persists across app restarts
- [x] Active workspace tab is restored on restart
- [x] Saved configs list persists across app restarts
- [x] Window size and position are restored on restart (`tauri-plugin-window-state`)

---

## Build checks (automated — run before shipping)

```bash
npx tsc --noEmit   # must exit 0
npm run build      # must exit 0, output in dist/
```

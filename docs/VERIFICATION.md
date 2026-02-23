# note — Manual Verification Checklist

Run through this after `npm run tauri:dev` is open. These items cannot be verified by the build process alone.

---

## Core shell

- [ ] `npm run tauri:dev` starts without errors in terminal
- [ ] App opens showing tab bar + centered empty-state block (keyboard hints visible)
- [ ] Traffic lights are at correct position (aligned vertically with tab text)
- [ ] Window is draggable from the empty space in the tab bar

---

## Tabs

- [ ] `[+]` button opens a new empty workspace tab
- [ ] `CMD+T` opens a new empty workspace tab
- [ ] Clicking a tab switches the panel layout instantly
- [ ] `[×]` on a tab closes it
- [ ] `CMD+Shift+W` closes the active tab
- [ ] Closing the last tab resets to one empty workspace (app does not close)
- [ ] `CMD+1` / `CMD+2` switch between tabs by position
- [ ] Double-clicking a tab label makes it editable inline; Enter commits, Escape cancels
- [ ] Tab state persists across app restarts (all workspaces restored)

---

## Split panels

- [ ] `CMD+D` splits the active panel into two horizontal panels; new panel is focused
- [ ] `CMD+Shift+D` splits the active panel into two vertical panels; new panel is focused
- [ ] Panels can be split recursively (3+ levels deep)
- [ ] Dragging the divider resizes sibling panels proportionally
- [ ] `CMD+W` closes the focused panel; sibling expands to fill
- [ ] Closing the last panel in a tab returns that tab to empty-state
- [ ] Clicking a panel changes focus (visible focus ring on active panel)
- [ ] `CMD+W` does NOT close the native window when panels are open

---

## Plugins

- [ ] Empty panel shows the Launcher with `@note/hello` listed (name + icon visible)
- [ ] Clicking `@note/hello` in the Launcher mounts the Hello component in that panel
- [ ] Hello component shows the panel ID
- [ ] Plugin assignments survive tab switching (plugin still mounted when you return)
- [ ] Splitting a panel that has a plugin: original panel keeps the plugin, new panel shows Launcher
- [ ] A crashing plugin shows an inline error in its panel; other panels are unaffected

---

## Saved configs

- [ ] `[Saved ▾]` button is visible in the tab bar after `[+]`
- [ ] Clicking `[Saved ▾]` opens a dropdown with "Save current" at the top
- [ ] "Save current" prompts for a name; entering a name adds it to the dropdown
- [ ] `CMD+S` also prompts for a name and saves
- [ ] Clicking a saved config in the dropdown opens its layout in a new tab
- [ ] Plugin assignments are restored when a config is loaded
- [ ] Hovering a config in the dropdown reveals a `×` delete button on the right
- [ ] Clicking `×` removes that config from the dropdown
- [ ] Clicking outside the dropdown closes it
- [ ] Saved configs persist across app restarts

---

## Persistence

- [ ] Panel layout (splits + resize) persists across app restarts
- [ ] Active workspace tab is restored on restart
- [ ] Saved configs list persists across app restarts
- [ ] Window size and position are restored on restart (`tauri-plugin-window-state`)

---

## Build checks (automated — run before shipping)

```bash
npx tsc --noEmit   # must exit 0
npm run build      # must exit 0, output in dist/
```

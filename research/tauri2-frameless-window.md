# Tauri 2 — Frameless Window with macOS Traffic Lights

**Researched:** 2026-02-23
**Target:** Tauri 2.10.2, macOS, `titleBarStyle: "Overlay"` + custom tab bar

---

## Correct `tauri.conf.json` Window Config

```json
{
  "label": "main",
  "title": "Note",
  "width": 1200,
  "height": 800,
  "minWidth": 600,
  "minHeight": 400,
  "decorations": true,
  "titleBarStyle": "Overlay",
  "hiddenTitle": true,
  "trafficLightPosition": { "x": 14, "y": 22 },
  "acceptFirstMouse": true,
  "shadow": true
}
```

| Field                  | Value                  | Why                                                                                                                           |
| ---------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `decorations`          | `true`                 | Must be `true` for `trafficLightPosition` to work. `false` removes traffic lights entirely.                                   |
| `titleBarStyle`        | `"Overlay"`            | Webview occupies full window height from y=0. Traffic lights float on top as overlay.                                         |
| `hiddenTitle`          | `true`                 | Suppresses title string from rendering inside the traffic light bar area.                                                     |
| `trafficLightPosition` | `{ "x": 14, "y": 22 }` | Repositions the cluster. Requires `decorations: true` + `titleBarStyle: "Overlay"`. Available since Tauri 2.4.0.              |
| `acceptFirstMouse`     | `true`                 | Without this, first click on unfocused window focuses it but drag doesn't begin — user must drag twice. Fix for issue #11605. |
| `shadow`               | `true`                 | Keeps native drop shadow.                                                                                                     |

**Why `"Overlay"` and not `"Transparent"`:** `"Transparent"` keeps the title bar area reserved — webview starts _below_ the traffic lights, not under them. You cannot put your tabs there. `"Overlay"` makes the webview occupy the full window height, with traffic lights overlaid on top — exactly what we need. (`"Transparent"` also has an active macOS 15 bug with inverted `backgroundColor` — avoid.)

---

## Traffic Light Clearance — CSS Padding

The traffic light cluster dimensions (stable since macOS 11 Big Sur, unchanged on Sequoia 15.x):

- Each button: 12×12 px (logical)
- Spacing between buttons: ~6–7 px center-to-center

With `trafficLightPosition: { x: 14, y: 22 }`:

```
padding-left = x + (3 × 12px buttons) + (2 × 6px gaps) + breathing room
             = 14 + 36 + 12 + 18 = 80px
```

**Use `padding-left: 80px` on the tab bar.** This is also what VS Code and Zed use.

Note: `env(titlebar-area-height)` CSS variable is **not implemented** in Tauri 2.10. Use fixed values.

---

## Drag Region

**Apply `data-tauri-drag-region` to the tab bar container, not individual tabs.** Tauri checks whether the clicked element has the attribute — tabs and buttons without it pass clicks to React normally.

```tsx
export function TitleBar({ children }) {
  return (
    <div className="titlebar" data-tauri-drag-region>
      {/* Tabs intercept clicks — no drag conflict */}
      {children}
      {/* Spacer fills right side, inherits drag */}
      <div className="flex-1" data-tauri-drag-region />
    </div>
  );
}
```

CSS alternative (belt-and-suspenders, use both):

```css
.titlebar {
  -webkit-app-region: drag;
}
.titlebar button,
.titlebar [role="tab"],
.titlebar a,
.titlebar input {
  -webkit-app-region: no-drag;
}
```

---

## Full CSS

```css
.titlebar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  padding-left: 80px; /* traffic light clearance */
  display: flex;
  align-items: center;
  -webkit-app-region: drag;
  z-index: 9999;
  user-select: none;
}

.titlebar button,
.titlebar [role="tab"],
.titlebar a,
.titlebar input {
  -webkit-app-region: no-drag;
}

#root {
  padding-top: 52px; /* push content below fixed bar */
}
```

---

## Known Bugs — All Relevant to This Project

### Bug 1: `setTitle()` resets `trafficLightPosition` (Issue #13044)

- **Status:** Open
- **Behavior:** Calling `window.setTitle()` resets traffic lights to default position.
- **Fix:** Use `hiddenTitle: true` and never call `setTitle()`. Update `document.title` instead (does not trigger the reset).

### Bug 2: `unstable` feature flag breaks `trafficLightPosition` (Issue #14072)

- **Status:** Open (reported on macOS 15.5.0, Tauri 2.8.3)
- **Behavior:** Traffic lights revert to `(0, 0)` when `unstable` Cargo feature is enabled.
- **Fix:** Do not use the `unstable` feature.

### Bug 3: Double-click drag region maximizes window (Issue #12006)

- **Status:** Fixed via capability deny
- **Fix:** Add to `src-tauri/capabilities/default.json`:

```json
"core:window:deny-toggle-maximize",
"core:window:deny-internal-toggle-maximize"
```

### Bug 4: `acceptFirstMouse` unreliable on show/hide toggle (Issue #6781)

- **Status:** Known limitation
- **Behavior:** If window is toggled via `show()`/`hide()` (e.g. system tray), first-click drag may revert.
- **Relevance:** Low for v1 — only matters if adding system tray toggling later.

---

## `titleBarStyle` Comparison

| Value           | Webview starts at           | Traffic lights           | Use case                                  |
| --------------- | --------------------------- | ------------------------ | ----------------------------------------- |
| `"Visible"`     | Below native title bar      | Yes, in native bar       | Standard native window                    |
| `"Transparent"` | Below native title bar area | Yes, in bar area         | Transparent background, bar area reserved |
| `"Overlay"`     | Top of window (y=0)         | Yes, overlaid on webview | **Custom tab bar — use this**             |

---

## macOS Version Notes

- Traffic light dimensions and spacing: **stable since macOS 11 Big Sur**. Unchanged on Sequoia 15.x.
- `acceptFirstMouse` bug (#11605): reported on Sonoma 14.6.1 and Sequoia 15.x. `acceptFirstMouse: true` is the fix.
- Unstable feature flag bug (#14072): reported specifically on macOS 15.5.0.
- Fullscreen: traffic lights move to overlay toolbar on fullscreen entry — handled by the system. No special handling needed unless using dynamic `setTitle()` (see Bug 1).

---

## Sources

- [Tauri Window Customization docs](https://v2.tauri.app/learn/window-customization/)
- [Tauri Configuration Reference](https://v2.tauri.app/reference/config/)
- [Issue #13044 — setTitle resets traffic light position](https://github.com/tauri-apps/tauri/issues/13044)
- [Issue #14072 — unstable feature breaks trafficLightPosition](https://github.com/tauri-apps/tauri/issues/14072)
- [Issue #12006 — double-click drag region maximizes](https://github.com/tauri-apps/tauri/issues/12006)
- [Issue #11605 — drag requires second click when unfocused](https://github.com/tauri-apps/tauri/issues/11605)
- [tauri-plugin-decorum](https://github.com/clearlysid/tauri-plugin-decorum)

# Native macOS App Embedding in Tauri 2 — Feasibility Research

**Researched:** 2026-02-24
**Scope:** Can a Tauri 2 (WKWebView-based) macOS app embed arbitrary installed macOS applications (Finder, Terminal, Notes, etc.) as live interactive panels?
**Distribution target:** Developer ID signed, notarized, distributed outside App Store.

---

## Summary Verdict (read first)

**Genuine embedding is impossible.** macOS does not permit any process to reparent or steal ownership of another process's window into its own window hierarchy. There is no public API for this. Every approach that gets close either requires disabling SIP, using private APIs that trigger App Store and notarization rejections, or degrades to a non-interactive screenshot. The closest viable option — a screen-capture mirror with synthesized event forwarding — is technically achievable for a Developer ID app but carries severe UX penalties (monthly permission re-prompts on macOS Sequoia, ~1-2 frame latency on visual output, unreliable keyboard routing) that make it unsuitable for a tiling dashboard.

---

## Approach 1 — WKWebView / Webview Embedding

### What this would mean

Loading another app's native UI inside the WKWebView that Tauri uses as its rendering surface, either as a subview or by injecting it into the webview's window hierarchy.

### Findings

WKWebView is a sandboxed Webkit process. Its content is HTML/CSS/JS rendered by WebKit. It has no mechanism to host a native AppKit `NSView` subtree from another process, let alone an entirely separate application.

- WKWebView itself runs in a separate `com.apple.WebKit.WebContent` process (since macOS 10.11). The webview process's sandbox blocks it from communicating with arbitrary native processes.
- Even in the parent Tauri/WKWebView host process, `NSWindow.addChildWindow(_:ordered:)` only works for windows owned by the **same process**. Apple's AppKit documentation makes no provision for cross-process child windows; the CEF forum has a well-known thread confirming that embedding a CEF window that lives in a different process into a parent NSWindow fails silently on macOS (while working on Linux via XReparentWindow and on Windows via SetParent).
- There is no `<webview>` or `<embed>` tag that can reach into a native process. The `<object>` tag for NPAPI plugins is long dead on macOS.
- Content Security Policy and the WKWebView sandbox impose additional restrictions on arbitrary resource loading.

### Feasibility: **IMPOSSIBLE**

| Attribute                 | Value                                    |
| ------------------------- | ---------------------------------------- |
| Feasibility               | Impossible                               |
| Required entitlements     | None — the technique does not exist      |
| Sandboxing implication    | WKWebView sandbox completely blocks this |
| Implementation complexity | N/A                                      |
| Known working examples    | None                                     |

---

## Approach 2 — NSWorkspace / NSRunningApplication Window Reparenting

### What this would mean

Using AppKit APIs (`NSWorkspace`, `NSRunningApplication`, `NSWindow.addChildWindow`) to locate another running app's `NSWindow` and add it as a child of the Tauri app's window, causing it to appear visually embedded.

### Findings

**This is the most-asked question on the Apple Developer Forums and the answer is consistently: not possible across process boundaries.**

`NSWindow.addChildWindow(_:ordered:)` is explicitly an intra-process API. The receiver and the argument must both belong to the same application process. Calling it with a window belonging to a foreign process produces undefined behaviour — in practice it silently fails or crashes. Apple's own documentation says nothing about cross-process use because cross-process use is not a supported model.

The lower-level reasoning: macOS windows are owned by WindowServer. Each app communicates with WindowServer via a private Mach port. An app's connection to WindowServer only carries authority over that app's own windows. There is no API to transfer a window's WindowServer registration to a different process's connection.

**SIP is not the primary blocker here — the blocker is that the public API simply does not work cross-process.** SIP additionally protects system processes (Dock, WindowServer, Finder) against code injection that could theoretically hijack their window handles, but even before SIP (macOS < 10.11) window reparenting across processes was not a supported AppKit pattern.

`NSRunningApplication` gives you metadata (bundle ID, process ID, activation state) and the ability to activate, hide, or terminate another app. It does not expose the app's window hierarchy in any way.

### Feasibility: **IMPOSSIBLE**

| Attribute                 | Value                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feasibility               | Impossible                                                                                                                                        |
| Required entitlements     | None would help — the API itself does not support cross-process use                                                                               |
| Sandboxing implication    | Sandboxed apps cannot even inspect foreign process windows; non-sandboxed apps get the same result (public API simply doesn't work cross-process) |
| Implementation complexity | N/A                                                                                                                                               |
| Known working examples    | None. Every forum thread that asks about this ends with "use IOSurface" (for rendering only) or "not possible"                                    |

---

## Approach 3 — Accessibility API (AXUIElement) to Simulate Embedding

### What this would mean

Using the macOS Accessibility API (`AXUIElement`) to locate another app's windows, then continuously repositioning and resizing them to track the position of a panel in the Origin app, giving the visual illusion that the foreign app's window is "inside" Origin's panel.

### How tiling window managers use this

Rectangle, Amethyst, and AeroSpace all use this pattern — they move and resize foreign windows by sending AX attribute mutations. This is the **only legitimate mechanism for controlling foreign window geometry on macOS.**

- `AXUIElementSetAttributeValue` with `kAXPositionAttribute` (CGPoint) and `kAXSizeAttribute` (CGSize) sends resize/move requests to the target app.
- The target app must respond (some apps ignore or delay AX commands).
- You can bring the window to the front with `AXUIElementPerformAction(kAXRaiseAction)`.

### Why this falls short of "embedding"

The foreign window is still a separate, top-level OS window. It is not inside Origin's view hierarchy. Specifically:

1. **Z-order is not controlled.** Another app can pop on top. The user clicking elsewhere can send the foreign window behind Origin. There is no atomic "lock this window to sit behind a specific NSView."
2. **Borders and decoration persist.** The foreign window keeps its title bar, traffic lights, and drop shadow. There is no API to suppress these on a window you do not own.
3. **No actual containment.** If the user resizes Origin, the foreign window needs to be programmatically re-adjusted on every layout change. There is no binding or constraint relationship.
4. **The foreign app controls its own geometry.** Many apps (Finder, Notes) snap to grid sizes or enforce minimum dimensions, and will silently resist arbitrary AX resize commands.
5. **Focus management is not controllable.** Clicking in the panel area will switch focus to the foreign app, which may de-focus Origin entirely.

### Sandboxing and Entitlements

This is the most critical practical blocker for a Tauri 2 app:

- **Sandboxed apps cannot use the Accessibility API.** When App Sandbox is enabled, `AXIsProcessTrusted()` always returns `false`. The permission prompt does not appear, and the user cannot manually add the app in System Settings → Privacy & Security → Accessibility. This has been an unresolved Apple developer forum issue since at least 2022 (thread/810677).
- **Tauri 2 does not enable App Sandbox by default** for Developer ID builds. The stock Tauri `Entitlements.plist` only adds the JIT entitlements (`com.apple.security.cs.allow-jit`, `com.apple.security.cs.allow-unsigned-executable-memory`). App Sandbox would be an explicit addition. If Origin does not add `com.apple.security.app-sandbox`, it is a non-sandboxed app — meaning the Accessibility API is available subject to the user granting permission.
- For a non-sandboxed Developer ID app: the user must grant Accessibility permission once (System Settings → Privacy & Security → Accessibility). After that, `AXIsProcessTrusted()` returns `true` and window manipulation works. Rectangle operates this way — it explicitly cannot be in the App Store because the App Store requires sandboxing.

### What "embedding" would actually look like

You would need to:

1. On panel layout change, calculate the screen-space rect of each panel.
2. For panels containing foreign apps, issue AX move/resize commands to position the foreign window exactly over the panel rect.
3. Keep the foreign window always on a z-layer just above Origin's window.
4. On Origin window move/resize, repeat step 2.
5. Accept that the foreign window's decorations are visible, its title bar is interactive, and clicking away from Origin can break the arrangement.

This is "fake tiling of native apps alongside Origin" — not embedding inside Origin panels.

### Feasibility: **RESTRICTED — Simulated only, not true embedding**

| Attribute                 | Value                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| Feasibility               | Restricted: geometry control only, not visual embedding                                                   |
| Required entitlements     | Accessibility must be granted by user; requires non-sandboxed build (no `com.apple.security.app-sandbox`) |
| Sandboxing implication    | Breaks entirely if App Sandbox is added; non-sandboxed is fine for Developer ID                           |
| Implementation complexity | Medium: requires Rust/Swift native plugin to call AX APIs, continuous position tracking, layout sync      |
| Known working examples    | Rectangle, Amethyst, AeroSpace (geometry control only, not panel embedding)                               |

---

## Approach 4 — Screen Capture + Event Forwarding (ScreenCaptureKit + CGEvent)

### What this would mean

Capture a live pixel stream of another app's window using ScreenCaptureKit, render it inside Origin's panel as a video texture (e.g., via Metal or an NSView with IOSurface), and forward mouse/keyboard events from the panel to the target app using `CGEvent` posting or `AXUIElement` actions.

This is the closest to genuine embedding that any macOS app can achieve without private APIs — it is effectively a local "remote desktop" viewer.

### How it works technically

**Capture side (ScreenCaptureKit, macOS 12.3+):**

- `SCShareableContent.getExcludingDesktopWindows(false, onScreenWindowsOnly: true)` enumerates running app windows.
- Create an `SCStreamConfiguration` targeting a specific `SCWindow`.
- Start an `SCStream` — frames arrive as `CMSampleBuffer` (IOSurface-backed Metal textures) via `SCStreamOutput` delegate at up to 60fps (or display refresh rate on Apple Silicon with ProMotion).
- Render the texture into an `MTKView` or a `CAMetalLayer` embedded in Origin's NSView hierarchy.

**Event forwarding side (CGEvent + AXUIElement):**

- On mouse click in the capture area, compute the click position in the target window's coordinate space.
- Use `CGEvent(mouseEventSource:type:mouseCursorPosition:mouseButton:)` to post a synthetic mouse event. Setting the event's location to within the target window and using `CGEventPost(.annotatedSession, event)` routes it to the front app.
- For keyboard events: `CGEvent(keyboardEventSource:virtualKey:keyDown:)` + `CGEventPost`.
- Use `AXUIElement` to bring the target window to focus before posting events, and return focus to Origin afterward — or accept that clicking in the capture area switches focus to the target app temporarily.

**The round-trip for "click inside panel" → "target app responds":**

1. User clicks in Origin panel (WebView captures the click).
2. JS `mousedown` event fires — Tauri IPC call to Rust.
3. Rust translates coordinates and posts `CGEvent` to the target app.
4. Target app processes the click and redraws its window.
5. ScreenCaptureKit delivers the updated frame to Origin's stream (typically within 1-2 display refresh cycles at 60fps = 16-33ms).
6. Origin renders the new frame.

### Latency

- **Capture latency:** ScreenCaptureKit frame delivery latency is approximately 1 frame at 60fps (≈16ms) under normal conditions, measured from the moment content changes in the target window to the moment `SCStreamOutput.stream(_:didOutputSampleBuffer:of:)` is called. Apple has documented that the minimum frame interval defaults to `1/60` on macOS 15. Under load, latency can increase to 2-3 frames.
- **Event-to-render round-trip:** total latency from click to visual feedback is realistically 32-80ms on a fast machine, noticeably higher than native interaction. This feels like a mildly laggy remote session — perceptible but not extreme.
- **Comparison:** A real remote desktop session (e.g., screen sharing) has comparable latency. For Terminal or Finder use, this is borderline acceptable. For a video player or animation-heavy app, it would be noticeable.

### Is interaction truly possible?

Partially. `CGEvent` posting works, but there are significant edge cases:

- **Focus stealing:** When you post a click event to the target app, it typically becomes the frontmost app, visually stealing focus from Origin. You would need to either accept this or implement complex focus-juggling.
- **Coordinate translation:** You must correctly map click positions from Origin's panel coordinate space → screen space → target window's coordinate space. Scaling (display zoom, Retina 2x) adds complexity.
- **Accessibility permission required:** `CGEvent` posting requires Accessibility permission for the sending app (same restriction as AXUIElement).
- **Keyboard routing:** Keyboard events via CGEvent require the target app to be frontmost or explicitly targeted. If Origin's webview has focus, keyboard events typed go to Origin, not the captured app — unless you continuously swap focus back and forth, which creates severe UX friction.
- **Drag and drop:** Not easily synthesizable via CGEvent. Dragging within the panel would require a sequence of mouse-down → mouse-drag → mouse-up events with careful timing.

### Permissions and their UX cost

This approach requires **two privacy permissions**:

1. **Screen Recording** (`Privacy & Security → Screen Recording`): Required by ScreenCaptureKit to capture any window content. The user must grant this on first run.
2. **Accessibility** (`Privacy & Security → Accessibility`): Required to post `CGEvent` to other applications.

**macOS Sequoia (15.x) permission re-prompt:** Apple introduced monthly (reduced from weekly in a beta) re-prompts for Screen Recording in macOS Sequoia 15.0. As of 15.1, re-prompts happen less frequently, but the policy is not fully stable. Apps that use ScreenCaptureKit for persistent capture (as Origin would) will face this prompt. A special **Persistent Content Capture** entitlement (`com.apple.security.screencapture.persistent`) exists to avoid the re-prompt, but Apple provides no public documentation on how to obtain it — it appears to be a private entitlement reserved for VNC-class apps. As of August 2024, Apple confirmed this entitlement exists but offered only a request form with no committed timeline.

### Sandboxing

This approach requires a **non-sandboxed build** for the Accessibility permission (same as Approach 3). The Screen Recording permission is compatible with sandboxed apps — ScreenCaptureKit itself works in the sandbox — but the combination with CGEvent posting forces non-sandboxed.

### Feasibility: **RESTRICTED — Technically possible, severe UX friction**

| Attribute                 | Value                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Feasibility               | Restricted: works technically, but interaction quality is poor and permission UX is hostile                                        |
| Required entitlements     | Screen Recording (runtime permission); Accessibility (runtime permission); `com.apple.security.cs.allow-jit`; no App Sandbox       |
| Sandboxing implication    | Non-sandboxed required (CGEvent + Accessibility)                                                                                   |
| Implementation complexity | High: Metal rendering pipeline, IOSurface texture management, CGEvent coordinate translation, focus management, Tauri IPC plumbing |
| Known working examples    | Multi.app (collaborative screen sharing — same technical stack), OBS macOS capture source, all macOS screen share solutions        |

---

## Approach 5 — XPC Services / App Extensions (ExtensionKit)

### What this would mean

Using Apple's official inter-process UI mechanism — **ExtensionKit** (`EXHostViewController`, macOS 13+) — to host UI from a separately-built extension inside Origin's window.

### How ExtensionKit works

ExtensionKit (distinct from NSExtension/App Extensions) allows a macOS app to define extension points and host UI from extension processes in its own window hierarchy. Communication is via XPC. The extension renders its own SwiftUI/AppKit view hierarchy, and `EXHostViewController` embeds a "remote view" — a live rendering of the extension's UI — inside the host app's NSView tree.

**The critical constraint:** ExtensionKit requires the extension to be a specifically built and distributed binary that declares support for the host app's extension point. You cannot use ExtensionKit to embed an arbitrary installed macOS app (Finder, Terminal, Notes) — those apps do not have ExtensionKit extension bundles that declare themselves compatible with Origin's extension point schema.

ExtensionKit is designed for scenarios like:

- A text editor exposing an extension point that language-server plugins can contribute UI to.
- A developer tool allowing third-party panels to be embedded (like Xcode source editor extensions).

It is **not** a mechanism for general-purpose embedding of arbitrary system applications.

### The "remote view" interaction limitation

The Chimehq blog (September 2022, covering Ventura Beta 6) noted that ExtensionKit remote views did not integrate with accessibility systems as of that beta. More critically, earlier documentation (and the search result from the earlier multi-domain query about XPC services) noted that "the user cannot interact with anything in the external process" — but this appears to have been partially addressed in later betas. As of macOS Ventura (13.0) release, basic interaction via remote views is possible but with caveats around window resizing performance.

Regardless, ExtensionKit cannot help with the specific goal of embedding Finder, Terminal, or Notes, because those apps do not vend ExtensionKit-compatible extension bundles for third-party host apps.

### Feasibility: **IMPOSSIBLE for arbitrary apps**

| Attribute                 | Value                                                                                                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feasibility               | Impossible for Finder/Terminal/Notes; possible only for apps explicitly built as Origin extension providers                                                                                             |
| Required entitlements     | `com.apple.developer.extension-point.code-edit` or a custom extension point (requires Developer ID, available outside App Store)                                                                        |
| Sandboxing implication    | Extensions run in their own sandboxed process; compatible with host being sandboxed or not                                                                                                              |
| Implementation complexity | Very high: requires defining an Origin extension point schema, building an ExtensionKit host, and writing an extension for each app you want to embed — which means you control the embedded app's code |
| Known working examples    | Chime text editor (extensionkit-intro blog post), TextTransformer sample app                                                                                                                            |

---

## Approach 6 — Electron Precedents

### What Electron has done

**Electron issue #10547 ("Embed External Native Windows")** is the canonical reference. Filed in 2017, the conclusion from the Electron core team was: "There is no clean method of taking a native window and embedding it into the application." The issue was closed without resolution.

Electron's own `addChildWindow` (via `BrowserWindow.setParentWindow`) is intra-process only. It creates a parent-child relationship between two Electron-owned `BrowserWindow` instances.

**christophpurrer/electron-native-window** (GitHub): This project demonstrates opening a new native OS window from Electron, **not** embedding a foreign app's window. It creates an Objective-C/Swift window owned by the Electron process — still same-process.

**Chromium's cross-process rendering (IOSurface approach):** Chromium's GPU process and renderer processes use `IOSurface` to share rendered output across process boundaries. This is how Chromium achieves multi-process rendering while compositing everything into a single visible window. However:

- This only works when Chromium owns **both** the producer process (renderer) and the consumer process (browser).
- You cannot do this with an arbitrary third-party app because you cannot make Finder or Terminal produce an IOSurface that you can subscribe to — they produce frames for WindowServer, not for arbitrary third-party consumers.
- `CAContext`/`CALayerHost` — the private CoreAnimation API used to implement this — causes **App Store rejection** and is flagged by Apple's automated binary scanning during notarization review (Electron issues #20027, #20040 document this).

**No Electron or Tauri app has successfully embedded a genuinely foreign native application's window.** Every known implementation either embeds windows from the same process, uses screen capture (ScreenCaptureKit) as a display layer, or is a demo of moving/resizing foreign windows via AX without true embedding.

### Feasibility: **IMPOSSIBLE (genuine embedding); RESTRICTED (screen capture illusion)**

| Attribute   | Value                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------ |
| Feasibility | No precedent for genuine embedding; screen capture approaches are used in production (Multi.app) |
| Notes       | The Electron community has definitively closed the "embed foreign windows" question              |

---

## Cross-Cutting Technical Notes

### Why macOS Fundamentally Prohibits Cross-Process Window Embedding

Unlike X11 (Linux) where `XReparentWindow` allows moving a window between clients and EWMH lets window managers freely re-parent any window, or Win32 where `SetParent(hwnd, newParent)` can steal another process's window, **macOS's WindowServer does not expose reparenting as a public operation.**

Every NSWindow has a private Mach send right to WindowServer. That send right is process-local. There is no OS primitive to transfer or share it. The window compositor runs in `WindowServer` (pid typically ~100), and each app controls only its own layer tree. Cross-process visual composition happens exclusively through IOSurface (where both producer and consumer must agree, or the OS mediates via ScreenCaptureKit).

**System Integrity Protection (SIP)** adds another layer: it protects system processes (Dock, Finder, WindowServer, loginwindow) against DYLD injection and code modification, which closes off the most obvious "hack" approach of injecting your own code into Finder to make it render into an IOSurface you control.

### The IOSurface Truth

IOSurface **is** a cross-process shared memory mechanism for GPU textures, and it is used by Chromium, WebKit, and other browsers for exactly this purpose. However, for IOSurface to work as a cross-process rendering bridge, the producer (the app you want to embed) must explicitly create and publish an IOSurface for you to read. Finder, Terminal, Notes, and virtually all AppKit applications do not do this — they render to private WindowServer layer contexts. ScreenCaptureKit is essentially Apple's managed way of getting at those WindowServer composited frames without requiring the app to cooperate.

---

## Recommendation for Origin (Tauri 2, Developer ID, Outside App Store)

### What is and is not viable

| Approach                                      | Verdict for Origin                                                                                                                                                                     |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WKWebView embedding                           | Not viable — technically impossible                                                                                                                                                    |
| NSWindow reparenting                          | Not viable — technically impossible cross-process                                                                                                                                      |
| AXUIElement geometry control                  | Partially viable: can tile foreign windows alongside Origin panels, but not inside them. Requires Accessibility permission, non-sandboxed build.                                       |
| ScreenCaptureKit + CGEvent (capture + events) | Partially viable: achieves a visual approximation of embedding with interaction. High complexity, hostile permissions UX on macOS Sequoia (monthly re-prompt), non-sandboxed required. |
| ExtensionKit (XPC remote views)               | Not viable for arbitrary apps; only for apps you control and ship as Origin extensions                                                                                                 |
| IOSurface / CALayerHost (private)             | Not viable: private API triggers notarization rejection                                                                                                                                |

### Recommended path if you want "native app panels" in Origin

**Do not pursue genuine native app embedding.** It does not exist on macOS and Apple has shown no interest in enabling it. Design around this constraint:

**Option A — Side-by-side tiling via AXUIElement (no sandbox, Developer ID)**

Don't embed foreign apps inside Origin's panels. Instead, Origin manages a tiling region of the screen. When a panel is assigned a native app, Origin uses AXUIElement to position and resize that app's window to cover the panel's screen-space rect, then tracks the rect on every layout change. The foreign app appears "alongside" Origin's content panels, not inside them. This is architecturally similar to yabai's non-SIP mode and how AeroSpace works.

- Requires the user to grant Accessibility permission once.
- The foreign app's window decorations (title bar, traffic lights) remain visible — partially mitigated by requesting the target app go fullscreen or by resizing Origin to cover the menu bar area.
- Breaks if the user interacts with other apps that move windows out of place.
- Implementation: a Rust/Swift Tauri plugin that wraps AX calls; triggered on every layout change event from the React panel engine.

**Option B — Screen capture panels (non-sandbox, Developer ID, accept permission UX)**

Use ScreenCaptureKit to stream target windows into Metal textures rendered inside Origin panels. Accept the Accessibility + Screen Recording double-permission requirement and the monthly Sequoia re-prompt. Implement CGEvent forwarding for click/keyboard interaction.

- This is what multi.app built for collaborative sharing — it is a legitimate production architecture.
- The interaction latency (32-80ms) is acceptable for Terminal and Finder but feels sluggish for animation-heavy apps.
- Implementation complexity is very high: Metal rendering pipeline, IOSurface texture management, event coordinate translation, Tauri IPC bridge to Rust for all of the above.
- Monthly re-prompt on macOS Sequoia is a UX liability. Users of Loom, Cleanshot, and similar tools already deal with this, but it's friction.

**Option C — WebView plugins for web-native replacements**

The architecturally cleanest path: instead of embedding native apps, build or integrate web-native equivalents as Origin plugins:

- Terminal: `xterm.js` (used by VS Code, Hyper) wrapped as a `@origin/terminal` plugin backed by a Tauri `tauri-plugin-shell` pseudo-terminal.
- File browser: React-based file manager using `tauri-plugin-fs`.
- Notes: ProseMirror or TipTap-based editor plugin.

These are fully interactive, live inside Origin's webview, require no special permissions, and are consistent with Origin's existing plugin model. The cost: these are non-trivial plugins to build, and they are not "the real Finder/Terminal" — they are alternatives.

### The practical recommendation

**For Origin's current scope (tiling dashboard, plugin API), Option C is the right path.** Build web-native plugin equivalents for the apps most likely to be requested (terminal, file browser, notes). If native app mirroring is specifically requested as a feature by users, revisit Option A (AX tiling) or Option B (ScreenCaptureKit capture) as a later plugin, accepting that neither achieves true embedding and both require significant permissions engineering.

Do not invest engineering time attempting cross-process window embedding — it is not possible on macOS.

---

## Sources

- [NSWindow.addChildWindow — Apple Developer Documentation](https://developer.apple.com/documentation/appkit/nswindow/1419152-addchildwindow)
- [NSRunningApplication — Apple Developer Documentation](https://developer.apple.com/documentation/appkit/nsrunningapplication)
- [AXUIElement.h — Apple Developer Documentation](https://developer.apple.com/documentation/applicationservices/axuielement_h)
- [Accessibility permission not granted for sandboxed macOS app — Apple Developer Forums](https://developer.apple.com/forums/thread/810677)
- [ScreenCaptureKit — Apple Developer Documentation](https://developer.apple.com/documentation/screencapturekit/)
- [Capturing screen content in macOS — Apple Developer Documentation](https://developer.apple.com/documentation/ScreenCaptureKit/capturing-screen-content-in-macos)
- [Meet ScreenCaptureKit — WWDC22](https://developer.apple.com/videos/play/wwdc2022/10156/)
- [A look at ScreenCaptureKit on macOS Sonoma — Nonstrict](https://nonstrict.eu/blog/2023/a-look-at-screencapturekit-on-macos-sonoma/)
- [macOS Sequoia monthly screen recording permission prompt — 9to5Mac](https://9to5mac.com/2024/08/14/macos-sequoia-screen-recording-prompt-monthly/)
- [Sequoia Screen Recording Prompts and the Persistent Content Capture Entitlement — Michael Tsai](https://mjtsai.com/blog/2024/08/08/sequoia-screen-recording-prompts-and-the-persistent-content-capture-entitlement/)
- [Embed External Native Windows — Electron issue #10547](https://github.com/electron/electron/issues/10547)
- [electron-native-window — christophpurrer/GitHub](https://github.com/christophpurrer/electron-native-window)
- [Mac App Store Private API Rejection: CAContext/CALayerHost — Electron issue #20027](https://github.com/electron/electron/issues/20027)
- [Cross-process rendering using CALayer — TeamDev JxBrowser Blog](https://teamdev.com/jxbrowser/blog/cross-process-rendering-using-calayer/)
- [Cross-Process Rendering — Russ Bishop](http://www.russbishop.net/cross-process-rendering)
- [ExtensionKit introduction — chimehq](https://www.chimehq.com/blog/extensionkit-intro)
- [ExtensionKit remote views — chimehq](https://www.chimehq.com/blog/extensionkit-views)
- [A (Re-)Introduction to ExtensionKit — massicotte.org](https://www.massicotte.org/extensionkit-intro/)
- [ExtensionKit — Apple Developer Documentation](https://developer.apple.com/documentation/extensionkit)
- [ExtensionKit and XPC — Michael Tsai](https://mjtsai.com/blog/2023/07/18/extensionkit-and-xpc/)
- [EXHostViewController — Apple Developer Documentation](https://developer.apple.com/documentation/extensionkit/exhostviewcontroller)
- [Building a macOS remote control engine — Multi.app Blog](https://multi.app/blog/building-a-macos-remote-control-engine)
- [GitHub — tmandry/Swindler: macOS window management library for Swift](https://github.com/tmandry/Swindler)
- [GitHub — rxhanson/Rectangle: Move and resize windows](https://github.com/rxhanson/Rectangle)
- [GitHub — nikitabobko/AeroSpace: tiling window manager](https://github.com/nikitabobko/AeroSpace)
- [Yabai SIP/Scripting Addition wiki](https://github.com/koekeishiya/yabai/wiki/Disabling-System-Integrity-Protection)
- [CEF Forum — embedding cefsimple browser into another window on macOS](https://magpcss.org/ceforum/viewtopic.php?f=6&t=19593)
- [Hardened Runtime and Sandboxing — lapcatsoftware](https://lapcatsoftware.com/articles/hardened-runtime-sandboxing.html)
- [Configuring the macOS App Sandbox — Apple Developer Documentation](https://developer.apple.com/documentation/xcode/configuring-the-macos-app-sandbox)
- [Apple Events Entitlement — Apple Developer Documentation](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.security.automation.apple-events)
- [Accessibility Permission in macOS — jano.dev](https://jano.dev/apple/macos/swift/2025/01/08/Accessibility-Permission.html)

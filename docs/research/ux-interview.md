# origin — UX Interview

**Date:** 2026-02-23
**Purpose:** Clarify user experience goals and product direction before build

---

## Q1: Who is this for and what's the primary use case?

**Q:** Who is this for, and what's the primary use case you're imagining? Is this a personal tool, something for distribution, a paid product foundation? What would you use it for day-to-day?

**A:** It's a personal tool, might distribute later. It's my attempt at creating the perfect window management tool for macOS. I keep getting annoyed and losing focus from switching tabs and opening separate windows. By creating a single workspace with predictable patterns and a neat layout it will help me stay focused on my tasks and guide my workflow. By scaffolding a very simple skeleton with plugins for features we can focus on perfecting the window management experience and let other developers include their own functionality via plugins.

**Takeaway:** The shell _is_ the product. The focus/flow problem is the thesis. Plugins are content, not features.

---

## Q2: Visual aesthetic and feel

**Q:** Since this is about focus and reducing distraction, how do you want the shell to feel visually? Minimal/invisible, structured/editorial, or terminal-inspired? Dark mode only or light + dark?

**A:** Minimal/invisible, dark/light mode based on user system settings. Themes and styling settings to be added later.

**Takeaway:** Near-zero chrome. The app disappears. System `prefers-color-scheme`. No manual toggle or theme picker in v1.

---

## Q3: Dividers and panel focus ring

**Q:** Dividers — ghost/always-present/none? Focus ring — subtle/visible/none?

**A:** These should be tested before making a final decision, so start minimal and let's test later.

**Takeaway:** Default to the subtlest reasonable option. Divider: 1px low-contrast, hover to reveal. Focus ring: 1px subtle accent. Both are explicitly flagged for UX testing once the shell is running.

---

## Q4: The `@origin/hello` proof-of-concept plugin

**Q:** Should the hello plugin be literally hello world, or something slightly useful (clock, notepad, system info) that gives a better feel for the panel as a workspace?

**A:** Literally hello world but with extensive docs and research for building further after that.

**Takeaway:** The hello plugin is a canonical reference implementation for plugin authors — minimal component, but every API surface documented and explained. Prioritize clarity over functionality.

---

## Q5: What does "done" feel like for v1?

**Q:** What's the moment you'd switch from your current workflow to actually using origin day-to-day? Is it when splitting/shortcuts work, or do you need a specific plugin first?

**A:** As soon as panel splitting and keyboard shortcuts work reliably and I'm happy with the UX and styling.

**Takeaway:** v1 success = core shell feels right. Saved configs, plugin ecosystem, and advanced features are secondary.

---

## Q6: Window chrome

**Q:** Native macOS title bar, or frameless/hidden title bar (where the tab bar becomes the title bar)? Frameless is more integrated but more work.

**A:** Frameless / hidden title bar but with added traffic lights and tabs in the title bar next to the traffic lights.

**Takeaway:** Like Arc browser. `titleBarStyle: "overlay"` in Tauri — native traffic lights preserved, overlaid onto the left of the tab bar. Tabs run right alongside the traffic lights. Tab bar empty space is the drag region.

---

## Summary of Decisions

| Topic             | Decision                                                                |
| ----------------- | ----------------------------------------------------------------------- |
| Product type      | Personal tool first, possible distribution later                        |
| Core thesis       | Single tiling workspace eliminates context-switching / focus loss       |
| Aesthetic         | Minimal/invisible — shell disappears, content takes center stage        |
| Color mode        | System dark/light (`prefers-color-scheme`), no manual toggle in v1      |
| Themes/appearance | Deferred to later version                                               |
| Dividers          | Start: 1px low-contrast. Test and iterate.                              |
| Focus ring        | Start: 1px subtle accent. Test and iterate.                             |
| Hello plugin      | Literally hello world + extensive plugin API docs                       |
| v1 done when      | Panel splitting + keyboard shortcuts reliable + UX/styling feels right  |
| Window chrome     | Frameless, `titleBarStyle: "overlay"`, traffic lights + tabs in one bar |

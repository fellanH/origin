import type { PanelImperativeHandle } from "react-resizable-panels";

/**
 * Module-level map of nodeId → PanelImperativeHandle.
 *
 * CardTree registers and deregisters handles here via panelRef callbacks.
 * useKeyboardShortcuts reads handles to drive keyboard panel resize.
 * DOM refs are not serializable, so this intentionally lives outside Zustand.
 */
export const panelRefs = new Map<string, PanelImperativeHandle>();

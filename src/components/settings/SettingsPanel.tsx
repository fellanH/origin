import { useEffect, useRef } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import type { ThemePreference } from "@/store/workspaceStore";
import { ANIMATION_SPEED_OPTIONS } from "@/lib/motion";
import type { AnimationSpeed } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UpdateSettings from "@/components/settings/UpdateSettings";

// ─── Section ─────────────────────────────────────────────────────────────────

type SectionProps = {
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
};

function Section({ title, disabled = false, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3
        className={cn(
          "text-[11px] font-semibold uppercase tracking-widest",
          disabled ? "text-muted-foreground/40" : "text-muted-foreground",
        )}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

type RowProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

function Row({ label, description, children }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm leading-none">{label}</span>
        {description && (
          <span className="text-[11px] leading-snug text-muted-foreground">
            {description}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

type ToggleProps = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
};

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        checked ? "bg-foreground" : "bg-foreground/20",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-background shadow-sm transition-transform",
          checked ? "left-[calc(100%-18px)]" : "left-0.5",
        )}
      />
    </button>
  );
}

// ─── ThemeSelector ───────────────────────────────────────────────────────────

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

type ThemeSelectorProps = {
  value: ThemePreference;
  onChange: (v: ThemePreference) => void;
};

function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="flex overflow-hidden rounded-md border border-border">
      {THEME_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1 text-xs transition-colors",
            value === opt.value
              ? "bg-foreground text-background"
              : "bg-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── AnimationSpeedSelector ──────────────────────────────────────────────────

type AnimationSpeedSelectorProps = { value: AnimationSpeed; onChange: (v: AnimationSpeed) => void; disabled?: boolean };

function AnimationSpeedSelector({ value, onChange, disabled = false }: AnimationSpeedSelectorProps) {
  return (
    <div className={cn("flex overflow-hidden rounded-md border border-border", disabled && "opacity-50")}>
      {ANIMATION_SPEED_OPTIONS.map((opt) => (
        <button key={opt.value} disabled={disabled} onClick={() => onChange(opt.value)}
          className={cn("px-3 py-1 text-xs transition-colors", value === opt.value ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground", disabled && "pointer-events-none")}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── SettingsPanel ────────────────────────────────────────────────────────────

type SettingsPanelProps = {
  open: boolean;
  onClose: () => void;
};

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const splitAutoLaunch = useWorkspaceStore((s) => s.splitAutoLaunch);
  const setSplitAutoLaunch = useWorkspaceStore((s) => s.setSplitAutoLaunch);
  const themePreference = useWorkspaceStore((s) => s.themePreference);
  const setThemePreference = useWorkspaceStore((s) => s.setThemePreference);
  const animationSpeed = useWorkspaceStore((s) => s.animationSpeed);
  const setAnimationSpeed = useWorkspaceStore((s) => s.setAnimationSpeed);
  const prefersReducedMotion = useReducedMotion();

  // Close on Escape
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Transparent backdrop — click-away dismissal */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Slide-over panel — overlays from the right, does not shift content */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen w-[320px] flex-col border-l border-border bg-background shadow-xl",
          "transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header — matches TabBar height */}
        <div className="flex h-[38px] shrink-0 items-center justify-between border-b border-border px-4">
          <span className="text-sm font-semibold">Settings</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close settings"
            className="opacity-60 hover:opacity-100"
          >
            ×
          </Button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-5">
          {/* Appearance */}
          <Section title="Appearance">
            <Row label="Theme" description="Controls the colour scheme">
              <ThemeSelector value={themePreference} onChange={setThemePreference} />
            </Row>
            <Row label="Animation speed" description={prefersReducedMotion ? "Disabled \u2014 OS reduced motion is active" : "Controls transition timing across the UI"}>
              <AnimationSpeedSelector value={prefersReducedMotion ? "off" : animationSpeed} onChange={setAnimationSpeed} disabled={prefersReducedMotion} />
            </Row>
          </Section>

          <div className="border-t border-border" />

          {/* Behaviour */}
          <Section title="Behaviour">
            <Row
              label="Auto-open launcher on split"
              description="Opens the plugin picker in each new panel"
            >
              <Toggle
                checked={splitAutoLaunch}
                onChange={setSplitAutoLaunch}
                label="Auto-open launcher on split"
              />
            </Row>
          </Section>

          <div className="border-t border-border" />

          {/* Updates */}
          <Section title="Updates">
            <UpdateSettings />
          </Section>

          <div className="border-t border-border" />

          {/* Sync — placeholder */}
          <Section title="Sync (coming soon)" disabled>
            <p className="text-xs text-muted-foreground/50">
              Sync settings will be available in a future release.
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}

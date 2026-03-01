export type AnimationSpeed = "snappy" | "standard" | "off";
export const ANIMATION_SPEED_OPTIONS: { value: AnimationSpeed; label: string }[] = [
  { value: "snappy", label: "Snappy" },
  { value: "standard", label: "Standard" },
  { value: "off", label: "Off" },
];
type DurationTokens = { instant: number; fast: number; normal: number; slow: number };
const DURATIONS_STANDARD: DurationTokens = { instant: 80, fast: 130, normal: 200, slow: 280 };
const DURATIONS_SNAPPY: DurationTokens = { instant: 40, fast: 70, normal: 110, slow: 150 };
const DURATIONS_OFF: DurationTokens = { instant: 0, fast: 0, normal: 0, slow: 0 };
type EasingTokens = { default: string; out: string; in: string; spring: string };
const EASINGS: EasingTokens = {
  default: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  out: "cubic-bezier(0.0, 0.0, 0.2, 1)",
  in: "cubic-bezier(0.4, 0.0, 1, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};
export type MotionTokens = { duration: DurationTokens; easing: EasingTokens; isDisabled: boolean; isReduced: boolean };
export function getMotionTokens(speed: AnimationSpeed, prefersReducedMotion: boolean): MotionTokens {
  const effectiveSpeed = prefersReducedMotion ? "off" : speed;
  const duration = effectiveSpeed === "snappy" ? DURATIONS_SNAPPY : effectiveSpeed === "off" ? DURATIONS_OFF : DURATIONS_STANDARD;
  return { duration, easing: EASINGS, isDisabled: effectiveSpeed === "off", isReduced: prefersReducedMotion || effectiveSpeed === "off" };
}
export function getMotionCSSProperties(tokens: MotionTokens): Record<string, string> {
  return {
    "--motion-duration-instant": tokens.duration.instant + "ms",
    "--motion-duration-fast": tokens.duration.fast + "ms",
    "--motion-duration-normal": tokens.duration.normal + "ms",
    "--motion-duration-slow": tokens.duration.slow + "ms",
    "--motion-easing-default": tokens.easing.default,
    "--motion-easing-out": tokens.easing.out,
    "--motion-easing-in": tokens.easing.in,
    "--motion-easing-spring": tokens.easing.spring,
  };
}
export function buildTransition(tokens: MotionTokens, properties: string | string[], speed: keyof DurationTokens = "normal", easing: keyof EasingTokens = "default"): string {
  const props = Array.isArray(properties) ? properties : [properties];
  const dur = tokens.duration[speed];
  const ease = tokens.easing[easing];
  return props.map((p) => p + " " + dur + "ms " + ease).join(", ");
}

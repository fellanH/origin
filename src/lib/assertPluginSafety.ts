/**
 * Plugin runtime safety assertions.
 *
 * Enforces the deny-list rules codified in docs/security/webview-guardrails.md.
 * Called at IframePluginHost mount time to fail closed on unsafe configurations.
 *
 * @module assertPluginSafety
 */

/** Sandbox tokens that must NEVER appear on an L1 plugin iframe. */
const DENIED_SANDBOX_TOKENS: ReadonlySet<string> = new Set([
  "allow-same-origin", // D1: grants host origin — trivial IPC escalation
  "allow-top-navigation", // D2: lets plugin navigate the host window
  "allow-top-navigation-by-user-activation", // D2 variant
  "allow-popups-to-escape-sandbox", // D3: opened windows inherit no sandbox
  "allow-modals", // D4: alert/confirm/prompt block main thread
]);

/** The only sandbox tokens permitted on L1 plugin iframes. */
const ALLOWED_SANDBOX_TOKENS: ReadonlySet<string> = new Set([
  "allow-scripts", // A1: plugins need JS execution
]);

/**
 * Validate that a sandbox attribute value conforms to the guardrails.
 *
 * Returns `{ valid: true }` or `{ valid: false, reason: string }`.
 *
 * This is a pure function — safe to call in tests without DOM side effects.
 */
export function validateSandboxValue(sandbox: string | null): {
  valid: boolean;
  reason?: string;
} {
  if (sandbox === null || sandbox === undefined) {
    return {
      valid: false,
      reason: "iframe sandbox attribute is missing — all L1 plugin iframes must be sandboxed",
    };
  }

  // Parse tokens (sandbox attribute is space-separated)
  const tokens = sandbox
    .split(/\s+/)
    .filter((t) => t.length > 0);

  if (tokens.length === 0) {
    // Empty sandbox="" is maximally restrictive (no scripts) — plugins need allow-scripts
    return {
      valid: false,
      reason:
        "iframe sandbox is empty — L1 plugins require 'allow-scripts' to function",
    };
  }

  // Check for denied tokens
  for (const token of tokens) {
    if (DENIED_SANDBOX_TOKENS.has(token)) {
      return {
        valid: false,
        reason: `iframe sandbox contains denied token '${token}' — see docs/security/webview-guardrails.md`,
      };
    }
  }

  // Check that only allowed tokens are present
  for (const token of tokens) {
    if (!ALLOWED_SANDBOX_TOKENS.has(token)) {
      return {
        valid: false,
        reason: `iframe sandbox contains unexpected token '${token}' — only [${[...ALLOWED_SANDBOX_TOKENS].join(", ")}] are permitted`,
      };
    }
  }

  // Must include allow-scripts
  if (!tokens.includes("allow-scripts")) {
    return {
      valid: false,
      reason:
        "iframe sandbox is missing 'allow-scripts' — L1 plugins cannot execute without it",
    };
  }

  return { valid: true };
}

/**
 * Validate that an iframe src points only to the local plugin:// scheme.
 *
 * Returns `{ valid: true }` or `{ valid: false, reason: string }`.
 */
export function validateIframeSrc(src: string | null): {
  valid: boolean;
  reason?: string;
} {
  if (!src) {
    return { valid: false, reason: "iframe src is empty or missing" };
  }

  if (!src.startsWith("plugin://localhost/")) {
    return {
      valid: false,
      reason: `iframe src '${src}' does not use the plugin://localhost/ scheme — remote content is not allowed (D7)`,
    };
  }

  return { valid: true };
}

/**
 * Assert that an iframe element is safely configured for L1 plugin hosting.
 *
 * Call this at mount time in IframePluginHost. In development and test
 * environments, violations throw an Error (fail closed). In production,
 * violations log an error and return false — the caller should prevent
 * the iframe from loading.
 *
 * @returns `true` if the iframe passes all checks, `false` otherwise.
 */
export function assertIframeSafety(iframe: HTMLIFrameElement): boolean {
  const sandboxResult = validateSandboxValue(iframe.getAttribute("sandbox"));
  const srcResult = validateIframeSrc(iframe.getAttribute("src"));

  const failures: string[] = [];
  if (!sandboxResult.valid && sandboxResult.reason) {
    failures.push(sandboxResult.reason);
  }
  if (!srcResult.valid && srcResult.reason) {
    failures.push(srcResult.reason);
  }

  if (failures.length === 0) {
    return true;
  }

  const message = `[origin] Plugin iframe safety violation:\n${failures.map((f) => `  • ${f}`).join("\n")}`;

  if (import.meta.env.DEV || import.meta.env.MODE === "test") {
    throw new Error(message);
  }

  // Production: log and signal failure — caller must prevent loading
  console.error(message);
  return false;
}

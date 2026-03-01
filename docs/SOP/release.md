# Release SOP — origin

## Versioning

SemVer (`MAJOR.MINOR.PATCH`). Version lives in **two places** — both must be bumped together:

| File                   | Field       |
| ---------------------- | ----------- |
| `package.json`         | `"version"` |
| `src-tauri/Cargo.toml` | `version`   |

Never bump one without the other.

## Tag Format

`v0.1.0` — tags on `main` only, after the squash merge that closes the milestone.

## Pre-Release Checklist

- [ ] All issues in the milestone are closed
- [ ] `package.json` and `src-tauri/Cargo.toml` both bumped to new version
- [ ] `CHANGELOG.md` updated with release notes
- [ ] Secret scan passes on source: `gitleaks detect --source . --config .gitleaks.toml --verbose`
- [ ] Secret scan passes on built artifacts: `gitleaks detect --source dist/ --no-git --config .gitleaks.toml --verbose`
- [ ] `npm run tauri build` passes locally (no errors)
- [ ] App opens, traffic lights visible, no console errors on launch
- [ ] PoC checklist (or equivalent milestone checklist) fully checked

## Build Command

```bash
npm run tauri build
# Output: src-tauri/target/release/bundle/
```

Artifact locations:

- macOS `.dmg`: `src-tauri/target/release/bundle/dmg/`
- macOS `.app`: `src-tauri/target/release/bundle/macos/`

## macOS Distribution (v1 — manual, personal use only)

Code signing requires an Apple Developer account. Required env vars when that time comes (add to `.env.example`):

- `APPLE_CERTIFICATE`
- `APPLE_CERTIFICATE_PASSWORD`
- `APPLE_ID`
- `APPLE_ID_PASSWORD`
- `APPLE_TEAM_ID`

For personal use only (pre-public release): clear quarantine instead of notarizing:

```bash
xattr -cr origin.app
```

Do not distribute unsigned builds publicly.

## GitHub Release

```bash
# 1. Tag the commit
git tag v0.1.0 && git push origin v0.1.0

# 2. Create GitHub release with DMG attached
gh release create v0.1.0 \
  --title "v0.1.0" \
  --notes "$(cat CHANGELOG.md)" \
  src-tauri/target/release/bundle/dmg/*.dmg
```

## Secret Scanning

### Overview

All CI pipelines and the release workflow run [gitleaks](https://github.com/gitleaks/gitleaks) to detect secrets in both source code and built artifacts. Builds **fail by default** on high-confidence leaks.

| Pipeline         | What is scanned                                  | Mode                    | Blocks on failure |
| ---------------- | ------------------------------------------------ | ----------------------- | ----------------- |
| CI (PR/push)     | Full repository history                          | `detect`                | Yes               |
| Release          | Repository history + `dist/` + `.app` bundle     | `detect` / `--no-git`   | Yes               |
| Publish API      | Repository history + `plugins/api/dist`           | `detect` / `--no-git`   | Yes               |

Configuration lives in `.gitleaks.toml` at the repo root.

### Running locally

```bash
# Install gitleaks (macOS)
brew install gitleaks

# Scan source (full git history)
gitleaks detect --source . --config .gitleaks.toml --verbose

# Scan built artifacts (no git history — just files on disk)
npm run build
gitleaks detect --source dist/ --no-git --config .gitleaks.toml --verbose

# Scan Tauri bundle after building
npm run tauri build
gitleaks detect --source src-tauri/target/release/bundle/macos/*.app --no-git --config .gitleaks.toml --verbose
```

### Configuration files

| File              | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `.gitleaks.toml`  | Rules, path exclusions, regex allowlist                    |
| `.gitleaksignore` | Fingerprint-based suppressions for individual findings     |

### If a secret is detected

**Immediate steps (within 1 hour):**

1. **Do NOT merge or release.** The pipeline blocks automatically.
2. **Identify the secret type** from the gitleaks output (API key, token, certificate password, etc.).
3. **Rotate the secret immediately** at the source provider (see table below).
4. **Update GitHub Secrets** (Settings → Secrets and variables → Actions) with the new value.
5. **Scrub git history** if the secret was committed:
   ```bash
   git filter-repo --path-glob '**/*secret*' --invert-paths
   git push --force-with-lease
   ```
6. **Re-run CI** to confirm the secret no longer appears.
7. **Document the incident** — add a dated note to `CHANGELOG.md` under a `### Security` heading.

#### Credential-specific rotation

| Credential                    | Where to rotate                                                |
| ----------------------------- | -------------------------------------------------------------- |
| `GITHUB_TOKEN` / PATs         | GitHub → Settings → Developer settings → Tokens               |
| `NPM_TOKEN`                   | npmjs.com → Access Tokens → Delete + create new               |
| `APPLE_CERTIFICATE`           | Re-export from Keychain; update GitHub secret                  |
| `APPLE_PASSWORD`              | appleid.apple.com → Security → App-Specific Passwords → Revoke |
| `TAURI_SIGNING_PRIVATE_KEY`   | `npx tauri signer generate` → update GitHub secret + pubkey in `tauri.conf.json` |
| Provider API keys             | Rotate at provider dashboard; update `.env` / secrets          |

### Allowlist / override process

The `.gitleaks.toml` allowlist permits known false positives. **Every allowlist entry requires justification.**

**To add an allowlist entry:**

1. Confirm the match is a **false positive** — not a real secret, not a value that could be exploited.
2. Add the entry to `.gitleaks.toml` with a comment explaining:
   - Why it is safe
   - Who approved it and when
3. Open a PR with the allowlist change clearly noted in the description.
4. A maintainer must explicitly approve the PR before merge.

**For individual findings:** run `gitleaks detect --report-format json --report-path report.json` to get the finding fingerprint, then add it to `.gitleaksignore` with a justification comment.

**Never allowlist:**
- Real API keys, tokens, or passwords (rotate them instead)
- Values that work against any live service
- Entire file paths containing mixed real and test credentials

## CHANGELOG Format

Keep `CHANGELOG.md` at the repo root. Update before tagging.

```markdown
## [0.1.0] - 2026-MM-DD

### Added

- Feature description

### Fixed

- Bug description

### Changed

- Breaking change description
```

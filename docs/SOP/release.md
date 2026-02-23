# Release SOP — note

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
xattr -cr note.app
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

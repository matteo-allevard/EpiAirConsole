## Description

<!-- What does this PR do, and why? -->

## Type of Change

- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `refactor` — code restructuring (no behavior change)
- [ ] `test` — tests only
- [ ] `docs` — documentation only
- [ ] `ci` — CI/CD pipeline or automation
- [ ] `build` — dependencies, build tools, Docker
- [ ] `chore` — maintenance (tooling, configs, `.gitignore`)
- [ ] `perf` — performance optimization
- [ ] `style` — formatting only (no code change)

## Linked Issue

Closes #<!-- issue number -->

## Changes

<!-- Key changes introduced by this PR. -->

-
-

## Impact

- [ ] No behavior change (pure refactor / internal change)
- [ ] Behavior change (describe below)
- [ ] Real-time protocol or SDK API change (describe below; update `packages/protocol` and the game developer guide)
- [ ] Requires migration steps (describe below)
- [ ] Requires config/infra changes, e.g. a new environment variable (describe below; update `.env.example`)

<!-- If anything above is checked besides "no behavior change", explain: -->

## How to Test

<!-- Steps to verify the change locally, including edge cases or how to reproduce a bug before/after. -->

1.
2.

**Tested on a real phone** (required for anything touching the controller): <!-- e.g. iPhone 13 / Safari, Pixel 7 / Chrome -->

## Screenshots / Demo

<!-- If UI-facing (console or controller), add before/after screenshots or a short screen recording. -->

## Checklist (Definition of Done)

**Quality**
- [ ] Unit and/or integration tests added or updated
- [ ] Required code coverage threshold met
- [ ] Local tests and linters pass successfully (`npm test`, `npm run lint`)
- [ ] CI pipeline and Quality Gate check pass
- [ ] Build artifact / Docker image builds successfully (if applicable)
- [ ] No dead code, commented-out code, or debug logs left in the diff
- [ ] Branch is up to date with `main`

**Accessibility** (if UI-facing)
- [ ] Works with the keyboard only, with a visible focus
- [ ] Contrast ≥ 4.5:1, labels for screen readers, information never carried by colour alone
- [ ] Controller: touch targets ≥ 44 × 44 px, touch alternative for every sensor control

**Project rules**
- [ ] Documentation updated (README, `docs/`, ADR — if applicable)
- [ ] `CHANGELOG.md` updated under *Unreleased*
- [ ] Any use of AI declared in the README
- [ ] Any new external asset credited in `docs/CREDITS.md`
- [ ] No secret in the code or the history

## Additional Notes

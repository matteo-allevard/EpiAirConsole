# Contributing to Byoc

Thanks for helping. This guide explains how we work, from picking an issue to getting a pull request merged. If something here is unclear or out of date, open an issue: fixing this guide is a contribution too.

By taking part, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Table of contents

- [How we work](#how-we-work)
- [Set up your environment](#set-up-your-environment)
- [Contribution workflow](#contribution-workflow)
- [Branches](#branches)
- [Commits](#commits)
- [Pull requests](#pull-requests)
- [Definition of Done](#definition-of-done)
- [Code style](#code-style)
- [Tests](#tests)
- [Accessibility](#accessibility)
- [Documentation and decisions](#documentation-and-decisions)
- [Assets and licences](#assets-and-licences)
- [Use of AI](#use-of-ai)
- [Security and secrets](#security-and-secrets)
- [Releases](#releases)
- [Reporting bugs and requesting features](#reporting-bugs-and-requesting-features)

## How we work

We follow Scrum in two-week sprints. The whole backlog is in our [GitHub Project](https://github.com/matteo-allevard/EpiAirConsole/projects).

- **Every change starts from an issue.** No issue, no pull request.
- **Every issue has one owner**, a type label, a domain label and a status.
- **Nothing reaches `main` without a review** and a green CI pipeline.

| Role | Person | Contact them for |
| --- | --- | --- |
| Product Owner | Clément | Scope, priorities, acceptance of a finished story |
| Scrum Master | Mattéo | Board, sprints, anything blocking you |

## Set up your environment

Follow [Getting started](README.md#getting-started) in the README. You should have the console running, a room joined with the controller simulator and the tests passing **in less than 15 minutes**. If it takes longer, tell us: it is a bug in our documentation.

Then install the Git hooks once:

```bash
npm install   # also installs the pre-commit and commit-msg hooks
```

The hooks format your staged files and check your commit messages before each commit.

## Contribution workflow

1. **Pick an issue** in the *Ready* column of the board, or ask the Scrum Master for one. New here? Start with a [`good first issue`](https://github.com/matteo-allevard/EpiAirConsole/labels/good%20first%20issue).
2. **Assign it to yourself** and move it to *In progress*.
3. **Create a branch** from an up-to-date `main` (see [Branches](#branches)).
4. **Make your change** in small commits (see [Commits](#commits)), with tests and documentation.
5. **Open a pull request** linked to the issue and move the issue to *In review*.
6. **Address review comments** until you get an approval and a green pipeline.
7. **Merge** (squash and merge). The issue closes automatically and moves to *Done*.

## Branches

We use short-lived branches off `main` (trunk-based development).

- `main` is protected: no direct pushes, merge only through a reviewed pull request with a green pipeline.
- `main` must always be deployable: every merge is deployed online automatically.
- Branch name: `<type>/<issue-number>-<short-description>`, in lowercase with hyphens.

| Type | Use for | Example |
| --- | --- | --- |
| `feat` | A new feature | `feat/42-room-qr-code` |
| `fix` | A bug fix | `fix/57-controller-reconnect` |
| `docs` | Documentation only | `docs/63-sdk-tutorial` |
| `test` | Tests only | `test/71-room-lifecycle` |
| `refactor` | Code change with no behaviour change | `refactor/80-protocol-types` |
| `chore` | Tooling, dependencies, CI | `chore/12-setup-ci` |

Keep a branch alive for a few days at most. Rebase on `main` often to avoid painful conflicts:

```bash
git fetch origin
git rebase origin/main
```

## Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/). The `commit-msg` hook rejects messages that do not match.

```
<type>(<scope>): <short summary in the imperative, lowercase, no final period>

[optional body: what and why, not how]

[optional footer: Refs #42, BREAKING CHANGE: …]
```

- **Types:** `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `style`, `build`, `ci`, `chore`
- **Scope** (optional): the backlog ID of the story, e.g. `E3-01`, or a domain label: `server`, `console`, `controller`, `sdk`, `protocol`, `game-action`, `game-party`, `game-turn`, `accounts`, `docs`, `ci`

Examples:

```
feat(E3-01): create rooms with short code and QR display
feat(server): close idle rooms after a configurable timeout
fix(controller): restore player slot after the phone wakes up
docs(sdk): add private message example to the reference
test(server): cover host handover when the host disconnects
```

One commit = one logical change. Commits are written in English.

## Pull requests

Open your pull request early as a **draft** if you want feedback before it is finished.

**Title:** follows the commit convention, because it becomes the commit message after squash. Example: `feat(console): show waiting room with player avatars`.

**Description:** fill in the [pull request template](.github/pull_request_template.md). It must include:

- `Closes #<issue-number>` so the issue closes on merge
- What changed and why, in a few lines
- How to test it, step by step
- Screenshots or a short video for any visual change
- The Definition of Done checklist, ticked

**Review rules:**

- At least **one approval** from another team member
- All CI checks green: lint, tests, end-to-end tests, build
- All review conversations resolved
- Keep pull requests small: aim for under 400 changed lines. A large one is harder to review and more likely to hide a bug.

**As a reviewer:** check that the change meets the acceptance criteria of the issue, read the tests, run it locally when it touches the controller or the UI, and be kind and specific in your comments.

## Definition of Done

A story is done only when **every** item below is true. The same checklist is in the pull request template.

- [ ] All acceptance criteria of the issue are met, and the Product Owner has accepted the story
- [ ] The code is in a pull request linked to the issue, reviewed by another member and merged into `main`
- [ ] The CI pipeline is green: lint, tests, build
- [ ] New logic is covered by tests
- [ ] For any interface: keyboard navigation, contrast, labels and touch targets of at least 44 × 44 px are checked
- [ ] For anything touching the controller: tested on a real phone
- [ ] Documentation is updated (README, `docs/`, an ADR for any architecture decision)
- [ ] Any use of AI is declared in the README
- [ ] No secret, dead code or orphan file added
- [ ] Deployed automatically and checked online

## Code style

Formatting and linting are automatic: ESLint and Prettier run on staged files before each commit and again in CI. Do not argue with the formatter; change its configuration in a dedicated pull request if needed.

- TypeScript in strict mode everywhere. Avoid `any`; if you really need it, add a comment explaining why.
- Code, comments, identifiers and logs are in English.
- Prefer small, named functions over long ones and clear names over comments.
- Never import a platform internal from a game: **games use the public SDK only**.
- Error messages and development logs must be understandable without reading the code.
- Remove dead code instead of commenting it out: Git keeps the history.

## Tests

Every change to logic comes with tests. At a minimum, the test suite covers:

- the room lifecycle: creation, join, disconnect, reconnect, host handover
- the SDK
- the rules of each game
- server-side validation of player actions
- text filtering of nicknames and player input

| Command | Runs |
| --- | --- |
| `npm test` | All unit and integration tests |
| `npm test -w <workspace>` | Tests of one workspace, e.g. `npm test -w apps/server` |
| `npm test -- <file-or-pattern>` | A single test file |
| `npm run test:e2e` | End-to-end tests (one console + several emulated phones) |
| `npm run test:load` | Load tests with simulated players |

A bug fix starts with a test that reproduces the bug.

## Accessibility

Accessibility is part of every story, not a final phase. Our target is **WCAG 2.2 level AA** for the console, the controller, the catalog and the profiles, and the [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/) for games.

Before you open a pull request that touches an interface, check that:

- everything works with the keyboard only, with a visible focus
- the HTML is semantic (real buttons, headings, labels)
- text contrast is at least 4.5:1
- information is never carried by colour alone
- on the controller, touch targets are at least 44 × 44 px and every sensor control has a touch alternative
- the screen still works with VoiceOver (iOS) or TalkBack (Android) and with a larger text size

## Documentation and decisions

Documentation is part of the product and is written as we go, in the same pull request as the code it describes.

| Folder | Content |
| --- | --- |
| `docs/user/` | For hosts and players |
| `docs/game-dev/` | For developers building a game with the SDK |
| `docs/technical/` | For contributors: architecture, protocol, deployment |
| `docs/adr/` | Architecture Decision Records |

**Write an ADR** for any decision that is hard to reverse or that others will ask about (a library, a protocol choice, a hosting provider). Copy [`docs/adr/template.md`](docs/adr/template.md) to `docs/adr/NNNN-short-title.md` and fill in the context, the options considered, the decision and its consequences. An ADR is never edited after it is accepted; a new ADR replaces it.

## Assets and licences

- Graphics, sounds and music must be **original or under a free licence** that allows our use.
- Credit every external asset in [`docs/CREDITS.md`](docs/CREDITS.md): name, author, licence, source link.
- **No clones**: no existing game, character, name or protected universe, and nothing that copies the name, logo or interface of an existing console product.
- New dependencies must have a licence compatible with MIT. Mention any new dependency in your pull request description.

## Use of AI

AI tools are allowed under these rules:

- **Transparency:** declare the tool and what you used it for in the [Use of AI](README.md#use-of-ai) table of the README, in the same pull request.
- **Responsibility:** you must understand and be able to explain every line you submit, including generated code.
- **Same standards:** generated code goes through the same tests, review, cleanliness and security rules.
- **Licences:** generated or collected assets and text follow the licence rules above. Never ask a tool to imitate an existing game, character or brand.

## Security and secrets

- Never commit a secret: API keys, passwords, tokens. Local secrets go in `.env`, which is ignored by Git. Document every variable in `.env.example` with a fake value.
- CI and deployment secrets live in GitHub Secrets only.
- The server is authoritative: never trust data sent by a client without validating it on the server.
- Found a security issue? Do not open a public issue: contact a team member directly.

## Releases

- We use [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.
- Planned versions: `v0.1.0` (foundation), `v0.5.0` (December follow-up), `v1.0.0` (final release).
- Before tagging, update [`CHANGELOG.md`](CHANGELOG.md) following [Keep a Changelog](https://keepachangelog.com/).
- Tags are created on `main` only, by the Scrum Master or the Product Owner.

## Reporting bugs and requesting features

Use the [issue templates](https://github.com/matteo-allevard/EpiAirConsole/issues/new/choose):

- **Bug report:** what you did, what you expected, what happened, device and browser (for example *iPhone 13, Safari, iOS 18*), screenshots or logs.
- **Feature request:** written as a user story: *As a …, I want …, so that …*, with acceptance criteria.

The Product Owner reviews new issues and decides their priority.

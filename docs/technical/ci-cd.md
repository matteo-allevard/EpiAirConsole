# CI/CD pipeline

Every pull request (whatever its base branch) and every push to `main` runs the GitHub Actions workflow [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml). A pull request cannot be merged until all its checks are green.

## Checks

| Job | What it runs | Fails when |
| --- | --- | --- |
| **Lint and typecheck** | `npm run lint`, `npm run format:check`, `npm run typecheck` | ESLint finds an error (including accessibility rules from `jsx-a11y`), a file is not formatted with Prettier, or TypeScript reports a type error |
| **Tests and coverage** | `npm run test:coverage`, script tests | A test fails, or coverage drops under the thresholds in `apps/server/vitest.config.ts` (70%) |
| **Build** | `npm run build` | Any workspace fails to build |
| **Dependencies audit** | `npm audit --omit=dev --audit-level=high` | A production dependency has a known high or critical vulnerability |
| **Docker image** | Builds `Dockerfile.dev` without pushing it | The one-command Docker setup no longer builds |
| **PR title** | `commitlint` on the pull request title | The title does not follow [Conventional Commits](https://www.conventionalcommits.org/). The title becomes the commit message after "Squash and merge" |

The coverage report is attached to each run as a downloadable artifact named `coverage`.

## Local checks before each commit

[Husky](https://typicode.github.io/husky/) installs two Git hooks when you run `npm install`:

| Hook | What it does |
| --- | --- |
| `pre-commit` | Runs ESLint (with auto-fix) and Prettier on the staged files only ([lint-staged](https://github.com/lint-staged/lint-staged)) |
| `commit-msg` | Rejects a commit message that does not follow Conventional Commits ([commitlint](https://commitlint.js.org/)) |

To run the same checks as the CI on your machine:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:coverage
npm run build
```

`npm run lint:fix` and `npm run format` fix most problems automatically.

## Branch protection

`main` is protected in the repository settings: pull request required, one approval, and the six checks above required to pass.

## Deployment

*To be written with E1-06: every merge on `main` deploys the console, the controller and the real-time server.*

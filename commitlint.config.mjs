// Commit messages must follow Conventional Commits: https://www.conventionalcommits.org
// Checked locally by the commit-msg hook, and on the pull request title in CI
// (the title becomes the commit message after "Squash and merge").
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Our scopes are backlog IDs such as "E3-01" (or a domain such as "server"): allow upper case.
    "scope-case": [0],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "test",
        "refactor",
        "perf",
        "style",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
  },
};

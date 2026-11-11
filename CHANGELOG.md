# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--
  How to update this file:
  - Add your change under "Unreleased" in the same pull request as the change itself.
  - Use one of these sections: Added, Changed, Deprecated, Removed, Fixed, Security.
  - Write for a user or a contributor, not for yourself: what changed, not how.
  - When tagging a release, rename "Unreleased" to the version and date, then add a new empty "Unreleased".
-->

## [Unreleased]

### Added

- One-command start: `npm run dev` (or `docker compose up`) runs the server, the console and the controller together
- Pre-start check that stops with an explicit message when Node.js is too old, dependencies are missing or a port is taken, and creates `.env` from `.env.example` on first run
- `npm run dev:host` to reach the console and the controller from a phone on the local network
- Placeholder controller page that shows the room code from the QR code link
- README, CONTRIBUTING, LICENSE (MIT) and CODE_OF_CONDUCT
- Issue templates (user story, bug report) and pull request template
- `.env.example`, `.gitignore` and `.nvmrc`
- Documentation structure in `docs/`, with the first Architecture Decision Records:
  - ADR 0001: TypeScript monorepo stack
  - ADR 0002: games isolated in sandboxed iframes
  - ADR 0003: English for code and documentation

[Unreleased]: https://github.com/matteo-allevard/EpiAirConsole/commits/main

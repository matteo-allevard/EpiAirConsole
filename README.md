<!--
  TODO:
  - [ ] Replace <DEPLOY_URL> placeholder
  - [ ] Add the CI status badge once the GitHub Actions workflow exists
  - [ ] Add screenshots of the console and the controller
  - [ ] Check that every command below actually works on a fresh clone
-->

# Byoc

[![CI](https://github.com/matteo-allevard/EpiAirConsole/actions/workflows/ci.yml/badge.svg)](https://github.com/matteo-allevard/EpiAirConsole/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**A game console that runs in your browser. Your phone is the controller.**

Open the console on a computer, scan the QR code with your phone, and play. Nothing to install : one screen and a few phones are enough. Up to 8 players per room.

Byoc is first of all a **platform**. Any developer can build a game for it with our **SDK**, without touching the platform code. The three games we ship are there to show what the platform can do.

> **Project status: early development (Sprint 1).** Most features listed below are planned, not built yet. The [roadmap](#roadmap) shows what is done.

**Try it online:** <DEPLOY_URL> *(available once continuous deployment is set up)*

<!-- TODO: screenshots
![Console waiting room](docs/assets/screenshot-console.png)
![Phone controller](docs/assets/screenshot-controller.png)
-->

---

## Table of contents

- [Features](#features)
- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Play with a real phone on your local network](#play-with-a-real-phone-on-your-local-network)
- [Running tests](#running-tests)
- [Project structure](#project-structure)
- [Documentation](#documentation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Use of AI](#use-of-ai)
- [Team](#team)
- [License](#license)

---

## Features

**Console (main screen)**
- Create a room shown with a short code and a QR code
- Waiting room with each player's avatar and nickname; the host picks the game
- Game catalog: description, number of players, duration, accessibility features
- End screen with ranking and scores; play again or switch games without reconnecting

**Phone controller**
- Opens in the phone's browser, no install (Safari on iOS, Chrome on Android)
- Shows the controller each game asks for: buttons, D-pad, virtual joystick, free touch area, text input, multiple choice, finger drawing
- Gyroscope, accelerometer and vibration, with a touch alternative for every sensor control
- Reconnects automatically after sleep, backgrounding or network loss

**Real-time platform**
- Up to 8 players per room, many rooms in parallel on the same server
- Target latency under 100 ms from button press to on-screen reaction on a local network
- Host handover when the host leaves; idle rooms close automatically
- The server is authoritative: it validates every player action

**Game SDK**
- Screen-side and controller-side SDK: players, inputs, controller layouts, private messages, vibration, game lifecycle, scores, achievements, accessibility settings
- Each game is a package with a manifest; adding a game needs no change to the platform
- Games run isolated: a game that crashes is stopped and players go back to the lobby without losing the room
- Developer mode: controller simulator in the browser, message log, live latency

**Players and accessibility**
- Play as a guest, no account needed; optional account for history, stats, rankings and achievements
- Targets WCAG 2.2 level AA for every interface
- Built-in options for all games: colour-blind modes, text size, slow mode, subtitles for key sounds, no flashing effects, no vibration
- At least one game fully playable without sight

## How it works

```
 ┌──────────────┐        WebSocket        ┌──────────────────┐        WebSocket        ┌──────────────┐
 │   Console    │ ◄─────────────────────► │ Real-time server │ ◄─────────────────────► │  Controller  │
 │ (TV / laptop)│                         │  rooms, players, │                         │   (phone)    │
 │              │                         │ action validation│                         │  x 1 to 8    │
 │ ┌──────────┐ │                         └──────────────────┘                         └──────────────┘
 │ │  Game    │ │  postMessage (Screen SDK)
 │ │ (iframe) │ │
 │ └──────────┘ │
 └──────────────┘
```

1. The console asks the server to create a room and shows its code and QR code.
2. Each phone opens the controller page, joins the room and gets a player slot.
3. When the host starts a game, the console loads it in a sandboxed iframe. The game uses the **Screen SDK** to read players and inputs, and to tell every phone which controller to display.
4. Phones send inputs to the server, which validates them and forwards them to the console.

The full architecture is in [`docs/technical/architecture.md`](docs/technical/architecture.md).

## Tech stack

| Part | Technology |
| --- | --- |
| Language | TypeScript everywhere |
| Monorepo | npm workspaces |
| Real-time server | Node.js + Socket.IO |
| Console and controller | React + Vite |
| Games | *To be decided (see the ADRs)* |
| Database (accounts) | PostgreSQL |
| Unit and integration tests | Vitest |
| End-to-end tests | Playwright |
| CI/CD | GitHub Actions |
| Hosting | *To be decided* |

Each choice is explained in an Architecture Decision Record in [`docs/adr/`](docs/adr/).

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) LTS (version pinned in [`.nvmrc`](.nvmrc))
- npm (comes with Node.js)
- [Docker](https://www.docker.com/) and Docker Compose (optional, for the one-command setup and the database)
- Git

### Option A: one command with Docker

```bash
git clone https://github.com/matteo-allevard/EpiAirConsole.git
cd EpiAirConsole
cp .env.example .env
docker compose up
```

### Option B: run locally with npm

```bash
git clone https://github.com/matteo-allevard/EpiAirConsole.git
cd EpiAirConsole
cp .env.example .env
npm install
npm run dev
```

`npm run dev` starts the server, the console and the controller together.

| Service | Default URL |
| --- | --- |
| Console | http://localhost:5173 |
| Controller | http://localhost:5174 |
| Real-time server | http://localhost:3000 |

### Your first game without a phone

1. Open the console at http://localhost:5173 and create a room.
2. Turn on **developer mode** (see [`docs/technical/dev-mode.md`](docs/technical/dev-mode.md)).
3. Add 2 to 8 simulated controllers in the simulator panel.
4. Pick a game and start it.

Every environment variable is documented in [`.env.example`](.env.example).

## Play with a real phone on your local network

1. Connect your computer and your phone to the **same Wi-Fi network**.
2. Start the project and make the dev servers reachable on your network:
   ```bash
   npm run dev:host
   ```
3. Find your computer's local IP address (for example `192.168.1.42`).
4. Open the console at `http://<your-ip>:5173`, then scan the QR code with your phone.

> **iOS note:** Safari only allows motion sensors (gyroscope, accelerometer) on HTTPS pages, after the player taps to grant permission. To test sensors locally, use the HTTPS dev mode described in [`docs/technical/controller.md`](docs/technical/controller.md).

Not working? See [Troubleshooting](docs/user/troubleshooting.md).

## Running tests

| Command | What it runs |
| --- | --- |
| `npm test` | Every unit and integration test |
| `npm run test:e2e` | End-to-end tests: one console and several emulated mobile controllers |
| `npm run test:load` | Load tests with simulated players (bots) |
| `npm run test:coverage` | Unit and integration tests with coverage thresholds |
| `npm run lint` | ESLint (code quality and accessibility rules) |
| `npm run format:check` | Prettier formatting check (`npm run format` fixes it) |
| `npm run typecheck` | TypeScript type check of every workspace |
| `npm test -w <workspace>` | Tests of a single workspace, e.g. `npm test -w apps/server` |

Every pull request runs lint, formatting, type checks, tests with coverage and the build on GitHub Actions (end-to-end tests join with E13-02). See [CI/CD pipeline](docs/technical/ci-cd.md). A pull request cannot be merged while the pipeline fails.

## Project structure

```
.
├── apps/
│   ├── console/          # Main screen web app (TV / laptop)
│   ├── controller/       # Phone controller web app
│   └── server/           # Real-time server: rooms, players, validation
├── packages/
│   ├── sdk/              # Game SDK (screen side and controller side)
│   ├── controller-ui/    # Controller components (buttons, joystick, drawing…)
│   └── protocol/         # Shared message types between all parts
├── games/                # The games, each one a package with its manifest
├── e2e/                  # End-to-end tests (Playwright)
├── load-tests/           # Load tests with simulated players
├── docs/                 # All documentation (see below)
└── .github/              # CI workflows, issue and pull request templates
```

## Documentation

| Audience | Where |
| --- | --- |
| Hosts and players | [`docs/user/`](docs/user/): getting started, rules of each game, FAQ, troubleshooting, accessibility features |
| Game developers | [`docs/game-dev/`](docs/game-dev/): SDK reference, controller components, manifest, developer mode, step-by-step tutorial |
| Contributors | [`docs/technical/`](docs/technical/): architecture, data model, real-time protocol, CI/CD, load test and accessibility audit results |
| Decisions | [`docs/adr/`](docs/adr/): Architecture Decision Records |
| Accessibility | [`docs/accessibility-statement.md`](docs/accessibility-statement.md) |

## Roadmap

| Milestone | Target | Content | Status |
| --- | --- | --- | --- |
| v0.1 Foundation | End of November 2026 | Rooms, QR code, phone joins, controller simulator, online deployment | Planned |
| v0.5 Follow-up | Mid-December 2026 | SDK v1, full platform, two playable games | Planned |
| v1.0 Release | End of January 2027 | Three games, accounts, accessibility audit, full documentation | Planned |

The detailed backlog lives in our [GitHub Project](https://github.com/matteo-allevard/EpiAirConsole/projects).

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before you start: it covers the workflow, branch and commit conventions, and the Definition of Done. Issues labelled [`good first issue`](https://github.com/matteo-allevard/EpiAirConsole/labels/good%20first%20issue) are a good place to start.

Everyone taking part must follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Use of AI

We use AI tools and declare them here, as our AI usage policy requires. Each team member is responsible for everything we ship and can explain any part of the code. AI-generated code and content go through the same tests, reviews and licence checks as everything else.

| Tool | Used for | Parts of the project |
| --- | --- | --- |
| Claude (Anthropic) | Drafting documentation, planning the product backlog, project tooling | README, CONTRIBUTING, product roadmap |
| *to be completed* | | |

Update this table in the same pull request as the work it describes.

## Team

| Name | GitHub | Role |
| --- | --- | --- |
| Clément | [Warred14](https://github.com/Warred14) | Product Owner |
| Mattéo | [matteo-allevard](https://github.com/matteo-allevard) | Scrum Master |
| Samuel | [SamuelValentin974](https://github.com/SamuelValentin974) | Developer, demo lead |

All three of us develop on the project.

## License

Distributed under the MIT License. See [LICENSE](LICENSE).

Game graphics, sounds and music are original or used under free licences. Each asset is credited in [`docs/CREDITS.md`](docs/CREDITS.md).

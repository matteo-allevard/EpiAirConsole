# ADR 0001: TypeScript monorepo stack

- **Status:** Accepted
- **Date:** 2026-11-04
- **Deciders:** Clément, Mattéo, Samuel

## Context

The platform has several parts that exchange messages all the time: a real-time server, a console web app, a phone controller web app, a game SDK (screen side and controller side) and the games. A message format that drifts between two parts breaks the platform silently.

Constraints:

- Latency under 100 ms from button press to on-screen reaction on a local network
- Rooms of up to 8 players, several rooms on one server, automatic reconnection and host handover
- Controller runs in the phone's browser with no install (Safari iOS, Chrome Android)
- A new contributor must be up and running in under 15 minutes
- Team of three, working on the project three days a week

## Options considered

### Option A: TypeScript everywhere, in one npm workspaces monorepo

- Pros: one language for every part; message types shared between server, console, controller and SDK, so a format change breaks the build instead of the game; one install and one command for everything; the team already knows JavaScript.
- Cons: monorepo tooling to set up at the start; Node.js is not the fastest server runtime.

### Option B: separate repositories and languages (e.g. a Go or Python server, a JavaScript front end)

- Pros: freedom to pick the best language for each part.
- Cons: message types duplicated by hand; several setups for a newcomer; harder to keep CI and versions in sync.

## Decision

We use **Option A**:

| Part | Choice | Main reason |
| --- | --- | --- |
| Language | TypeScript | Shared, checked message types across all parts |
| Monorepo | npm workspaces | Built into npm, no extra tool; reuses the CI we already built on a previous project; `package-lock.json` lockfile |
| Real-time server | Node.js + Socket.IO | Rooms, automatic reconnection and fallbacks built in |
| Console and controller | React + Vite | Fast dev server, accessible component patterns, team knowledge |
| Database (accounts) | PostgreSQL | Relational data (players, games, scores, achievements) |
| Unit and integration tests | Vitest | Native TypeScript and Vite support |
| End-to-end tests | Playwright | Emulates several mobile browsers in one test |

The library used to draw the games is **not decided yet**. It will get its own ADR when we start the first game.

## Consequences

- Shared types live in `packages/protocol`; every part imports them instead of redefining messages.
- `npm install` and `npm run dev` at the root must be enough to run everything.
- We must measure latency early (developer mode) to confirm Socket.IO meets the 100 ms target; if not, a new ADR will revisit the transport.
- The hosting provider must support long-lived WebSocket connections (separate ADR).

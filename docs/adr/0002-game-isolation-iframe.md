# ADR 0002: Games isolated in sandboxed iframes

- **Status:** Accepted
- **Date:** 2026-11-04
- **Deciders:** Clément, Mattéo, Samuel

## Context

Any developer must be able to add a game to the catalog without changing the platform. A game that crashes or freezes must be stopped, and players must go back to the lobby without losing the room. Games must only use the public SDK, never the platform internals.

## Options considered

### Option A: load games as modules inside the console app

- Pros: simplest to build; direct function calls; no message overhead.
- Cons: a crash or an infinite loop in a game freezes the whole console; a game can reach platform internals; global styles and state leak between games.

### Option B: run each game in a sandboxed iframe, talking to the console through `postMessage`

- Pros: a crashed game can be removed without touching the room; the browser enforces the boundary, so games can only use what the SDK exposes; each game keeps its own styles, libraries and state.
- Cons: every call goes through messages, which adds a small cost; the SDK must handle the message plumbing; debugging spans two documents.

### Option C: run games in a Web Worker

- Pros: strong isolation.
- Cons: no access to the DOM or canvas rendering as usual, which rules out most game libraries.

## Decision

We use **Option B**. Each game runs in an `<iframe sandbox="allow-scripts">` (other permissions only if a game needs them and declares it). The Screen SDK wraps `postMessage` so game developers never handle it directly.

## Consequences

- The console watches each game with a heartbeat; a game that stops answering is unloaded and players return to the lobby.
- The SDK defines a versioned message protocol between the console and the game, documented in `docs/game-dev/`.
- Game packages are served as static files; adding one means dropping its package and manifest in `games/`.
- The developer mode message log must show console–game messages as well as server messages.

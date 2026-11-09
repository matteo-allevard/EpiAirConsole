# Architecture

> **Planned (Sprint 1).** To be completed with a component diagram and data flows once the first room works end to end.

## Components

| Component | Folder | Role |
| --- | --- | --- |
| Console | `apps/console` | Main screen: rooms, waiting room, catalog, end screen; hosts the running game in an iframe |
| Controller | `apps/controller` | Phone web app: joins a room, renders the controller described by the game, reads sensors |
| Real-time server | `apps/server` | Rooms, players, reconnection, host handover, validation of every action |
| SDK | `packages/sdk` | Screen side and controller side API used by games |
| Controller UI | `packages/controller-ui` | Controller components (buttons, joystick, drawing…) |
| Protocol | `packages/protocol` | Shared message types |
| Games | `games/*` | Game packages with their manifest |

## Data flow

*To be written: room creation, join, input from phone to game, game to phone (controller layout, private messages, vibration).*

## Stack

See [ADR 0001](../adr/0001-typescript-monorepo-stack.md) and [ADR 0002](../adr/0002-game-isolation-iframe.md).

## Still to document

- Data model: room, player, account, game, match, score, achievement
- Real-time protocol: messages, synchronisation, latency, reconnection, host handover
- Deployment and CI/CD pipeline
- Load test results

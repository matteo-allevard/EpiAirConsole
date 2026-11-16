# NeonCast — Dependency rules

> Enforced by code review today, by a CI script in a future story (see
> E1-05). Any violation is a bug.

## Hierarchy

```
games/ → packages/protocol/ → packages/sdk/ → apps/*
↑ ↑
packages/ui/ ────────────────┘
```


## Rules per package

### `packages/protocol/`
- **May import:** nothing from the project. Only TypeScript itself and
  TypeScript-builtin types.
- **Must not import:** `packages/sdk/`, `packages/ui/`, `apps/*`, `games/*`.
- **Allowed content:** types, constants, pure validators, pure helpers
  for message encoding.

### `packages/ui/`
- **May import:** `packages/protocol/`.
- **Must not import:** `packages/sdk/`, `apps/*`, `games/*`.
- **Allowed content:** React components, hooks, styles. No business
  logic. No network calls.

### `packages/sdk/`
- **May import:** `packages/protocol/`.
- **Must not import:** `packages/ui/`, `apps/*`, `games/*`.
- **Allowed content:** the public game-developer API — screen API,
  controller API, lifecycle hooks, manifest schema.

### `apps/console/`
- **May import:** `packages/protocol/`, `packages/ui/`, `packages/sdk/`.
- **Must not import:** `apps/controller/`, `apps/server/`, `games/*`.

### `apps/controller/`
- **May import:** `packages/protocol/`, `packages/ui/`, `packages/sdk/`.
- **Must not import:** `apps/console/`, `apps/server/`, `games/*`.

### `apps/server/`
- **May import:** `packages/protocol/`.
- **Must not import:** `packages/ui/`, `packages/sdk/`, `apps/console/`,
  `apps/controller/`, `games/*` by direct import.
- **How it loads a game:** through the protocol, by loading the game's
  manifest and its compiled engine. It never imports the game's source
  code as a package.

### `games/*`
- **May import:** the public SDK, reachable at runtime through the
  WebSocket protocol. If the game is written in TypeScript, it may
  import `packages/protocol/`.
- **Must not import:** `apps/*`, other `games/*`, or any NeonCast
  internal. Each game is isolated from every other game.

## Naming conventions

| Kind | Pattern | Example |
| --- | --- | --- |
| App | `@neoncast/<app>` | `@neoncast/console` |
| Shared package | `@neoncast/<name>` | `@neoncast/protocol` |
| Game | `@neoncast/game-<name>` | `@neoncast/game-echo` |

## Rule of thumb

If you hesitate between `apps/` and `packages/`:

- **Used by one app only** → `apps/<app>/`
- **Used by two apps or more** → `packages/<name>/`

An `apps/` folder must never contain code that would be useful to
another `apps/` folder.

## Common mistakes and their fix

| Mistake | Fix |
| --- | --- |
| `apps/console` imports `apps/controller/utils/foo` | Move `foo` to `packages/ui/` and import from there |
| `apps/server` imports a game's source file | Load the game through the protocol; the server never sees the source |
| `packages/sdk` imports a React component from `packages/ui` | The SDK is framework-agnostic; if you need UI, put the component in `packages/ui` and have the app import both |
| A game imports `@neoncast/server` | Forbidden. Games talk to the platform only through the WebSocket protocol |

## Enforcement (planned)

A CI script will parse every `import` and fail if a forbidden dependency
is found. Until then, reviewers are responsible.

The script will:
1. Walk every `package.json` in `apps/` and `packages/`.
2. Walk every TypeScript file in each package.
3. Compare imports against the rules above.
4. Print a table of violations and exit non-zero.
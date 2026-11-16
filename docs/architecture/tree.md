# BYOC — Folder tree

> This is the actual structure of the repository. Any change must be
> reflected here **and** in `docs/technical/dependency-rules.md`, in the
> same pull request.



```
BYOC/
├── apps/ # Deployable applications
│ ├── console/ # Main screen (TV / browser)
│ │ ├── src/
│ │ ├── public/
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── vite.config.ts
│ ├── controller/ # Smartphone controller
│ │ ├── src/
│ │ ├── public/
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── vite.config.ts
│ └── server/ # Real-time server
│ ├── src/
│ │ ├── rooms/
│ │ ├── sdk/
│ │ └── index.ts
│ ├── package.json
│ └── tsconfig.json
├── packages/ # Shared code (never deployed alone)
│ ├── protocol/ # WebSocket messages and constants
│ │ ├── src/
│ │ │ ├── messages.ts
│ │ │ ├── entities.ts
│ │ │ └── constants.ts
│ │ ├── package.json
│ │ └── tsconfig.json
│ ├── sdk/ # Public game-developer SDK
│ │ ├── src/
│ │ ├── package.json
│ │ └── tsconfig.json
│ └── ui/ # Shared React components
│ ├── src/
│ ├── package.json
│ └── tsconfig.json
├── games/ # One folder per game (language-agnostic)
│ ├── quiz/
│ │ ├── manifest.json
│ │ └── engine.ts
│ ├── wordguess/
│ ├── arena/
│ ├── platformer/
│ └── echo/
├── docs/
│ ├── user/ # Hosts and players
│ ├── game-dev/ # External game developers
│ ├── technical/ # Architecture, protocol, dependency rules
│ │ ├── tree.md # This file
│ │ ├── dependency-rules.md
│ │ └── protocol.md
│ └── adr/ # Architecture Decision Records
│ ├── template.md
│ ├── 001-language-and-stack.md
│ └── 002-monorepo-structure.md
├── scripts/ # Dev and maintenance scripts
├── .github/ # CI/CD, templates
├── package.json # Workspace root
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CHANGELOG.md
├── LICENSE
└── .env.example

```


## Where to find what

| Need | Location |
| --- | --- |
| Add a new game | `games/<name>/` with `manifest.json` + `engine.ts` |
| Change the protocol | `packages/protocol/src/` |
| Add a shared component | `packages/ui/src/` |
| Touch the game-developer API | `packages/sdk/src/` |
| Change the server behaviour | `apps/server/src/` |
| Change the main screen | `apps/console/src/` |
| Change the phone controller | `apps/controller/src/` |
| Write a decision | `docs/adr/NNNN-<title>.md` |
| Update the dependency rules | `docs/technical/dependency-rules.md` |

## Rules

1. **Any change to the tree** requires a matching update in this file
   and in `docs/technical/dependency-rules.md`, in the same pull request.
2. **A new package** must appear in `CONTRIBUTING.md` (its naming and
   purpose), in this tree, and in the dependency rules.
3. **`games/` is language-agnostic.** A game may be written in
   TypeScript, Python, or any other language, as long as it respects
   the WebSocket protocol. `engine.ts` is the default, but a game folder
   with `manifest.json` + `engine.py` is valid.
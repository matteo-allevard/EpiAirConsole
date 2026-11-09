# ADR 0003: English for code and documentation

- **Status:** Accepted
- **Date:** 2026-11-04
- **Deciders:** Clément, Mattéo, Samuel

## Context

The project must use one language across all its documentation (user, technical and game developer guides). Code, comments and commit messages also need a single language. The SDK is meant for any outside developer.

## Options considered

### Option A: French documentation, English code

- Pros: easier to write for a French-speaking team.
- Cons: two languages in the repository; outside game developers may not read French.

### Option B: English everywhere

- Pros: one language for code, commits, issues and every document; the SDK guide is usable by any developer.
- Cons: writing takes a little more effort.

## Decision

We use **Option B: English everywhere**: code, comments, commit messages, issues, pull requests and every document in the repository.

## Consequences

- Contributors write issues, pull requests and reviews in English.
- The interface of the console and the controller is in English too, unless a later ADR adds translations.

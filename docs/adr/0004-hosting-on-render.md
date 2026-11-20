# ADR 0004: Hosting on Render

- **Status:** Accepted
- **Date:** 2026-11-18
- **Deciders:** Clément, Mattéo, Samuel

## Context

The subject requires continuous deployment: every merge on `main` must update the console, the controller and the real-time server, available online on a free hosting offer.

Constraints:

- The real-time server keeps **long-lived WebSocket connections** (Socket.IO), so serverless functions are ruled out.
- It must stay **free until the end of the project** (end of January 2027), not just during a trial.
- Rooms live **in memory** on the server, so the server runs as **a single instance**.
- Players are in Europe: the server should run in a European region to keep latency low.
- Deployment must be triggered from GitHub Actions, with secrets stored in GitHub Secrets.

## Options considered

Free tiers as checked in November 2026.

### Option A: Render

- Pros: free web service with WebSocket support; a free service stays up while it receives HTTP requests or WebSocket messages, so it does not sleep during a game; free static sites are always on and never sleep; one dashboard for the three apps; deploy hooks callable from GitHub Actions.
- Cons: the free web service spins down after 15 minutes without traffic and takes about one minute to wake up; ephemeral filesystem; free PostgreSQL databases expire after 30 days; reduced free bandwidth.

### Option B: Koyeb

- Pros: free instance with WebSockets, scale to zero after one hour instead of 15 minutes.
- Cons: acquired by Mistral AI in February 2026, with free tier changes since (card hold); too uncertain for a three-month project.

### Option C: Fly.io

- Pros: always-on machines, European regions.
- Cons: no free tier for new accounts since October 2024, only a short trial; pay-as-you-go afterwards.

### Option D: Railway

- Pros: simple deployment from GitHub.
- Cons: no permanent free tier, only a trial credit, then a paid plan.

## Decision

We host everything on **Render**:

| App | Render service type | Plan |
| --- | --- | --- |
| Real-time server (`apps/server`) | Web Service | Free |
| Console (`apps/console`) | Static Site | Free |
| Controller (`apps/controller`) | Static Site | Free |

All services are created in the **Frankfurt** region (to confirm when creating them). Deployment is triggered by GitHub Actions once the CI pipeline passes on `main` (E1-06).

## Consequences

- **Cold start:** the first visitor after 15 minutes of inactivity waits about one minute while the server wakes up. Before any demo, open the console a couple of minutes in advance. For the final presentation, we may switch the server to a paid instance for one month so that it never sleeps; the local setup stays our fallback.
- **Rooms are lost when the server sleeps or redeploys.** This is acceptable: an idle room is closed after inactivity anyway (E3-06), and a redeploy only happens on a merge.
- **Production build:** the server needs a real production build and start command (`npm run build` then `npm start`), which `npm run dev` does not cover today. This is part of E1-06.
- **Configuration:** the console and the controller are built with `VITE_SERVER_URL` and `VITE_CONTROLLER_URL` pointing to the Render URLs; the server gets `CORS_ORIGINS` with the two static site URLs. Values are set in Render and in GitHub Secrets, never in the code.
- **Accounts database (E11):** Render's free PostgreSQL expires after 30 days, so the database for accounts will be hosted elsewhere. A separate ADR will choose it.
- **Pull request previews (E1-07):** not covered by this decision; to be studied separately.
- **Vendor risk:** free tiers changed often in 2025 and 2026. If Render's free offer changes before January, the Docker setup keeps us portable to another host.

## Sources

- [Render — Deploy for Free](https://render.com/docs/free)
- [Render changelog — free web services stay active while receiving WebSocket messages](https://render.com/changelog/free-web-services-now-remain-active-while-receiving-websocket-messages)
- [Render pricing 2026 — temps.sh](https://temps.sh/blog/render-pricing-2026)
- [Koyeb alternative — SnapDeploy](https://snapdeploy.dev/koyeb-alternative)
- [Fly.io plans and pricing — CostBench](https://costbench.com/software/developer-tools/flyio/)
- [Fly.io vs Railway — livemy.app](https://livemy.app/blog/fly-io-vs-railway)

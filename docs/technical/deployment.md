# Deployment

The console, the controller and the real-time server are hosted on [Render](https://render.com), as decided in [ADR 0004](../adr/0004-hosting-on-render.md). The three services are described as code in [`render.yaml`](../../render.yaml) (a Render *Blueprint*).

## Online URLs

| App | URL | Render service |
| --- | --- | --- |
| Console | https://byoc-console.onrender.com *(to confirm)* | `byoc-console` (static site) |
| Controller | https://byoc-controller.onrender.com *(to confirm)* | `byoc-controller` (static site) |
| Real-time server | https://byoc-server.onrender.com *(to confirm)* | `byoc-server` (web service, free plan, Frankfurt) |

Render adds a random suffix to a URL when the name is already taken: always check the real URL in the Render dashboard.

## How a change goes live

1. A pull request is merged into `main`.
2. GitHub Actions runs the CI pipeline on `main` ([CI/CD pipeline](ci-cd.md)).
3. When **every check has passed**, Render deploys the services whose files changed (`autoDeployTrigger: checksPass` and `buildFilter` in `render.yaml`). If a check fails, nothing is deployed.

| Service | Build command | Start / publish |
| --- | --- | --- |
| Server | `npm ci && npm run build -w @byoc/server` (esbuild bundle in `apps/server/dist/index.cjs`) | `npm start -w @byoc/server`, health check on `/api/health` |
| Console | `npm ci && npm run build -w @byoc/console` | `apps/console/dist`, every path rewritten to `index.html` |
| Controller | `npm ci && npm run build -w @byoc/controller` | `apps/controller/dist`, every path rewritten to `index.html` |

To check the production build of the server locally:

```bash
npm run build -w @byoc/server
PORT=3000 CORS_ORIGINS=http://localhost:5173 npm start -w @byoc/server
```

## Environment variables

Set in the Render dashboard (*Environment* tab of each service), never in the code. `render.yaml` declares them with `sync: false`, so Render asks for their values when the Blueprint is created.

| Service | Variable | Value |
| --- | --- | --- |
| Server | `CORS_ORIGINS` | `https://byoc-console.onrender.com,https://byoc-controller.onrender.com` |
| Server | `PORT` | Set by Render automatically, do not define it |
| Console | `VITE_SERVER_URL` | `https://byoc-server.onrender.com` |
| Console | `VITE_CONTROLLER_URL` | `https://byoc-controller.onrender.com` |
| Controller | `VITE_SERVER_URL` | `https://byoc-server.onrender.com` |

`VITE_*` values are read **at build time**: after changing one, start a new deploy of the static site (*Manual Deploy → Deploy latest commit*).

## Free plan limits

- The server **sleeps after 15 minutes without traffic** and takes about one minute to wake up. Open the console a few minutes before a demo.
- Rooms live in memory: they are lost when the server sleeps or redeploys.
- Static sites never sleep.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| "Failed to create room" on the online console | Server asleep, or `CORS_ORIGINS` does not contain the console URL | Wait a minute and retry; check the server logs and `CORS_ORIGINS` |
| QR code points to `localhost` | `VITE_CONTROLLER_URL` missing on the console | Set it, then redeploy the console |
| Scanning the QR code shows "Not Found" | Rewrite rule missing on the controller | Check *Redirects/Rewrites* of `byoc-controller` |
| A merge on `main` is not deployed | A CI check failed, or no file of that service changed | Check the Actions tab and the `buildFilter` paths |

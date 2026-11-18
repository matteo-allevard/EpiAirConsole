import { config } from "dotenv";
import { resolve } from "node:path";

// npm workspaces runs this from apps/server/, so the root .env
// is two levels up. Load it before anything else reads process.env.
config({ path: resolve(process.cwd(), "../../.env") });

import express from "express";
import cors from "cors";
import { roomsRouter } from "./http/rooms";
import { RoomManager } from "./rooms/manager";

const PORT = Number(process.env.PORT ?? 3000);
const ORIGINS = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (ORIGINS.length === 0) {
  console.warn(
    "[server] CORS_ORIGINS is empty. Cross-origin requests will be blocked. " +
      "Add CORS_ORIGINS=http://localhost:5173 to .env"
  );
}

const roomManager = new RoomManager();
const app = express();
app.use(cors({ origin: ORIGINS.length > 0 ? ORIGINS : false }));
app.use(express.json());

app.use("/api/rooms", roomsRouter(roomManager));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", rooms: roomManager.size() });
});

app.listen(PORT, () => {
  console.log(`NeonCast server listening on http://localhost:${PORT}`);
  console.log(`CORS allowed origins: ${ORIGINS.length ? ORIGINS.join(", ") : "(none)"}`);
});
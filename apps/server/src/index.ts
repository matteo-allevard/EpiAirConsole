import "dotenv/config";
import express from "express";
import cors from "cors";
import { roomsRouter } from "./http/rooms";
import { RoomManager } from "./rooms/manager";

const PORT = Number(process.env.PORT ?? 3000);
const ORIGINS = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

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
});
import express from "express";
import cors from "cors";
import { roomsRouter } from "./http/rooms";
import { RoomManager } from "./rooms/manager";

const PORT = Number(process.env.PORT ?? 3000);

const roomManager = new RoomManager();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/rooms", roomsRouter(roomManager));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", rooms: roomManager.size() });
});

app.listen(PORT, () => {
  console.log(`NeonCast server listening on http://localhost:${PORT}`);
});

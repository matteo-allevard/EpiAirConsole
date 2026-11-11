import { Router } from "express";
import type { CreateRoomResponse } from "@byoc/protocol";
import type { RoomManager } from "../rooms/manager";

export function roomsRouter(manager: RoomManager): Router {
  const router = Router();

  // POST /api/rooms → create a room
  router.post("/", (_req, res) => {
    const room = manager.create();
    const response: CreateRoomResponse = {
      code: room.code,
      joinPath: `/controller?room=${room.code}`,
    };
    res.status(201).json(response);
  });

  // GET /api/rooms → list active rooms (for debugging / tests)
  router.get("/", (_req, res) => {
    res.json({ rooms: manager.list().map((r) => ({ code: r.code })) });
  });

  return router;
}

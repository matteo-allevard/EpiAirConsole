import type { Server, Socket } from "socket.io";
import type { RoomManager } from "../rooms/manager";
import {
  EVENTS,
  type PlayerJoinPayload,
  type PlayerJoinResponse,
  type ConsoleSubscribeResponse,
} from "@byoc/protocol";

interface SocketData {
  role?: "player" | "console";
  code?: string;
  playerId?: string;
}

const consoleRoom = (code: string) => `console:${code}`;

export function registerHandlers(io: Server, manager: RoomManager): void {
  io.on("connection", (socket: Socket) => {
    const data = socket.data as SocketData;

    socket.on(
      EVENTS.PLAYER_JOIN,
      (payload: PlayerJoinPayload, ack: (r: PlayerJoinResponse) => void) => {
        try {
          const { player, isHost } = manager.addPlayer(
            payload.code,
            payload.pseudo,
            payload.avatar,
          );
          data.role = "player";
          data.code = payload.code.toUpperCase();
          data.playerId = player.id;

          const room = manager.get(data.code)!;
          io.to(consoleRoom(data.code)).emit(EVENTS.ROOM_STATE, room);

          ack({ ok: true, playerId: player.id, isHost });
        } catch (e) {
          ack({
            ok: false,
            error: e instanceof Error ? e.message : "Unknown error",
          });
        }
      },
    );

    socket.on(
      EVENTS.CONSOLE_SUBSCRIBE,
      (
        { code }: { code: string },
        ack: (r: ConsoleSubscribeResponse) => void,
      ) => {
        const room = manager.get(code);
        if (!room) {
          ack({ ok: false, error: "Room not found" });
          return;
        }
        data.role = "console";
        data.code = room.code;
        socket.join(consoleRoom(room.code));
        ack({ ok: true, room });
      },
    );

    socket.on("disconnect", () => {
      if (data.role === "player" && data.code && data.playerId) {
        const removed = manager.removePlayer(data.code, data.playerId);
        if (removed) {
          const room = manager.get(data.code);
          if (room) {
            io.to(consoleRoom(data.code)).emit(EVENTS.ROOM_STATE, room);
          }
        }
      }
    });
  });
}
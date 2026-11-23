import { io, type Socket } from "socket.io-client";
import { EVENTS, type PlayerJoinResponse } from "@byoc/protocol";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000";

let socket: Socket | null = null;

export function connectPlayer(): Socket {
  if (socket) return socket;
  socket = io(SERVER_URL, { transports: ["websocket"] });
  return socket;
}

export function joinRoom(
  code: string,
  pseudo: string,
  avatar: string,
): Promise<PlayerJoinResponse> {
  return new Promise((resolve) => {
    const s = connectPlayer();
    s.emit(
      EVENTS.PLAYER_JOIN,
      { code, pseudo, avatar },
      (res: PlayerJoinResponse) => resolve(res),
    );
  });
}
import { io, type Socket } from "socket.io-client";
import {
  EVENTS,
  type Room,
  type ConsoleSubscribeResponse,
} from "@byoc/protocol";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000";

let socket: Socket | null = null;

function connect(): Socket {
  if (socket) return socket;
  socket = io(SERVER_URL, { transports: ["websocket"] });
  return socket;
}

export function subscribeToRoom(code: string): Promise<Room> {
  return new Promise((resolve, reject) => {
    const s = connect();
    s.emit(
      EVENTS.CONSOLE_SUBSCRIBE,
      { code },
      (res: ConsoleSubscribeResponse) => {
        if (res.ok) resolve(res.room);
        else reject(new Error(res.error));
      },
    );
  });
}

export function onRoomState(cb: (room: Room) => void): () => void {
  const s = connect();
  s.on(EVENTS.ROOM_STATE, cb);
  return () => s.off(EVENTS.ROOM_STATE, cb);
}
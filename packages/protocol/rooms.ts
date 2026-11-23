export interface Player {
  id: string;
  pseudo: string;
  avatar: string;
}

export interface Room {
  code: string;
  createdAt: number;
  players: Player[];
  hostId: string | null;
}

export interface CreateRoomResponse {
  code: string;
  joinPath: string;
}

export const ROOM_CODE_LENGTH = 4;
export const ROOM_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export const MAX_PLAYERS = 8;
export const PSEUDO_MIN = 2;
export const PSEUDO_MAX = 20;

export const AVATARS = ["🦊", "🐸", "🐙", "🦄", "🐲", "🐼", "🦁", "🐺"] as const;

export const EVENTS = {
  PLAYER_JOIN: "player:join",
  CONSOLE_SUBSCRIBE: "console:subscribe",
  ROOM_STATE: "room:state",
} as const;

export interface PlayerJoinPayload {
  code: string;
  pseudo: string;
  avatar: string;
}

export type PlayerJoinResponse =
  | { ok: true; playerId: string; isHost: boolean }
  | { ok: false; error: string };

export type ConsoleSubscribeResponse =
  | { ok: true; room: Room }
  | { ok: false; error: string };
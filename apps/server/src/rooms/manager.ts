import { randomUUID } from "node:crypto";
import type { Room, Player } from "@byoc/protocol";
import {
  MAX_PLAYERS,
  PSEUDO_MIN,
  PSEUDO_MAX,
  AVATARS,
} from "@byoc/protocol";
import { generateCode } from "./codegen";

const MAX_CREATE_ATTEMPTS = 10;

export class RoomManager {
  private rooms = new Map<string, Room>();

  create(): Room {
    for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt++) {
      const code = generateCode();
      if (!this.rooms.has(code)) {
        const room: Room = {
          code,
          createdAt: Date.now(),
          players: [],
          hostId: null,
        };
        this.rooms.set(code, room);
        return room;
      }
    }
    throw new Error("Could not generate a unique room code");
  }

  get(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  list(): Room[] {
    return Array.from(this.rooms.values());
  }

  delete(code: string): boolean {
    return this.rooms.delete(code.toUpperCase());
  }

  size(): number {
    return this.rooms.size;
  }

  addPlayer(
    code: string,
    pseudo: string,
    avatar: string,
  ): { player: Player; isHost: boolean } {
    const room = this.get(code);
    if (!room) throw new Error("Room not found");
    if (room.players.length >= MAX_PLAYERS) {
      throw new Error(`Room is full (${MAX_PLAYERS} players max)`);
    }
    const cleanPseudo = (pseudo ?? "").trim();
    if (cleanPseudo.length < PSEUDO_MIN || cleanPseudo.length > PSEUDO_MAX) {
      throw new Error(
        `Pseudo must be between ${PSEUDO_MIN} and ${PSEUDO_MAX} characters`,
      );
    }
    const cleanAvatar = (AVATARS as readonly string[]).includes(avatar)
      ? avatar
      : AVATARS[0];
    const player: Player = {
      id: randomUUID(),
      pseudo: cleanPseudo,
      avatar: cleanAvatar,
    };
    room.players.push(player);
    if (room.hostId === null) room.hostId = player.id;
    return { player, isHost: room.hostId === player.id };
  }

  removePlayer(code: string, playerId: string): Player | undefined {
    const room = this.get(code);
    if (!room) return undefined;
    const idx = room.players.findIndex((p) => p.id === playerId);
    if (idx < 0) return undefined;
    const removed = room.players.splice(idx, 1)[0];
    if (room.hostId === playerId) {
      // Silent promotion — E3-05 will add explicit notifications.
      room.hostId = room.players[0]?.id ?? null;
    }
    return removed;
  }
}
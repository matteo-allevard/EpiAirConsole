import type { Room } from "@byoc/protocol";
import { generateCode } from "./codegen";

const MAX_CREATE_ATTEMPTS = 10;

export class RoomManager {
  private rooms = new Map<string, Room>();

  /** Create a new room with a unique code. Throws if 10 attempts fail (essentially impossible). */
  create(): Room {
    for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt++) {
      const code = generateCode();
      if (!this.rooms.has(code)) {
        const room: Room = { code, createdAt: Date.now() };
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
}
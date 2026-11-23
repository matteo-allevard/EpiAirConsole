import { describe, it, expect } from "vitest";
import { RoomManager } from "./manager";

describe("RoomManager", () => {
  it("creates a room with a code", () => {
    const m = new RoomManager();
    const room = m.create();
    expect(room.code).toMatch(/^[A-HJ-KM-NP-Z2-9]{4}$/);
  });

  it("supports multiple rooms in parallel", () => {
    const m = new RoomManager();
    const codes = new Set<string>();
    for (let i = 0; i < 50; i++) codes.add(m.create().code);
    expect(m.size()).toBe(50);
    expect(codes.size).toBe(50); // no collision
  });

  it("retrieves a room by code, case-insensitive", () => {
    const m = new RoomManager();
    const room = m.create();
    expect(m.get(room.code.toLowerCase())?.code).toBe(room.code);
  });

  it("returns undefined for unknown code", () => {
    const m = new RoomManager();
    expect(m.get("ZZZZ")).toBeUndefined();
  });

  it("deletes a room", () => {
    const m = new RoomManager();
    const room = m.create();
    expect(m.delete(room.code)).toBe(true);
    expect(m.get(room.code)).toBeUndefined();
  });
});


describe("RoomManager — players", () => {
  it("adds a player with a valid pseudo and avatar", () => {
    const m = new RoomManager();
    const room = m.create();
    const { player } = m.addPlayer(room.code, "Alice", "🦊");
    expect(player.pseudo).toBe("Alice");
    expect(player.avatar).toBe("🦊");
    expect(player.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(m.get(room.code)?.players).toHaveLength(1);
  });

  it("trims the pseudo", () => {
    const m = new RoomManager();
    const room = m.create();
    const { player } = m.addPlayer(room.code, "  Bob  ", "🐸");
    expect(player.pseudo).toBe("Bob");
  });

  it("rejects a pseudo that is too short", () => {
    const m = new RoomManager();
    const room = m.create();
    expect(() => m.addPlayer(room.code, "A", "🦊")).toThrow(
      /between 2 and 20/,
    );
  });

  it("rejects a pseudo that is too long", () => {
    const m = new RoomManager();
    const room = m.create();
    expect(() => m.addPlayer(room.code, "A".repeat(21), "🦊")).toThrow(
      /between 2 and 20/,
    );
  });

  it("falls back to the first avatar if the avatar is unknown", () => {
    const m = new RoomManager();
    const room = m.create();
    const { player } = m.addPlayer(room.code, "Alice", "🚀");
    expect(player.avatar).toBe("🦊");
  });

  it("rejects the 9th player", () => {
    const m = new RoomManager();
    const room = m.create();
    for (let i = 0; i < 8; i++) m.addPlayer(room.code, `Player${i}`, "🦊");
    expect(() => m.addPlayer(room.code, "Player9", "🦊")).toThrow(/full/);
  });

  it("throws when the room does not exist", () => {
    const m = new RoomManager();
    expect(() => m.addPlayer("ZZZZ", "Alice", "🦊")).toThrow(/not found/);
  });

  it("removes a player by id", () => {
    const m = new RoomManager();
    const room = m.create();
    const { player: alice } = m.addPlayer(room.code, "Alice", "🦊");
    m.addPlayer(room.code, "Bob", "🐸");
    const removed = m.removePlayer(room.code, alice.id);
    expect(removed?.pseudo).toBe("Alice");
    expect(m.get(room.code)?.players).toHaveLength(1);
  });
  
  it("returns undefined when removing an unknown player", () => {
    const m = new RoomManager();
    const room = m.create();
    expect(m.removePlayer(room.code, "no-such-id")).toBeUndefined();
  });
});

describe("RoomManager — host", () => {
  it("makes the first joiner the host", () => {
    const m = new RoomManager();
    const room = m.create();
    const { player, isHost } = m.addPlayer(room.code, "Alice", "🦊");
    expect(isHost).toBe(true);
    expect(m.get(room.code)?.hostId).toBe(player.id);
  });

  it("does not make the second joiner the host", () => {
    const m = new RoomManager();
    const room = m.create();
    const a = m.addPlayer(room.code, "Alice", "🦊");
    const b = m.addPlayer(room.code, "Bob", "🐸");
    expect(a.isHost).toBe(true);
    expect(b.isHost).toBe(false);
    expect(m.get(room.code)?.hostId).toBe(a.player.id);
  });

  it("promotes the next player when the host leaves", () => {
    const m = new RoomManager();
    const room = m.create();
    const a = m.addPlayer(room.code, "Alice", "🦊");
    const b = m.addPlayer(room.code, "Bob", "🐸");
    m.removePlayer(room.code, a.player.id);
    expect(m.get(room.code)?.hostId).toBe(b.player.id);
  });

  it("clears hostId when the last player leaves", () => {
    const m = new RoomManager();
    const room = m.create();
    const a = m.addPlayer(room.code, "Alice", "🦊");
    m.removePlayer(room.code, a.player.id);
    expect(m.get(room.code)?.hostId).toBeNull();
  });

  it("does not change host when a non-host leaves", () => {
    const m = new RoomManager();
    const room = m.create();
    const a = m.addPlayer(room.code, "Alice", "🦊");
    const b = m.addPlayer(room.code, "Bob", "🐸");
    m.removePlayer(room.code, b.player.id);
    expect(m.get(room.code)?.hostId).toBe(a.player.id);
  });
});
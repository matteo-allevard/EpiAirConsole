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

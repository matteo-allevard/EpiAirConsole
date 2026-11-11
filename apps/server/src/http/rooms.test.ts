import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { roomsRouter } from "./rooms";
import { RoomManager } from "../rooms/manager";

describe("POST /api/rooms", () => {
  const manager = new RoomManager();
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = express();
    app.use("/api/rooms", roomsRouter(manager));
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
  });

  afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

  it("creates a room and returns its code and join path", async () => {
    const res = await fetch(`${baseUrl}/api/rooms`, { method: "POST" });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.code).toMatch(/^[A-HJ-KM-NP-Z2-9]{4}$/);
    expect(body.joinPath).toBe(`/controller?room=${body.code}`);
    expect(manager.get(body.code)).toBeDefined();
  });
});

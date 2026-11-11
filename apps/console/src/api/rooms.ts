import type { CreateRoomResponse } from "@byoc/protocol";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function createRoom(): Promise<CreateRoomResponse> {
  const res = await fetch(`${API_BASE}/api/rooms`, { method: "POST" });
  if (!res.ok) throw new Error(`Failed to create room (${res.status})`);
  return res.json();
}

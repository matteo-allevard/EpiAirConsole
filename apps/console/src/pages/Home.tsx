import { useState } from "react";
import { createRoom } from "../api/rooms";
import { RoomCode } from "../components/RoomCode";
import { RoomQRCode } from "../components/RoomQRCode";
import type { CreateRoomResponse } from "@byoc/protocol";

export function Home() {
  const [room, setRoom] = useState<CreateRoomResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    try {
      setRoom(await createRoom());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (!room) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <h1>NeonCast Console</h1>
        <button
          onClick={handleCreate}
          disabled={loading}
          style={{ padding: "12px 32px", fontSize: 18 }}
        >
          {loading ? "Creating…" : "Create a room"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </main>
    );
  }

  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>Room created</h1>
      <RoomCode code={room.code} />
      <RoomQRCode joinPath={room.joinPath} />
      <p>Scan the QR code with your phone to join.</p>
    </main>
  );
}

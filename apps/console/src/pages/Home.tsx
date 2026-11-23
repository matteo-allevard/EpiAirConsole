import { useState } from "react";
import { createRoom } from "../api/rooms";
import { Logo } from "../components/Logo";
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

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <Logo height={56} />

      <h1 style={{ marginTop: 24, letterSpacing: "0.05em" }}>BYOC</h1>
      <p
        style={{
          fontSize: "var(--size-subtitle)",
          fontWeight: 500,
          color: "var(--byoc-mist-2)",
          marginTop: 12,
          maxWidth: 700,
        }}
      >
        Your living-room console, in your browser.
      </p>

      {!room && (
        <div style={{ marginTop: 64 }}>
          <button className="btn-primary" onClick={handleCreate} disabled={loading}>
            {loading ? "Creating…" : "Create a room"}
          </button>
          {error && (
            <p role="alert" style={{ marginTop: 24, color: "var(--byoc-error)", fontSize: 18 }}>
              {error}
            </p>
          )}
        </div>
      )}

      {room && (
        <section
          style={{
            marginTop: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
            width: "100%",
            maxWidth: 900,
          }}
        >
          <div className="card" style={{ width: "100%" }}>
            <RoomCode code={room.code} />
          </div>

          <RoomQRCode joinPath={room.joinPath} />

          <p style={{ fontSize: 18, color: "var(--byoc-mist-2)" }}>
            Scan the QR code with your phone to join.
          </p>
        </section>
      )}
    </main>
  );
}

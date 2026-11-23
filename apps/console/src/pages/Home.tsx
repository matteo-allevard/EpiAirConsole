import { useEffect, useState } from "react";
import { createRoom } from "../api/rooms";
import { subscribeToRoom, onRoomState } from "../api/socket";
import { Logo } from "../components/Logo";
import { RoomCode } from "../components/RoomCode";
import { RoomQRCode } from "../components/RoomQRCode";
import { PlayersList } from "../components/PlayersList";
import { MAX_PLAYERS, type CreateRoomResponse, type Room } from "@byoc/protocol";

export function Home() {
  const [created, setCreated] = useState<CreateRoomResponse | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!created) return;
    subscribeToRoom(created.code)
      .then(setRoom)
      .catch((e) => setError(e.message));
    const off = onRoomState(setRoom);
    return off;
  }, [created]);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    try {
      setCreated(await createRoom());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const players = room?.players ?? [];
  const hostId = room?.hostId ?? null;

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
      <Logo size={56} />
      <h1 style={{ marginTop: 24, letterSpacing: "0.05em" }}>BYOC</h1>
      <p
        style={{
          fontSize: "var(--size-subtitle)",
          fontWeight: 500,
          color: "var(--brume-2)",
          marginTop: 12,
          maxWidth: 700,
        }}
      >
        Your living-room console, in your browser.
      </p>

      {!created && (
        <div style={{ marginTop: 64 }}>
          <button
            className="btn-primary"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating…" : "Create a room"}
          </button>
          {error && (
            <p
              role="alert"
              style={{ marginTop: 24, color: "var(--erreur)", fontSize: 18 }}
            >
              {error}
            </p>
          )}
        </div>
      )}

      {created && (
        <section
          style={{
            marginTop: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
            width: "100%",
            maxWidth: 1000,
          }}
        >
          <div className="card" style={{ width: "100%" }}>
            <RoomCode code={created.code} />
          </div>

          <RoomQRCode joinPath={created.joinPath} />

          <p style={{ fontSize: 18, color: "var(--brume-2)" }}>
            Scan the QR code with your phone to join.
          </p>

          <div style={{ width: "100%" }}>
            <h2
              style={{
                fontSize: 22,
                marginBottom: 20,
                color: "var(--lilas)",
                fontWeight: 500,
              }}
            >
              Players ({players.length}/{MAX_PLAYERS})
            </h2>
            <PlayersList players={players} hostId={hostId} />
          </div>
        </section>
      )}
    </main>
  );
}
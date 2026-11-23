import type { Player } from "@byoc/protocol";

export function PlayersList({
  players,
  hostId,
}: {
  players: Player[];
  hostId: string | null;
}) {
  if (players.length === 0) {
    return (
      <p style={{ color: "var(--brume-2)", fontSize: 18, margin: 0 }}>
        Waiting for players…
      </p>
    );
  }

  return (
    <ul
      aria-live="polite"
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        justifyContent: "center",
      }}
    >
      {players.map((p) => {
        const isHost = p.id === hostId;
        return (
          <li
            key={p.id}
            className="card"
            style={{
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              minWidth: 120,
              position: "relative",
              border: isHost
                ? "2px solid var(--soleil)"
                : "2px solid transparent",
            }}
          >
            {isHost && (
              <span
                aria-label="Host"
                style={{
                  position: "absolute",
                  top: -10,
                  padding: "2px 10px",
                  borderRadius: 999,
                  background: "var(--soleil)",
                  color: "var(--nuit)",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                }}
              >
                HOST
              </span>
            )}
            <span aria-hidden="true" style={{ fontSize: 40 }}>
              {p.avatar}
            </span>
            <span style={{ fontSize: 18, fontWeight: 500 }}>{p.pseudo}</span>
          </li>
        );
      })}
    </ul>
  );
}
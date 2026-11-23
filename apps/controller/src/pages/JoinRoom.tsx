import { useState } from "react";
import { AVATARS, PSEUDO_MIN, PSEUDO_MAX } from "@byoc/protocol";
import { AvatarPicker } from "../components/AvatarPicker";
import { joinRoom } from "../api/socket";

type Status = "idle" | "loading" | "joined" | "error";

export function JoinRoom({ code }: { code: string }) {
  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState<string>(AVATARS[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError(null);
    const res = await joinRoom(code, pseudo, avatar);
    if (res.ok) {
      setIsHost(res.isHost);
      setStatus("joined");
    } else {
      setError(res.error);
      setStatus("error");
    }
  }

  if (status === "joined") {
    return (
      <main style={{ padding: 32, textAlign: "center" }}>
        <p style={{ fontSize: 64, margin: 0 }}>{avatar}</p>
        <h1 style={{ fontSize: 28, marginTop: 16 }}>You&rsquo;re in!</h1>
        {isHost && (
          <p
            style={{
              marginTop: 12,
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 999,
              background: "var(--soleil)",
              color: "var(--nuit)",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.05em",
            }}
          >
            HOST
          </p>
        )}
        <p style={{ color: "var(--brume-2)", marginTop: 16 }}>
          Waiting for the host to start the game…
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 32, maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32 }}>Join room {code}</h1>

      <form onSubmit={handleJoin} style={{ marginTop: 24 }}>
        <label htmlFor="pseudo" style={{ display: "block", marginBottom: 8 }}>
          Pseudo ({PSEUDO_MIN}–{PSEUDO_MAX} characters)
        </label>
        <input
          id="pseudo"
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          minLength={PSEUDO_MIN}
          maxLength={PSEUDO_MAX}
          required
          autoComplete="off"
          autoCapitalize="words"
          style={{
            width: "100%",
            padding: 14,
            fontSize: 18,
            borderRadius: "var(--radius-button)",
            border: "2px solid var(--nuit-3)",
            background: "var(--nuit-2)",
            color: "var(--brume)",
          }}
        />

        <p style={{ marginTop: 24, marginBottom: 0 }}>Pick an avatar</p>
        <AvatarPicker value={avatar} onChange={setAvatar} />

        <button
          type="submit"
          className="btn-primary"
          disabled={status === "loading" || pseudo.trim().length < PSEUDO_MIN}
          style={{ width: "100%", marginTop: 32 }}
        >
          {status === "loading" ? "Joining…" : "Join the room"}
        </button>

        {error && (
          <p
            role="alert"
            style={{ marginTop: 16, color: "var(--erreur)", fontSize: 16 }}
          >
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
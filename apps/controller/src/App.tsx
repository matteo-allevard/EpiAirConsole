// Placeholder controller page. Joining a room for real comes with E3-02 and E5-01.
export function App() {
  const room = new URLSearchParams(window.location.search).get("room");

  return (
    <main style={{ padding: 24, textAlign: "center" }}>
      <h1>Controller</h1>
      {room ? (
        <p>
          Room code: <strong>{room.toUpperCase()}</strong>
        </p>
      ) : (
        <p>No room code yet. Scan the QR code shown on the console.</p>
      )}
    </main>
  );
}

import { JoinRoom } from "./pages/JoinRoom";

export function App() {
  const params = new URLSearchParams(window.location.search);
  const code = (params.get("room") ?? "").toUpperCase();

  if (!/^[A-Z2-9]{4}$/.test(code)) {
    return (
      <main style={{ padding: 32, textAlign: "center" }}>
        <h1>Invalid link</h1>
        <p style={{ color: "var(--brume-2)", marginTop: 12 }}>
          Scan the QR code from the console again.
        </p>
      </main>
    );
  }

  return <JoinRoom code={code} />;
}
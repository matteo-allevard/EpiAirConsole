import QRCode from "react-qr-code";

export function RoomQRCode({ joinPath }: { joinPath: string }) {
  const controllerBase = import.meta.env.VITE_CONTROLLER_URL ?? "http://localhost:5174";
  const url = `${controllerBase}${joinPath}`;

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          background: "var(--papier)",
          padding: 20,
          display: "inline-block",
          borderRadius: "var(--radius-card)",
        }}
      >
        <QRCode value={url} size={256} fgColor="var(--encre)" bgColor="var(--papier)" level="M" />
      </div>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          marginTop: 16,
          color: "var(--brume-2)",
          wordBreak: "break-all",
        }}
      >
        {url}
      </p>
    </div>
  );
}

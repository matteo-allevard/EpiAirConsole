import QRCode from "react-qr-code";

export function RoomQRCode({ joinPath }: { joinPath: string }) {
  const controllerBase = import.meta.env.VITE_CONTROLLER_URL ?? "http://localhost:5174";
  const url = `${controllerBase}${joinPath}`;

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          background: "var(--byoc-paper)",
          padding: 20,
          display: "inline-block",
          borderRadius: "var(--byoc-radius-card)",
        }}
      >
        <QRCode
          value={url}
          size={256}
          fgColor="var(--byoc-ink)"
          bgColor="var(--byoc-paper)"
          level="M"
        />
      </div>
      <p
        style={{
          fontFamily: "var(--byoc-font-mono)",
          fontSize: 14,
          marginTop: 16,
          color: "var(--byoc-mist-2)",
          wordBreak: "break-all",
        }}
      >
        {url}
      </p>
    </div>
  );
}

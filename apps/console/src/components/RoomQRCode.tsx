import QRCode from "react-qr-code";

export function RoomQRCode({ joinPath }: { joinPath: string }) {
  const controllerBase =
    import.meta.env.VITE_CONTROLLER_URL ?? "http://localhost:5174";
  const url = `${controllerBase}${joinPath}`;
  return (
    <div style={{ textAlign: "center", margin: "24px 0" }}>
      <div style={{ background: "#fff", padding: 16, display: "inline-block" }}>
        <QRCode value={url} size={256} />
      </div>
      <p style={{ fontSize: 12, marginTop: 8, wordBreak: "break-all" }}>
        {url}
      </p>
    </div>
  );
}
import QRCode from "react-qr-code";

const CONTROLLER_PORT = 5174; // dev; production will use env

export function RoomQRCode({ joinPath }: { joinPath: string }) {
  const url = `${window.location.protocol}//${window.location.hostname}:${CONTROLLER_PORT}${joinPath}`;
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
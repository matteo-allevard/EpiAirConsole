export function RoomCode({ code }: { code: string }) {
  return (
    <div style={{ textAlign: "center", margin: "24px 0" }}>
      <div style={{ fontSize: 14, letterSpacing: 4, opacity: 0.6 }}>
        ROOM CODE
      </div>
      <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: 16 }}>
        {code}
      </div>
    </div>
  );
}
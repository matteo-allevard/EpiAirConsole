export function RoomCode({ code }: { code: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--size-subtitle)",
          fontWeight: 500,
          color: "var(--lilas)",
          marginBottom: 8,
        }}
      >
        Room code
      </p>
      <p
        aria-label={`Room code: ${code.split("").join(" ")}`}
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: "var(--size-code)",
          letterSpacing: "0.2em",
          color: "var(--soleil)",
          lineHeight: 1,
        }}
      >
        {code}
      </p>
    </div>
  );
}
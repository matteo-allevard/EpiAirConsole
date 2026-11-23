export function RoomCode({ code }: { code: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          fontFamily: "var(--byoc-font-text)",
          fontSize: "var(--size-subtitle)",
          fontWeight: 500,
          color: "var(--byoc-lilac)",
          marginBottom: 8,
        }}
      >
        Room code
      </p>
      <p
        aria-label={`Room code: ${code.split("").join(" ")}`}
        style={{
          fontFamily: "var(--byoc-font-mono)",
          fontWeight: 500,
          fontSize: "var(--size-code)",
          letterSpacing: "0.2em",
          color: "var(--byoc-sun)",
          lineHeight: 1,
        }}
      >
        {code}
      </p>
    </div>
  );
}

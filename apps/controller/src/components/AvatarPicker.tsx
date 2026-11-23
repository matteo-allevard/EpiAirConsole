import { AVATARS } from "@byoc/protocol";

export function AvatarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (a: string) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Avatar"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        marginTop: 12,
      }}
    >
      {AVATARS.map((a) => {
        const selected = a === value;
        return (
          <button
            key={a}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(a)}
            style={{
              fontSize: 36,
              padding: 12,
              minHeight: 64,
              minWidth: 64,
              borderRadius: "var(--radius-button)",
              border: selected
                ? "3px solid var(--soleil)"
                : "3px solid transparent",
              background: "var(--nuit-2)",
              cursor: "pointer",
            }}
          >
            {a}
          </button>
        );
      })}
    </div>
  );
}
/**
 * Beacon-shaped mark, kept from the original charte as a placeholder.
 * A BYOC-specific logo will be designed in E2-01.
 * Colors from the brand charte: lilas beams, soleil disk.
 */
export function Logo({ size = 40 }: { size?: number }) {
  const height = size;
  const width = (size * 100) / 40;
  return (
    <svg
      role="img"
      aria-label="BYOC"
      width={width}
      height={height}
      viewBox="0 0 100 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="2,20 34,6 34,34" style={{ fill: "var(--lilas)" }} />
      <polygon points="98,20 66,6 66,34" style={{ fill: "var(--lilas)" }} />
      <circle cx="50" cy="20" r="12" style={{ fill: "var(--soleil)" }} />
    </svg>
  );
}

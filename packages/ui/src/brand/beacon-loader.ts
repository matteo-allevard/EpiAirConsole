/**
 * Byoc beacon loader: the lighthouse with a beam that turns in perspective.
 * Use it for long waits (joining a room, starting a game).
 * When the device asks to reduce motion, the beam disappears and only the lamp breathes.
 */

export interface BeaconLoader {
  stop(): void;
  setReducedMotion(reduced: boolean): void;
}

export interface BeaconOptions {
  /** Force reduced motion. Defaults to the device setting. */
  reducedMotion?: boolean;
}

type Vec3 = [number, number, number];
type Point = [number, number];

const RAD = Math.PI / 180;
const FOCAL = 400;
const BEAM_LENGTH = 520;
const LAYER_HALF_ANGLES = [15, 9, 3.5] as const;

function convexHull(points: Point[]): Point[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Point, a: Point, b: Point): number =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Point[] = [];
  const upper: Point[] = [];
  for (const pt of p) {
    while (lower.length > 1 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, pt) <= 0)
      lower.pop();
    lower.push(pt);
  }
  for (let i = p.length - 1; i >= 0; i--) {
    const pt = p[i]!;
    while (upper.length > 1 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, pt) <= 0)
      upper.pop();
    upper.push(pt);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

/** Projects a 3D light cone (apex at the lamp, axis d) and returns its outline. */
function projectCone(d: Vec3, halfAngle: number): { points: string; radius: number } {
  const length = BEAM_LENGTH * (1 - 0.75 * Math.max(0, d[2]));
  const r = Math.tan(halfAngle * RAD);
  let u: Vec3 = [d[2], 0, -d[0]];
  let n = Math.hypot(...u);
  if (n < 1e-3) {
    u = [1, 0, 0];
    n = 1;
  }
  u = [u[0] / n, u[1] / n, u[2] / n];
  const v: Vec3 = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
  const pts: Point[] = [[0, 0]];
  let radius = 1;
  for (let i = 0; i < 24; i++) {
    const a = (2 * Math.PI * i) / 24;
    const ca = Math.cos(a) * r;
    const sa = Math.sin(a) * r;
    const P: Vec3 = [0, 1, 2].map((k) => length * (d[k]! + u[k]! * ca + v[k]! * sa)) as Vec3;
    const scale = FOCAL / (FOCAL - Math.min(P[2], 0.8 * FOCAL));
    const q: Point = [P[0] * scale, -P[1] * scale];
    pts.push(q);
    radius = Math.max(radius, Math.hypot(q[0], q[1]));
  }
  return {
    points: convexHull(pts)
      .map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
      .join(" "),
    radius,
  };
}

const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

export function mountBeacon(host: HTMLElement, options: BeaconOptions = {}): BeaconLoader {
  const id = `beacon-${Math.random().toString(36).slice(2, 8)}`;
  const gradient = (key: string, c0: string, o0: number, c1: string, o1: number): string =>
    `<radialGradient id="${id}${key}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="100"><stop offset="0" stop-color="${c0}" stop-opacity="${o0}"/><stop offset=".5" stop-color="${c1}" stop-opacity="${o1}"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></radialGradient>`;
  const layer = (cls: string): string =>
    `<g class="${cls}" transform="translate(30 27)"><polygon fill="url(#${id}a)" opacity=".35"/><polygon fill="url(#${id}b)" opacity=".7"/><polygon fill="url(#${id}c)"/></g>`;
  host.innerHTML =
    `<svg viewBox="0 0 60 70" aria-hidden="true" style="overflow:visible;width:100%;height:100%;display:block"><defs>` +
    gradient("a", "#FFD23F", 0.42, "#FFD23F", 0.1) +
    gradient("b", "#FFD23F", 0.42, "#FFD23F", 0.1) +
    gradient("c", "#FFF1B8", 0.9, "#FFE27A", 0.22) +
    `</defs>${layer("back")}<polygon points="22.5,36 37.5,36 41,70 19,70" fill="#B9A3F0"/><polygon points="21.6,48 38.4,48 39.1,55 20.9,55" fill="#1B1530"/>${layer("front")}` +
    `<circle class="halo" cx="30" cy="28" r="14" fill="#FFD23F" opacity="0"/><circle class="lamp" cx="30" cy="28" r="9.5" fill="#FFD23F"/><circle cx="30" cy="28" r="3.6" fill="#1B1530"/></svg>`;

  const back = host.querySelector<SVGGElement>(".back");
  const front = host.querySelector<SVGGElement>(".front");
  const halo = host.querySelector<SVGCircleElement>(".halo");
  const lamp = host.querySelector<SVGCircleElement>(".lamp");
  const gradients = ["a", "b", "c"].map((k) =>
    host.querySelector<SVGRadialGradientElement>(`#${id}${k}`)
  );
  if (!back || !front || !halo || !lamp)
    throw new Error("mountBeacon: the loader markup could not be created.");

  let reduced =
    options.reducedMotion ??
    globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
    false;
  let frameId = 0;
  const start = performance.now();

  const frame = (now: number): void => {
    const t = now - start;
    if (reduced) {
      back.setAttribute("opacity", "0");
      front.setAttribute("opacity", "0");
      halo.setAttribute("opacity", "0");
      lamp.setAttribute("opacity", String(0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t / 600))));
    } else {
      lamp.setAttribute("opacity", "1");
      const azimuth = (180 - (t / 3400) * 360) * RAD;
      const elevation = (8 + 10 * Math.sin(t / 1900)) * RAD;
      const d: Vec3 = [
        Math.cos(elevation) * Math.cos(azimuth),
        Math.sin(elevation),
        Math.cos(elevation) * Math.sin(azimuth),
      ];
      const toViewer = d[2];
      LAYER_HALF_ANGLES.forEach((half, i) => {
        const cone = projectCone(d, half);
        back.children[i]?.setAttribute("points", cone.points);
        front.children[i]?.setAttribute("points", cone.points);
        gradients[i]?.setAttribute("r", String(cone.radius));
      });
      const brightness = Math.min(
        1.2,
        0.75 + 0.45 * Math.max(0, toViewer) - 0.3 * Math.max(0, -toViewer)
      );
      back.setAttribute("opacity", String(brightness * clamp01(0.5 - toViewer * 3)));
      front.setAttribute("opacity", String(brightness * clamp01(0.5 + toViewer * 3)));
      const facing = Math.max(0, toViewer);
      halo.setAttribute("r", String(13 + 14 * facing));
      halo.setAttribute("opacity", String(0.45 * facing * facing));
    }
    frameId = requestAnimationFrame(frame);
  };
  frameId = requestAnimationFrame(frame);

  return {
    stop: () => cancelAnimationFrame(frameId),
    setReducedMotion: (value) => {
      reduced = value;
    },
  };
}

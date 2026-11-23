// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountBeacon } from "./beacon-loader";

function mockReducedMotion(reduced: boolean): void {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduced && query.includes("reduce"),
    media: query,
  }));
}

describe("mountBeacon", () => {
  let frames: FrameRequestCallback[];
  beforeEach(() => {
    frames = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      frames.push(cb);
      return frames.length;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  const runFrame = (time: number): void => {
    const cb = frames.shift();
    cb?.(time);
  };

  it("draws the lighthouse inside the host element, hidden from screen readers", () => {
    mockReducedMotion(false);
    const host = document.createElement("div");
    mountBeacon(host);
    const svg = host.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("draws the beam when motion is allowed", () => {
    mockReducedMotion(false);
    const host = document.createElement("div");
    mountBeacon(host);
    runFrame(500);
    const beam = host.querySelector(".front polygon")?.getAttribute("points") ?? "";
    const back = host.querySelector(".back polygon")?.getAttribute("points") ?? "";
    expect(beam.length + back.length).toBeGreaterThan(0);
  });

  it("hides the beam and keeps the lamp breathing with reduced motion", () => {
    mockReducedMotion(true);
    const host = document.createElement("div");
    mountBeacon(host);
    runFrame(300);
    expect(host.querySelector(".front")?.getAttribute("opacity")).toBe("0");
    expect(host.querySelector(".back")?.getAttribute("opacity")).toBe("0");
    expect(Number(host.querySelector(".lamp")?.getAttribute("opacity"))).toBeGreaterThan(0);
  });

  it("can switch reduced motion on at runtime", () => {
    mockReducedMotion(false);
    const host = document.createElement("div");
    const loader = mountBeacon(host);
    loader.setReducedMotion(true);
    runFrame(100);
    expect(host.querySelector(".front")?.getAttribute("opacity")).toBe("0");
  });

  it("stops the animation loop", () => {
    mockReducedMotion(false);
    const loader = mountBeacon(document.createElement("div"));
    loader.stop();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});

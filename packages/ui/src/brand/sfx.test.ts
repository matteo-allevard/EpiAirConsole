import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSfx, PLAYER_NOTES, type SoundName } from "./sfx";

/** Minimal Web Audio stand-in: records the oscillators that get started. */
class FakeParam {
  value = 0;
  setValueAtTime = vi.fn();
  linearRampToValueAtTime = vi.fn();
  exponentialRampToValueAtTime = vi.fn();
  setTargetAtTime = vi.fn();
  cancelScheduledValues = vi.fn();
}
class FakeNode {
  connect = vi.fn();
}
class FakeSource extends FakeNode {
  start = vi.fn();
  stop = vi.fn();
}
class FakeOscillator extends FakeSource {
  type = "sine";
  frequency = new FakeParam();
  detune = new FakeParam();
}
class FakeContext {
  static instances: FakeContext[] = [];
  state = "running";
  currentTime = 0;
  sampleRate = 48000;
  destination = new FakeNode();
  oscillators: FakeOscillator[] = [];
  constructor() {
    FakeContext.instances.push(this);
  }
  createGain() {
    return Object.assign(new FakeNode(), { gain: new FakeParam() });
  }
  createBiquadFilter() {
    return Object.assign(new FakeNode(), {
      type: "lowpass",
      frequency: new FakeParam(),
      Q: new FakeParam(),
    });
  }
  createOscillator() {
    const o = new FakeOscillator();
    this.oscillators.push(o);
    return o;
  }
  createBuffer(_c: number, length: number) {
    return { getChannelData: () => new Float32Array(length) };
  }
  createBufferSource() {
    return Object.assign(new FakeSource(), { buffer: null, loop: false });
  }
  resume() {
    return Promise.resolve();
  }
}

describe("createSfx", () => {
  beforeEach(() => {
    FakeContext.instances = [];
    vi.stubGlobal("AudioContext", FakeContext);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("creates no audio context before the first sound", () => {
    createSfx();
    expect(FakeContext.instances).toHaveLength(0);
  });

  it("plays a sound by starting oscillators", () => {
    const sfx = createSfx();
    sfx.play("click");
    expect(FakeContext.instances).toHaveLength(1);
    expect(FakeContext.instances[0]!.oscillators.length).toBeGreaterThan(0);
  });

  it("plays every named sound without errors", () => {
    const names: SoundName[] = [
      "click",
      "confirm",
      "back",
      "link",
      "hover",
      "error",
      "yourTurn",
      "countdownTick",
      "go",
      "disconnect",
      "victory",
      "roundEnd",
    ];
    const sfx = createSfx();
    for (const name of names) expect(() => sfx.play(name)).not.toThrow();
    expect(FakeContext.instances[0]!.oscillators.length).toBeGreaterThan(names.length);
  });

  it("plays the intro jingle and the leave sound", () => {
    const sfx = createSfx();
    sfx.intro();
    sfx.leave(3);
    expect(FakeContext.instances[0]!.oscillators.length).toBeGreaterThan(5);
  });

  it("applies a new volume to the running audio output", () => {
    const sfx = createSfx();
    sfx.play("click");
    sfx.setVolume(0.3);
    expect(sfx.volume).toBe(0.3);
  });

  it("stays silent when disabled", () => {
    const sfx = createSfx({ enabled: false });
    sfx.play("confirm");
    sfx.join(0);
    sfx.intro();
    expect(FakeContext.instances).toHaveLength(0);
  });

  it("clamps the volume between 0 and 1", () => {
    const sfx = createSfx();
    sfx.setVolume(3);
    expect(sfx.volume).toBe(1);
    sfx.setVolume(-1);
    expect(sfx.volume).toBe(0);
  });

  it("gives each player slot its own note and wraps slots above 7", () => {
    const sfx = createSfx();
    sfx.join(2);
    sfx.join(10);
    const freqs = FakeContext.instances[0]!.oscillators.map(
      (o) => o.frequency.setValueAtTime.mock.calls[0]?.[0] as number
    );
    expect(freqs.filter((f) => f === PLAYER_NOTES[2]).length).toBeGreaterThanOrEqual(2);
  });

  it("starts and stops the ambience", () => {
    const sfx = createSfx();
    expect(sfx.ambience(true)).toBe(true);
    expect(sfx.ambienceOn).toBe(true);
    expect(sfx.ambience(false)).toBe(false);
  });

  it("stops the ambience when sounds are turned off", () => {
    const sfx = createSfx();
    sfx.ambience(true);
    sfx.setEnabled(false);
    expect(sfx.ambienceOn).toBe(false);
  });

  it("does nothing when the browser has no Web Audio support", () => {
    vi.stubGlobal("AudioContext", undefined);
    const sfx = createSfx();
    expect(() => sfx.play("click")).not.toThrow();
    expect(sfx.ambience(true)).toBe(false);
  });
});

/**
 * Byoc sound identity: interface sounds, startup jingle and room ambience.
 *
 * Every sound is synthesized live with the Web Audio API: no audio file to load,
 * nothing to credit. All sounds share one scale, E-flat major pentatonic, tuned on
 * the foghorn of the logo intro (E-flat, 155.56 Hz), so they never clash.
 *
 * Browsers only start audio after a user gesture: call the first sound from a
 * click or touch handler.
 */

export const NOTES = {
  Eb3: 155.56,
  Bb3: 233.08,
  Eb4: 311.13,
  F4: 349.23,
  G4: 392,
  Bb4: 466.16,
  C5: 523.25,
  Eb5: 622.25,
  F5: 698.46,
  G5: 783.99,
  Bb5: 932.33,
  C6: 1046.5,
  Eb6: 1244.51,
} as const;

/** One note per player slot (0 to 7), in the same order as the player colours. */
export const PLAYER_NOTES = [
  NOTES.Bb4,
  NOTES.C5,
  NOTES.Eb5,
  NOTES.F5,
  NOTES.G5,
  NOTES.Bb5,
  NOTES.C6,
  NOTES.Eb6,
] as const;

export type SoundName =
  | "click"
  | "confirm"
  | "back"
  | "link"
  | "hover"
  | "error"
  | "yourTurn"
  | "countdownTick"
  | "go"
  | "disconnect"
  | "victory"
  | "roundEnd";

export interface Sfx {
  play(name: SoundName): void;
  /** A player joins the room: rises from a low E-flat to the player's own note. */
  join(playerIndex: number): void;
  /** A player leaves: their note drops one octave. */
  leave(playerIndex: number): void;
  /** Startup jingle, timed with the logo intro animation (about 7 s). */
  intro(): void;
  /** Waiting-room ambience. Returns whether it is now playing. */
  ambience(on: boolean): boolean;
  setVolume(volume: number): void;
  setEnabled(enabled: boolean): void;
  readonly enabled: boolean;
  readonly volume: number;
  readonly ambienceOn: boolean;
}

export interface SfxOptions {
  /** Master volume from 0 to 1. Default 0.6. */
  volume?: number;
  enabled?: boolean;
}

interface ToneOptions {
  dur?: number;
  gain?: number;
  type?: OscillatorType;
  att?: number;
  glide?: number;
  lp?: number;
  harm?: number;
}

interface Ambience {
  master: GainNode;
  nodes: AudioScheduledSourceNode[];
}

type AudioContextCtor = typeof AudioContext;

export function createSfx(options: SfxOptions = {}): Sfx {
  let ctx: AudioContext | null = null;
  let out: GainNode | null = null;
  let volume = options.volume ?? 0.6;
  let enabled = options.enabled ?? true;
  let pad: Ambience | null = null;

  function audio(): { ctx: AudioContext; out: GainNode } | null {
    if (!ctx || !out) {
      const w = globalThis as unknown as {
        AudioContext?: AudioContextCtor;
        webkitAudioContext?: AudioContextCtor;
      };
      const Ctor = w.AudioContext ?? w.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      out = ctx.createGain();
      out.gain.value = volume;
      out.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return { ctx, out };
  }

  function tone(
    a: { ctx: AudioContext; out: GainNode },
    freq: number,
    t: number,
    o: ToneOptions = {}
  ): void {
    const {
      dur = 0.12,
      gain = 0.1,
      type = "sine",
      att = 0.004,
      glide = 1,
      lp = 3200,
      harm = 0.15,
    } = o;
    const g = a.ctx.createGain();
    const filter = a.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = lp;
    filter.Q.value = 0.5;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + att);
    g.gain.setTargetAtTime(0, t + att, dur / 3);
    filter.connect(g);
    g.connect(a.out);
    const partials: Array<[number, number]> = [
      [1, 1],
      [2, harm],
    ];
    for (const [ratio, amp] of partials) {
      if (!amp) continue;
      const osc = a.ctx.createOscillator();
      const og = a.ctx.createGain();
      osc.type = type;
      og.gain.value = amp;
      osc.frequency.setValueAtTime(freq * ratio, t);
      if (glide !== 1)
        osc.frequency.exponentialRampToValueAtTime(freq * ratio * glide, t + dur * 0.8);
      osc.connect(og);
      og.connect(filter);
      osc.start(t);
      osc.stop(t + att + dur * 2 + 0.05);
    }
  }

  /** Soft foghorn: two detuned saws and a sub sine through two low-pass filters. */
  function horn(
    a: { ctx: AudioContext; out: GainNode },
    freq: number,
    t: number,
    dur: number,
    peak = 0.035
  ): void {
    const attack = Math.min(0.18, dur * 0.35);
    const end = t + dur;
    const lp1 = a.ctx.createBiquadFilter();
    const lp2 = a.ctx.createBiquadFilter();
    const g = a.ctx.createGain();
    lp1.type = "lowpass";
    lp2.type = "lowpass";
    lp1.Q.value = 0.6;
    lp2.Q.value = 0.5;
    lp2.frequency.value = 900;
    lp1.frequency.setValueAtTime(260, t);
    lp1.frequency.linearRampToValueAtTime(620, t + attack * 1.5);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.setValueAtTime(peak, end);
    g.gain.setTargetAtTime(0, end, 0.12);
    lp1.connect(lp2);
    lp2.connect(g);
    g.connect(a.out);
    const voices: Array<[number, OscillatorType, number]> = [
      [freq, "sawtooth", 0.55],
      [freq * 1.004, "sawtooth", 0.55],
      [freq / 2, "sine", 0.8],
      [freq, "sine", 0.6],
    ];
    for (const [f, type, amp] of voices) {
      const osc = a.ctx.createOscillator();
      const og = a.ctx.createGain();
      osc.type = type;
      og.gain.value = amp;
      osc.frequency.setValueAtTime(f * 0.97, t);
      osc.frequency.exponentialRampToValueAtTime(f, t + Math.min(0.2, dur * 0.4));
      osc.connect(og);
      og.connect(lp1);
      osc.start(t);
      osc.stop(end + 1);
    }
  }

  const N = NOTES;
  const sounds: Record<SoundName, (a: { ctx: AudioContext; out: GainNode }, t: number) => void> = {
    click: (a, t) => tone(a, N.Eb5, t, { dur: 0.07, gain: 0.1, glide: 0.94, harm: 0.12 }),
    confirm: (a, t) => {
      tone(a, N.Bb4, t, { dur: 0.08, gain: 0.09 });
      tone(a, N.Eb5, t + 0.07, { dur: 0.16, gain: 0.1 });
    },
    back: (a, t) => {
      tone(a, N.Eb5, t, { dur: 0.07, gain: 0.08 });
      tone(a, N.Bb4, t + 0.07, { dur: 0.14, gain: 0.08 });
    },
    link: (a, t) => tone(a, N.G5, t, { dur: 0.12, gain: 0.06, glide: 1.06, harm: 0.05 }),
    hover: (a, t) => tone(a, N.Eb6, t, { dur: 0.03, gain: 0.022, harm: 0 }),
    error: (a, t) => {
      tone(a, N.G4, t, { dur: 0.1, gain: 0.11, type: "triangle", lp: 1100, harm: 0 });
      tone(a, N.F4, t + 0.14, { dur: 0.16, gain: 0.1, type: "triangle", lp: 1000, harm: 0 });
    },
    yourTurn: (a, t) => {
      tone(a, N.G5, t, { dur: 0.09, gain: 0.07 });
      tone(a, N.G5, t + 0.17, { dur: 0.15, gain: 0.07 });
    },
    countdownTick: (a, t) => tone(a, N.Bb4, t, { dur: 0.1, gain: 0.09 }),
    go: (a, t) => {
      for (const f of [N.Eb5, N.G5, N.Bb5]) tone(a, f, t, { dur: 0.4, gain: 0.055, att: 0.01 });
    },
    disconnect: (a, t) => {
      tone(a, N.Bb4, t, { dur: 0.06, gain: 0.07 });
      tone(a, N.Bb4, t + 0.09, { dur: 0.06, gain: 0.05 });
      tone(a, N.Eb4, t + 0.2, {
        dur: 0.3,
        gain: 0.08,
        glide: 0.96,
        type: "triangle",
        lp: 1500,
        harm: 0,
      });
    },
    victory: (a, t) => {
      horn(a, N.Eb3, t, 0.28);
      horn(a, N.Bb3, t + 0.3, 0.28);
      horn(a, N.Eb4, t + 0.6, 1.1, 0.03);
      tone(a, N.Bb5, t + 0.62, { dur: 0.9, gain: 0.025, att: 0.15, harm: 0 });
    },
    roundEnd: (a, t) => horn(a, N.Bb3, t, 0.9, 0.032),
  };

  function slot(index: number): number {
    return PLAYER_NOTES[((Math.trunc(index) % 8) + 8) % 8] ?? NOTES.Bb4;
  }

  function startIntro(a: { ctx: AudioContext; out: GainNode }, t: number): void {
    const env = (g: GainNode, s: number, peak: number, att: number, dec: number): void => {
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(peak, s + att);
      g.gain.exponentialRampToValueAtTime(0.0001, s + att + dec);
    };
    // 0.15 s: the light rises in the tower (filtered laser sweep).
    const t1 = t + 0.15;
    const sweep = a.ctx.createBiquadFilter();
    const sg = a.ctx.createGain();
    sweep.type = "lowpass";
    sweep.Q.value = 7;
    sweep.frequency.setValueAtTime(350, t1);
    sweep.frequency.exponentialRampToValueAtTime(4200, t1 + 0.9);
    env(sg, t1, 0.09, 0.12, 0.9);
    sweep.connect(sg);
    sg.connect(a.out);
    for (const detune of [0, 9]) {
      const osc = a.ctx.createOscillator();
      osc.type = "sawtooth";
      osc.detune.value = detune;
      osc.frequency.setValueAtTime(110, t1);
      osc.frequency.exponentialRampToValueAtTime(660, t1 + 0.9);
      osc.connect(sweep);
      osc.start(t1);
      osc.stop(t1 + 1.1);
    }
    // 1 s: the lamp turns on (zap and a small low thump).
    const t2 = t + 1;
    const zap = a.ctx.createOscillator();
    const zg = a.ctx.createGain();
    zap.type = "triangle";
    zap.frequency.setValueAtTime(2400, t2);
    zap.frequency.exponentialRampToValueAtTime(170, t2 + 0.35);
    env(zg, t2, 0.16, 0.008, 0.42);
    zap.connect(zg);
    zg.connect(a.out);
    zap.start(t2);
    zap.stop(t2 + 0.5);
    const thump = a.ctx.createOscillator();
    const tg = a.ctx.createGain();
    thump.frequency.setValueAtTime(140, t2);
    thump.frequency.exponentialRampToValueAtTime(55, t2 + 0.3);
    env(tg, t2, 0.22, 0.005, 0.35);
    thump.connect(tg);
    tg.connect(a.out);
    thump.start(t2);
    thump.stop(t2 + 0.45);
    // 3.7 s: the foghorn rises, holds its note while the Y forms, then stops.
    horn(a, N.Eb3, t + 3.7, 2.7, 0.042);
  }

  function ambience(on: boolean): boolean {
    if (on && !pad && enabled) {
      const a = audio();
      if (!a) return false;
      const t = a.ctx.currentTime;
      const master = a.ctx.createGain();
      const lp = a.ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1200;
      master.gain.setValueAtTime(0, t);
      master.gain.linearRampToValueAtTime(1, t + 2.5);
      lp.connect(master);
      master.connect(a.out);
      const nodes: AudioScheduledSourceNode[] = [];
      const layers: Array<[number, number]> = [
        [N.Eb3, 0.013],
        [N.Bb3, 0.01],
        [N.Eb4 * 1.003, 0.007],
        [N.G4, 0.006],
      ];
      layers.forEach(([f, amp], i) => {
        const osc = a.ctx.createOscillator();
        const g = a.ctx.createGain();
        const lfo = a.ctx.createOscillator();
        const lfoGain = a.ctx.createGain();
        osc.frequency.value = f;
        g.gain.value = amp;
        lfo.frequency.value = 0.05 + i * 0.023;
        lfoGain.gain.value = amp * 0.6;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        osc.connect(g);
        g.connect(lp);
        osc.start(t);
        lfo.start(t);
        nodes.push(osc, lfo);
      });
      // Soft waves: looped noise through a band-pass, slowly swelling.
      const buffer = a.ctx.createBuffer(1, a.ctx.sampleRate * 3, a.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = a.ctx.createBufferSource();
      const bp = a.ctx.createBiquadFilter();
      const ng = a.ctx.createGain();
      const wave = a.ctx.createOscillator();
      const wg = a.ctx.createGain();
      noise.buffer = buffer;
      noise.loop = true;
      bp.type = "bandpass";
      bp.frequency.value = 450;
      bp.Q.value = 0.7;
      ng.gain.value = 0.008;
      wave.frequency.value = 0.09;
      wg.gain.value = 0.006;
      wave.connect(wg);
      wg.connect(ng.gain);
      noise.connect(bp);
      bp.connect(ng);
      ng.connect(lp);
      noise.start(t);
      wave.start(t);
      nodes.push(noise, wave);
      pad = { master, nodes };
    } else if (!on && pad && ctx) {
      const current = pad;
      const t = ctx.currentTime;
      pad = null;
      current.master.gain.cancelScheduledValues(t);
      current.master.gain.setTargetAtTime(0, t, 0.5);
      for (const node of current.nodes) node.stop(t + 3);
    }
    return pad !== null;
  }

  return {
    play(name) {
      if (!enabled) return;
      const a = audio();
      if (a) sounds[name](a, a.ctx.currentTime + 0.01);
    },
    join(playerIndex) {
      if (!enabled) return;
      const a = audio();
      if (!a) return;
      const t = a.ctx.currentTime + 0.01;
      const f = slot(playerIndex);
      tone(a, N.Eb4, t, { dur: 0.1, gain: 0.07 });
      tone(a, f, t + 0.08, { dur: 0.35, gain: 0.09, att: 0.01 });
      tone(a, f * 2, t + 0.1, { dur: 0.3, gain: 0.018, harm: 0 });
    },
    leave(playerIndex) {
      if (!enabled) return;
      const a = audio();
      if (!a) return;
      const t = a.ctx.currentTime + 0.01;
      const f = slot(playerIndex);
      tone(a, f, t, { dur: 0.12, gain: 0.08 });
      tone(a, f / 2, t + 0.1, { dur: 0.3, gain: 0.07, glide: 0.97 });
    },
    intro() {
      if (!enabled) return;
      const a = audio();
      if (a) startIntro(a, a.ctx.currentTime + 0.05);
    },
    ambience,
    setVolume(v) {
      volume = Math.min(1, Math.max(0, v));
      if (out && ctx) out.gain.setTargetAtTime(volume, ctx.currentTime, 0.02);
    },
    setEnabled(on) {
      enabled = on;
      if (!on) ambience(false);
    },
    get enabled() {
      return enabled;
    },
    get volume() {
      return volume;
    },
    get ambienceOn() {
      return pad !== null;
    },
  };
}

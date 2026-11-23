var BYOC = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // ../BYOC_brand/code/packages/ui/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    NOTES: () => NOTES,
    PLAYER_NOTES: () => PLAYER_NOTES,
    createSfx: () => createSfx,
    mountBeacon: () => mountBeacon
  });

  // ../BYOC_brand/code/packages/ui/src/brand/sfx.ts
  var NOTES = {
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
    Eb6: 1244.51
  };
  var PLAYER_NOTES = [
    NOTES.Bb4,
    NOTES.C5,
    NOTES.Eb5,
    NOTES.F5,
    NOTES.G5,
    NOTES.Bb5,
    NOTES.C6,
    NOTES.Eb6
  ];
  function createSfx(options = {}) {
    var _a, _b;
    let ctx = null;
    let out = null;
    let volume = (_a = options.volume) != null ? _a : 0.6;
    let enabled = (_b = options.enabled) != null ? _b : true;
    let pad = null;
    function audio() {
      var _a2;
      if (!ctx || !out) {
        const w = globalThis;
        const Ctor = (_a2 = w.AudioContext) != null ? _a2 : w.webkitAudioContext;
        if (!Ctor) return null;
        ctx = new Ctor();
        out = ctx.createGain();
        out.gain.value = volume;
        out.connect(ctx.destination);
      }
      if (ctx.state === "suspended") void ctx.resume();
      return { ctx, out };
    }
    function tone(a, freq, t, o = {}) {
      const {
        dur = 0.12,
        gain = 0.1,
        type = "sine",
        att = 4e-3,
        glide = 1,
        lp = 3200,
        harm = 0.15
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
      const partials = [
        [1, 1],
        [2, harm]
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
    function horn(a, freq, t, dur, peak = 0.035) {
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
      const voices = [
        [freq, "sawtooth", 0.55],
        [freq * 1.004, "sawtooth", 0.55],
        [freq / 2, "sine", 0.8],
        [freq, "sine", 0.6]
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
    const sounds = {
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
        tone(a, N.F4, t + 0.14, { dur: 0.16, gain: 0.1, type: "triangle", lp: 1e3, harm: 0 });
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
          harm: 0
        });
      },
      victory: (a, t) => {
        horn(a, N.Eb3, t, 0.28);
        horn(a, N.Bb3, t + 0.3, 0.28);
        horn(a, N.Eb4, t + 0.6, 1.1, 0.03);
        tone(a, N.Bb5, t + 0.62, { dur: 0.9, gain: 0.025, att: 0.15, harm: 0 });
      },
      roundEnd: (a, t) => horn(a, N.Bb3, t, 0.9, 0.032)
    };
    function slot(index) {
      var _a2;
      return (_a2 = PLAYER_NOTES[(Math.trunc(index) % 8 + 8) % 8]) != null ? _a2 : NOTES.Bb4;
    }
    function startIntro(a, t) {
      const env = (g, s, peak, att, dec) => {
        g.gain.setValueAtTime(1e-4, s);
        g.gain.exponentialRampToValueAtTime(peak, s + att);
        g.gain.exponentialRampToValueAtTime(1e-4, s + att + dec);
      };
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
      const t2 = t + 1;
      const zap = a.ctx.createOscillator();
      const zg = a.ctx.createGain();
      zap.type = "triangle";
      zap.frequency.setValueAtTime(2400, t2);
      zap.frequency.exponentialRampToValueAtTime(170, t2 + 0.35);
      env(zg, t2, 0.16, 8e-3, 0.42);
      zap.connect(zg);
      zg.connect(a.out);
      zap.start(t2);
      zap.stop(t2 + 0.5);
      const thump = a.ctx.createOscillator();
      const tg = a.ctx.createGain();
      thump.frequency.setValueAtTime(140, t2);
      thump.frequency.exponentialRampToValueAtTime(55, t2 + 0.3);
      env(tg, t2, 0.22, 5e-3, 0.35);
      thump.connect(tg);
      tg.connect(a.out);
      thump.start(t2);
      thump.stop(t2 + 0.45);
      horn(a, N.Eb3, t + 3.7, 2.7, 0.042);
    }
    function ambience(on) {
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
        const nodes = [];
        const layers = [
          [N.Eb3, 0.013],
          [N.Bb3, 0.01],
          [N.Eb4 * 1.003, 7e-3],
          [N.G4, 6e-3]
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
        ng.gain.value = 8e-3;
        wave.frequency.value = 0.09;
        wg.gain.value = 6e-3;
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
      }
    };
  }

  // ../BYOC_brand/code/packages/ui/src/brand/beacon-loader.ts
  var RAD = Math.PI / 180;
  var FOCAL = 400;
  var BEAM_LENGTH = 520;
  var LAYER_HALF_ANGLES = [15, 9, 3.5];
  function convexHull(points) {
    const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [];
    const upper = [];
    for (const pt of p) {
      while (lower.length > 1 && cross(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0)
        lower.pop();
      lower.push(pt);
    }
    for (let i = p.length - 1; i >= 0; i--) {
      const pt = p[i];
      while (upper.length > 1 && cross(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0)
        upper.pop();
      upper.push(pt);
    }
    return lower.slice(0, -1).concat(upper.slice(0, -1));
  }
  function projectCone(d, halfAngle) {
    const length = BEAM_LENGTH * (1 - 0.75 * Math.max(0, d[2]));
    const r = Math.tan(halfAngle * RAD);
    let u = [d[2], 0, -d[0]];
    let n = Math.hypot(...u);
    if (n < 1e-3) {
      u = [1, 0, 0];
      n = 1;
    }
    u = [u[0] / n, u[1] / n, u[2] / n];
    const v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    const pts = [[0, 0]];
    let radius = 1;
    for (let i = 0; i < 24; i++) {
      const a = 2 * Math.PI * i / 24;
      const ca = Math.cos(a) * r;
      const sa = Math.sin(a) * r;
      const P = [0, 1, 2].map((k) => length * (d[k] + u[k] * ca + v[k] * sa));
      const scale = FOCAL / (FOCAL - Math.min(P[2], 0.8 * FOCAL));
      const q = [P[0] * scale, -P[1] * scale];
      pts.push(q);
      radius = Math.max(radius, Math.hypot(q[0], q[1]));
    }
    return {
      points: convexHull(pts).map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" "),
      radius
    };
  }
  var clamp01 = (x) => Math.max(0, Math.min(1, x));
  function mountBeacon(host, options = {}) {
    var _a, _b, _c;
    const id = `beacon-${Math.random().toString(36).slice(2, 8)}`;
    const gradient = (key, c0, o0, c1, o1) => `<radialGradient id="${id}${key}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="100"><stop offset="0" stop-color="${c0}" stop-opacity="${o0}"/><stop offset=".5" stop-color="${c1}" stop-opacity="${o1}"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></radialGradient>`;
    const layer = (cls) => `<g class="${cls}" transform="translate(30 27)"><polygon fill="url(#${id}a)" opacity=".35"/><polygon fill="url(#${id}b)" opacity=".7"/><polygon fill="url(#${id}c)"/></g>`;
    host.innerHTML = `<svg viewBox="0 0 60 70" aria-hidden="true" style="overflow:visible;width:100%;height:100%;display:block"><defs>` + gradient("a", "#FFD23F", 0.42, "#FFD23F", 0.1) + gradient("b", "#FFD23F", 0.42, "#FFD23F", 0.1) + gradient("c", "#FFF1B8", 0.9, "#FFE27A", 0.22) + `</defs>${layer("back")}<polygon points="22.5,36 37.5,36 41,70 19,70" fill="#B9A3F0"/><polygon points="21.6,48 38.4,48 39.1,55 20.9,55" fill="#1B1530"/>${layer("front")}<circle class="halo" cx="30" cy="28" r="14" fill="#FFD23F" opacity="0"/><circle class="lamp" cx="30" cy="28" r="9.5" fill="#FFD23F"/><circle cx="30" cy="28" r="3.6" fill="#1B1530"/></svg>`;
    const back = host.querySelector(".back");
    const front = host.querySelector(".front");
    const halo = host.querySelector(".halo");
    const lamp = host.querySelector(".lamp");
    const gradients = ["a", "b", "c"].map(
      (k) => host.querySelector(`#${id}${k}`)
    );
    if (!back || !front || !halo || !lamp)
      throw new Error("mountBeacon: the loader markup could not be created.");
    let reduced = (_c = (_b = options.reducedMotion) != null ? _b : (_a = globalThis.matchMedia) == null ? void 0 : _a.call(globalThis, "(prefers-reduced-motion: reduce)").matches) != null ? _c : false;
    let frameId = 0;
    const start = performance.now();
    const frame = (now) => {
      const t = now - start;
      if (reduced) {
        back.setAttribute("opacity", "0");
        front.setAttribute("opacity", "0");
        halo.setAttribute("opacity", "0");
        lamp.setAttribute("opacity", String(0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t / 600))));
      } else {
        lamp.setAttribute("opacity", "1");
        const azimuth = (180 - t / 3400 * 360) * RAD;
        const elevation = (8 + 10 * Math.sin(t / 1900)) * RAD;
        const d = [
          Math.cos(elevation) * Math.cos(azimuth),
          Math.sin(elevation),
          Math.cos(elevation) * Math.sin(azimuth)
        ];
        const toViewer = d[2];
        LAYER_HALF_ANGLES.forEach((half, i) => {
          var _a2, _b2, _c2;
          const cone = projectCone(d, half);
          (_a2 = back.children[i]) == null ? void 0 : _a2.setAttribute("points", cone.points);
          (_b2 = front.children[i]) == null ? void 0 : _b2.setAttribute("points", cone.points);
          (_c2 = gradients[i]) == null ? void 0 : _c2.setAttribute("r", String(cone.radius));
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
      }
    };
  }
  return __toCommonJS(src_exports);
})();

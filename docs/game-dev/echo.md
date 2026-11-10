# E8-01 — ECHO: The Food Chain

**Working title:** ECHO: The Food Chain
**Genre:** Asymmetric horror / pure-sound action
**Players:** 2–5 (1 Predator + 1–4 Preys)
**Duration:** 120 seconds per round
**Target:** Both roles are blind. Sound is the only interface. No visual gameplay surface.

---

## 1. Pitch

> You are something in the dark. Maybe you are the one being hunted. Maybe you are the one hunting.
>
> You cannot see. Nobody can. The Predator is blind too. The only way to know where anything is, is to **make a sound** — and making a sound means **everyone** knows where you are.
>
> You are prey: quick, fragile, and trying to complete objectives.
> The Predator is slow, patient, and hunting by ear.
>
> **Both of you are listening. Only one of you is going to survive.**

---

## 2. Design pillars

1. **Pure sound.** No visual map, no visual feedback, no UI. The game is played entirely through headphones. The console screen is a spectator/stream view only.
2. **Symmetrical blindness.** Both the Prey and the Predator have no visual information about entity positions. Neither can "see." Both must listen.
3. **Self-inflicted danger.** Every piece of information costs you. Pinging reveals you. Moving makes footsteps. The game is about **choosing what you need to know** and accepting the price.
4. **Asymmetric senses.** The Prey has precise 2D localization (pan + pitch + brightness + delay). The Predator has only **direction and loudness** — they can tell "somewhere left," not "left at 20 meters." Different tools for different fears.

---

## 3. The two roles

### 3.1 The Prey (fully blind, audio + gyro QTE)

**Fantasy:** You are small, fast, and alone in the dark. You survive by listening and by risking.

**Strengths:**
- Fastest entity
- Precise 3D audio (pan for left/right, pitch for up/down)
- Can complete objectives to win
- Can hear the Predator's proximity growl at close range

**Weaknesses:**
- One hit from the Predator = dead
- No visual map, ever
- Every ping you make is heard by the Predator and by other Preys
- Cannot fight back

**Abilities:**

| Input | Action |
|---|---|
| Joystick | Move |
| PING | Emit sonar. **No cooldown.** Returns the nearest thing (wall, objective, prey, or predator). Everyone else hears your ping. |
| QTE (automatic in zone) | Tilt phone until harmony is pure, hold 4s. |

**Goal:** Complete 3 objectives before the Predator kills you. Or survive 120s.

### 3.2 The Predator (fully blind, low-fi audio only)

**Fantasy:** You are large, patient, and hungry. You hunt by guesswork and by the noise your prey makes.

**Strengths:**
- Tougher (3 lives)
- Can hear **every ping** made by Preys — high-pitched beep
- Can hear **alarms** when a Prey is stuck on an objective
- Can whisper to create fake information

**Weaknesses:**
- Slowest entity
- Very imprecise audio localization: only pan direction (left/right), no pitch or distance
- Own pings return **only walls**, not prey
- Cannot see anything

**Abilities:**

| Input | Action |
|---|---|
| Joystick | Move |
| PING | Emit sonar. **No cooldown.** Returns the nearest wall only. Every Prey hears it (low growl-beep). |
| LUNGE | Attack. Kill any Prey within range. 3s cooldown. |
| WHISPER | Play a fake prey heartbeat from a direction. 8s cooldown. |

**Goal:** Kill all Preys before the round ends.

---

## 4. The core loop (a 30-second slice)

1. **Round starts.** A low ambient drone. Nobody moves. Nobody hears anything.
2. **Prey pings.** They hear a bright bell — an objective is to the right. But the Predator also hears the ping: a high beep, direction right.
3. **Predator moves toward the beep.** They walk slowly. Their footsteps are audible to the Prey — a low thump, still far.
4. **Prey walks toward the objective.** Every step makes a light patter. The Predator hears it faintly, direction left.
5. **Predator pings to check walls.** A low growl-beep reaches the Prey — the Predator is 25 units away, to the left. The Prey now knows the Predator's approximate location, but only because the Predator revealed it.
6. **Prey enters the objective zone.** The harmony starts. The Prey tilts the phone. The wobble slows. Hold. Hold. Hold.
7. **Predator whispers.** A fake prey heartbeat plays from behind the Prey — another "Prey" is supposedly there. Is it real? The Prey doesn't know.
8. **Predator closes in.** At 10 units, the growl starts. At 5, haptic pulses. The Prey panics.
9. **Prey completes the objective.** A "complete" bell plays. The Predator hears a "fail" alarm from the same direction.
10. **Predator lunges.** Misses. The Prey hears the swoosh and runs.

Every 30 seconds is a story. The Prey's decisions — when to ping, when to run, when to trust the whisper — are all gambles.

---

## 5. Objective QTE (gyro)

The Prey must complete 3 objectives to win. Each objective is a physical zone (radius 6 units).

When the Prey enters a zone:
- A "harmony" tone starts (two slightly detuned oscillators, 330 Hz).
- When the Prey tilts the phone toward the target angle, the detune shrinks.
- When the detune is < 5° off target, the harmonic resolves (pure tone).
- The Prey must hold the phone at the right angle for 4 seconds.
- If they leave the zone, progress resets.
- If they stay 10s without completing, the Predator hears a continuous alarm ping at their location.

The target angle is random per objective. The Prey learns to hunt it by ear.

**Accessibility:** without gyro (iOS on HTTP, or accessibility need), the target angle can be scanned with **left/right arrow keys** on a fallback layout. Same audio feedback.

---

## 6. Audio design — the only interface

Both roles play with headphones. All audio is synthesized in the browser via WebAudio `PannerNode` (HRTF) — no assets needed.

### 6.1 Sound signatures

| Entity | Sound | Waveform | Pitch | Duration |
|---|---|---|---|---|
| Prey footsteps | Light patter | Triangle | 400 Hz | 80 ms |
| Predator footsteps | Heavy thump | Square | 80 Hz | 150 ms |
| Prey's own PING | **Silent** (private echo only) | — | — | — |
| Prey's PING heard by others | **High beep** | Sine | 2400 Hz | 60 ms |
| Predator's PING heard by Preys | **Low growl-beep** | Sawtooth | 400 Hz | 100 ms |
| Echo: objective | Bright bell | Sine + 5th harmonic | 2400 Hz | 500 ms |
| Echo: wall | Dull thud | Square | 90 Hz | 100 ms |
| Echo: prey | Soft triangle | Triangle | 750 Hz | 300 ms |
| Echo: predator | Low growl | Sawtooth | 180 Hz | 600 ms |
| Whisper (fake prey) | Soft heartbeat | Sine | 200 Hz | 200 ms |
| Alarm (predator gets this) | Fast sawtooth | Sawtooth | 400 Hz | 200 ms |
| Proximity growl (prey gets this at <12 units) | Low growl | Sawtooth | 180 Hz | 400 ms |
| Lunge (prey hears before hit) | Air swoosh | Noise | — | 150 ms |
| Damage | Sharp thud | Square | 350 Hz | 250 ms |
| QTE harmony (Prey only) | Two 330 Hz detuned | Sine | 330 Hz | continuous |

### 6.2 2D localization (for the Prey's private echoes)

- **Pan (left/right):** `sin(angle)` → HRTF panner.
- **Pitch (up/down):** target above = +25 % frequency, target below = -25 %.
- **Volume:** `(1 - d/max)^2.5` — steep falloff, so far sounds are almost silent.
- **Brightness:** lowpass filter at `300 + 8000 * closeness` — far = muffled, near = bright.
- **Delay:** `d / 0.34 ms` — echo returns after a delay proportional to distance.

The Prey can localize in **2D** (left/right + up/down). The Predator cannot — they only get pan.

### 6.3 Sound mixing

- **Ducking:** when growl plays, other sounds drop 40 %. When QTE harmony plays, external sounds drop 30 %. When roar plays, duck 60 %.
- **Layering:** footsteps + growl + harmony + echo can all coexist. Each layer must be distinguishable by pitch range (low / mid / high).

---

## 7. Asymmetric information

This is the game. Remove any of these and the design collapses.

| What | Prey knows | Predator knows |
|---|---|---|
| Own position | Yes (via pings) | Yes (via movement) |
| Own ping → walls | Yes (private echo) | Yes (private echo) |
| Own ping → others | Others hear you | Preys hear you |
| Enemy position (idle) | Nothing | Nothing |
| Enemy position (enemy pinged) | Predator gets a beep; Prey hears Predator's growl-beep | Preys get high beep; Predator hears their direction |
| Enemy distance | Precise (echo delay + brightness) | Imprecise (volume only) |
| Enemy vertical position | Yes (pitch shift) | No |
| Proximity warning | Growl at <12 units | None (Prey footsteps, less precise) |
| Fake info | Hears whisper (unknown if real) | Creates whisper |

The Prey has **more precise senses** (2D localization) but is **more vulnerable** (1 hit). The Predator has **less precise senses** but is **tougher** (3 hits). Both are blind.

---

## 8. Horror design

No jump-scares. Horror comes from **making the wrong choice with incomplete information**.

### 8.1 The cost of knowing

Every ping reveals you. Every step makes noise. Every objective completion rings a bell. **You are the reason the monster found you.**

### 8.2 The silence rule

Ambient drone is always present. When it stops, someone is near. This is the first thing players learn.

### 8.3 The unreliable whisper

The Predator can play a fake prey heartbeat from a direction. The Prey must decide: is this another survivor, or a trap? **Trust nothing. But verifying costs a ping.**

### 8.4 The panic radius

At 12 units, the growl starts. At 5 units, haptic pulses. At 2 units, the Prey's heartbeat in their ears becomes the Predator's footsteps. There's no "you've been spotted" UI. The horror is that **you hear them coming and there's nothing you can do except run.**

---

## 9. Accessibility

- **Fully playable without sight.** Every mechanic has audio feedback.
- **QTE fallback:** if the phone can't provide gyro (iOS on HTTP, accessibility need), use arrow keys or on-screen slider. Same audio feedback, same timing.
- **Screen reader compatible UI:** all buttons have ARIA labels. The `<hud>` uses `aria-live="polite"` for state changes.
- **Haptic alternative:** all critical cues have a vibration pattern. If audio is unavailable, vibration alone can convey danger + direction.
- **High-contrast text on visual elements** (spectator view, lobby) at 4.5:1 minimum.

---

## 10. SDK requirements

The NeonCast SDK must expose the following primitives to make ECHO playable. Each of these is a contract between a game engine and the platform, defined in `packages/sdk/`.

### 10.1 Targeted audio streaming
```ts
sdk.playAudio(playerId, {
  sound: "echo_predator",
  pan: -0.8,
  pitchShift: 0.12,
  volume: 0.6,
  brightness: 0.7,
  delayMs: 240,
});
```

### 10.2 Extended haptics

```ts
sdk.haptic(playerId, { pattern: [80, 40, 80], priority: "high" });
```

### 10.3 Per-player sound mixing

```ts
sdk.duck(playerId, { amount: 0.4, durationMs: 600 });
```

### 10.4 Gyro sensor support

```ts
// Prey sends { type: "gamma", data: { value: 23.5 } }
// Engine reads on_input to get tilt angle
```

### 10.5 Manifest extension

```ts
{
  "name": "echo",
  "requiresHeadphones": true,
  "requiresHaptics": false,
  "requiresGyro": false,
  "sensors": ["gamma"],
  "components": ["label", "joystick", "button"],
  "accessibility": [
    "fully playable without sight",
    "3D audio",
    "haptic feedback",
    "gyro QTE with keyboard fallback",
    "asymmetric roles"
  ]
}
```

Latency targets: audio cue to ear < 50 ms, haptic cue to vibration < 50 ms, gyro value to server < 100 ms. Server sends state at 20 Hz; controller renders audio locally from cached positions.


# Brand

The identity of Byoc: name, logo, colours, typography, sounds, motion and vibrations. The short version for the jury is the [style guide](byoc-style-guide.pdf) (2 pages); the [identity guide](byoc-identity-guide.pdf) (10 pages) explains every element in detail.

**Try everything:** open [`kit/byoc-sensory-kit.html`](kit/byoc-sensory-kit.html) in a browser to hear the sounds and see the loaders and transitions.

## Name and concept

**Byoc** stands for *Bring Your Own Controller*: everyone brings their own controller, their phone. The logo turns the Y into a lighthouse, the light that gathers everyone in front of the same screen: the tower is the stem, the lamp is the fork, the two beams are the arms.

In running text, write **Byoc**. The logo is always uppercase: **BYOC**.

## Logo

| File | Use |
| --- | --- |
| `logo/svg/byoc-logo-dark.svg` | Primary logo, on dark backgrounds (transparent) |
| `logo/svg/byoc-logo-dark-bg.svg` | Primary logo with its Night background |
| `logo/svg/byoc-logo-light.svg` / `-light-bg.svg` | Light backgrounds: Night letters, Violet tower |
| `logo/svg/byoc-logo-mono-white.svg` / `-mono-night.svg` | One colour, for small sizes and special prints |
| `logo/svg/byoc-icon.svg` / `byoc-icon-night.svg` / `byoc-icon-mono.svg` | The lighthouse Y alone: app icon, avatar, browser tab |
| `logo/svg/favicon.svg`, `logo/png/favicon-32.png`, `favicon-16.png`, `apple-touch-icon-180.png`, `byoc-icon-192.png`, `byoc-icon-512.png` | Browser and home-screen icons |

The letters are converted to outlines: the SVG files need no font. PNG versions (2000 px wide, transparent) are in `logo/png/`.

- Clear space: the lamp diameter on every side.
- Minimum size: 24 px high on screen, 8 mm in print. Below 20 px, use the monochrome version.
- Never stretch, recolour or add effects (shadow, outline, gradient, neon). Never separate the Y from the name, except for the icon.

## Colours

Night violet theme: dark backgrounds for the TV, Sun yellow for the action. Ratios are measured against Night (dark mode) or Paper (light variant). WCAG 2.2 AA asks for 4.5:1 for body text and 3:1 for large text and interface elements.

| Name | Hex | Token | Use | Ratio |
| --- | --- | --- | --- | --- |
| Night | `#1B1530` | `--byoc-night` | Main background | — |
| Night 2 | `#2A2148` | `--byoc-night-2` | Cards, controller | — |
| Night 3 | `#3A2F5E` | `--byoc-night-3` | Borders, hover. Never for text | — |
| Mist | `#F5F1FF` | `--byoc-mist` | Main text | 15.8:1 |
| Mist 2 | `#A89FC4` | `--byoc-mist-2` | Secondary text | 7.0:1 |
| Sun | `#FFD23F` | `--byoc-sun` | Primary action, logo | 12.2:1 |
| Lilac | `#B9A3F0` | `--byoc-lilac` | Secondary, labels, lighthouse tower | 8.0:1 |
| Ember | `#FF8A5B` | `--byoc-ember` | Occasional accent | 7.6:1 |
| Success | `#3DDC97` | `--byoc-success` | Victory, connected | 9.9:1 |
| Error | `#FF6B7A` | `--byoc-error` | Eliminated, failure | 6.4:1 |
| Info | `#7CC4FF` | `--byoc-info` | Developer mode, latency | 9.4:1 |
| Paper | `#FBF9FF` | `--byoc-paper` | Light variant background | — |
| Ink | `#1B1530` | `--byoc-ink` | Text on Paper | 16.8:1 |
| Violet | `#5B3FC4` | `--byoc-violet` | Titles and links on Paper | 6.8:1 |
| Dark sun | `#8A6A00` | `--byoc-dark-sun` | Readable yellow on Paper | 4.9:1 |

Sun yellow on white is only 1.4:1: on light backgrounds, use Dark sun.

### Player colours and notes

Colour never carries information alone: each player keeps their number and nickname, and has their own note when they join (see [Sounds](#sounds)).

| Player | Colour | Token | Note |
| --- | --- | --- | --- |
| 1 | `#FFD23F` | `--byoc-player-1` | B♭4 |
| 2 | `#56B4E9` | `--byoc-player-2` | C5 |
| 3 | `#FF8A5B` | `--byoc-player-3` | E♭5 |
| 4 | `#3DDC97` | `--byoc-player-4` | F5 |
| 5 | `#E77FD9` | `--byoc-player-5` | G5 |
| 6 | `#F5F1FF` | `--byoc-player-6` | B♭5 |
| 7 | `#9B8CFF` | `--byoc-player-7` | C6 |
| 8 | `#F25C78` | `--byoc-player-8` | E♭6 |

All eight are above 5.5:1 on Night.

## Typography

| Role | Font | Weights | Token |
| --- | --- | --- | --- |
| Titles, logo | Bricolage Grotesque | 800 titles, 500 subtitles | `--byoc-font-display` |
| Text, interface | Atkinson Hyperlegible | 400, 700 | `--byoc-font-text` |
| Room codes, developer mode | JetBrains Mono | 500 | `--byoc-font-mono` |

- Console (TV): title 64 px, subtitle 36 px, text 24 px minimum, room code 96 px.
- Controller: title 24 px, text 17 px minimum, buttons 18 px; follow the phone text size.
- All three fonts use the SIL Open Font License and are credited in [`docs/CREDITS.md`](../CREDITS.md).

## Components

- **Primary button:** Sun background, Night text, one per screen. Sound: `confirm`.
- **Secondary button:** Night 2 background, Night 3 outline. Sound: `click`.
- **Keyboard focus:** 3 px Sun outline with a 3 px offset, always visible.
- **Shape:** 12 px radius for buttons, 20 px for cards. Controller touch targets: 44 × 44 px minimum.

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--byoc-duration-instant` | 80 ms | Button press |
| `--byoc-duration-fast` | 160 ms | Hover, colours |
| `--byoc-duration-base` | 240 ms | Most animations |
| `--byoc-duration-slow` | 420 ms | Panels, state changes |
| `--byoc-duration-cinematic` | 900 ms | Screen transition, intro |
| `--byoc-ease-sweep` | `cubic-bezier(.65, 0, .35, 1)` | Movement, transitions, progress |
| `--byoc-ease-ignite` | `cubic-bezier(.34, 1.56, .64, 1)` | Entrances with a slight bounce |
| `--byoc-ease-extinguish` | `cubic-bezier(.4, 0, 1, 1)` | Exits, closing |

**Loaders:** the beacon (`mountBeacon`) for long waits, the compact spinner (`.byoc-spinner`) inside buttons, the progress bar (`.byoc-progress` with `--progress`) when progress is known, and the skeleton (`.byoc-skeleton`) while the catalog loads.

**Screen transition ("light reveal"):** the new screen appears in a circle that grows from the logo position, with a Sun ring, in 900 ms with the Sweep curve.

**Reduced motion:** when the device asks for it, the beam stops, the lamp breathes and transitions become 240 ms fades.

## Logo intro

The intro opens the console: the light rises in the tower, the lamp turns on, the 3D beam spirals upward and lights each letter as it passes, then splits in two to form the Y, over a held E♭ foghorn. About 7 s. Preview: [`animation/logo-intro.html`](animation/logo-intro.html) (and `byoc-logo-intro.mp4`). With reduced motion, the logo is shown directly.

## Sounds

Every sound is synthesized by `@byoc/ui` (`createSfx`), so there is no audio file to load or credit. They all use the E♭ major pentatonic scale of the intro foghorn, so they never clash.

| Sound | API | Use | Notes, duration |
| --- | --- | --- | --- |
| Click | `play("click")` | Secondary buttons, tabs | E♭5, 70 ms |
| Confirm | `play("confirm")` | Primary button | B♭4 → E♭5, 230 ms |
| Back | `play("back")` | Cancel, go back, close | E♭5 → B♭4, 210 ms |
| Link | `play("link")` | Text links | G5 glide, 120 ms |
| Hover | `play("hover")` | Optional, off by default | E♭6, 30 ms |
| Error | `play("error")` | Invalid room code, refused action | G4 → F4, 300 ms |
| Player joins | `join(slot)` | A player joins (slot 0 to 7) | E♭4 → player note, 450 ms |
| Player leaves | `leave(slot)` | A player leaves | note → octave below, 400 ms |
| Disconnected | `play("disconnect")` | A phone loses its connection | B♭4 ×2 → E♭4, 500 ms |
| Your turn | `play("yourTurn")` | Player turn, notification | G5 ×2, 320 ms |
| Countdown | `play("countdownTick")`, then `play("go")` | 3, 2, 1, go | B♭4 ×3 → E♭ major chord |
| Victory | `play("victory")` | Game won | E♭3 → B♭3 → E♭4 foghorn, 1.7 s |
| Round end | `play("roundEnd")` | End of a round | B♭3 foghorn, 0.9 s |
| Startup jingle | `intro()` | With the logo intro | about 6.4 s |
| Room ambience | `ambience(true)` | Waiting screen only | continuous |

## Controller vibrations

| Event | Pattern (ms, vibrate / pause) |
| --- | --- |
| Click | `[8]` |
| Confirm | `[12, 40, 18]` |
| Error | `[30, 60, 30]` |
| Your turn | `[20, 80, 20]` |
| Victory | `[40, 60, 40, 60, 120]` |
| Disconnected | `[90]` |

Vibrations work on Android browsers. iPhone does not allow them on the web, so sound and screen must always carry the same information.

## Usage rules

- **Always optional:** a Sounds switch and a volume slider in the options of the console and the controller. Default volume: 60%.
- **Never alone:** a sound or a vibration never carries information on its own; there is always a visual equivalent, and informative sounds are captioned.
- **Short and soft:** interface sounds last under 400 ms.
- **No hover sound by default.**
- **Ambience** plays on the waiting screen only, never during a game.

## In the code

```ts
import "@byoc/ui/src/brand/tokens.css";
import "@byoc/ui/src/brand/motion.css";
import { createSfx, mountBeacon, type SoundName } from "@byoc/ui";

const sfx = createSfx({ volume: 0.6 });

document.addEventListener("click", (event) => {
  const element = (event.target as HTMLElement).closest<HTMLElement>("[data-sfx]");
  if (element) sfx.play(element.dataset.sfx as SoundName);
});

const beacon = mountBeacon(document.querySelector<HTMLElement>("#beacon")!);
sfx.ambience(true);
// When the room is ready:
beacon.stop();
sfx.ambience(false);
sfx.play("go");
```

Browsers only start audio after a user gesture: the first sound must come from a click or a touch.

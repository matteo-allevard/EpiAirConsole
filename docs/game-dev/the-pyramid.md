# The Pyramid — party game concept (E9-01)

- **Status:** Draft, to be validated by the Product Owner
- **Backlog:** E9-01 (concept) · next: E9-02 (first playable version)
- **Genre:** party game — bluff and memory
- **Players:** 3 to 8, in the same room, in front of the same screen · **Duration:** about 20 to 25 minutes

## Pitch

Everyone gets 4 cards on their phone, has a few seconds to memorise them, then the cards flip face down for good. On the TV, a pyramid of 15 cards is revealed one by one. When a card comes up, anyone can claim *"I have one of those!"* and hand out penalty points, whether it's true or a bluff. The targets either accept, or call *"Liar!"*. Whoever is wrong takes double. The higher up the pyramid you go, the more each card costs. The player with the fewest points at the end wins.

## Where the players are

The subject describes a console on one screen with every player joining from their own phone: players are **in the same room, in front of the same TV** (latency target measured on a local network). Games between distant rooms are only a bonus of the subject. This is why a challenged card is simply **shown on the TV**: everyone sees it at the same time, and the server checks it, so nobody has to pass their phone around.

## Why this game

The Pyramid is built on the traditional "pyramid" card game. Its mechanics are folk mechanics that nobody owns; the name, rules adaptation, art and sounds are ours. It fits the platform well: every player has **secret information on their own phone** and the shared board is on the TV, which is exactly what a phone-as-controller console does better than a table.

| Requirement for the party game (subject) | How The Pyramid covers it |
| --- | --- |
| Private information | Each player's cards exist only on their own phone; the server never sends a hand to anyone else |
| Votes | *Accept* or *Liar!* when targeted; multiple choice questions in the *Red or Black* deal |
| Text input | In-game table talk: players send short messages from their phone, shown on the TV |
| Drawing | **Not covered yet** — see [Open questions](#open-questions) |

## Setup

- A standard 52-card deck, shuffled by the server
- **4 cards per player.** With 8 players: 32 cards dealt + 15 in the pyramid = 47 ≤ 52
- **A pyramid of 15 face-down cards** on the TV: 5 at the base, then 4, 3, 2 and 1 at the top
- Only the **value** of a card counts (any 7 matches a 7); the suit never does

## How a game goes

### 1. Deal

The host picks the deal method in the options (see [Variants](#variants)). By default, each player simply receives 4 cards.

### 2. Memorise

Each phone shows its owner's 4 cards for 20 seconds (40 seconds in slow mode). Then the cards flip face down **and the phone no longer lets the player see them**: the "no peeking" rule is enforced by the game, not by trust.

### 3. Pyramid rounds (×15)

The pyramid is revealed from the base, left to right. Each card is one round:

| Step | On the TV | On the phones |
| --- | --- | --- |
| **Reveal** | The next card flips over (e.g. *8 of hearts*), with the level and its cost | Everyone sees the value |
| **Table time** | Countdown, names of the players who claim, players still thinking, table talk messages | *"I have one!"* and *Pass* buttons |
| **Hand out** | "Julie gives 2 points to Tom and 1 to Sam" | The claimer splits the level's points among other players with +/− buttons, then confirms |
| **Answer** (15 s) | Waiting for each target | Each target's phone vibrates and offers *Accept* or *Liar!* |
| **Reveal a card** (only if someone called *Liar!*) | The chosen card is shown big for 5 seconds with the verdict, then flips face down again | The claimer picks one of their 4 face-down cards **from memory** |
| **Result** | Points added to each player, short animation | Updated score |

If nobody claims, the next card is revealed.

#### Table time: room to talk and bluff

Bluffing needs time to look at each other, hesitate and provoke. So after each reveal, the game does not rush to the next step:

- **Table time lasts up to 45 seconds.** It ends early once every player has pressed *"I have one!"* or *Pass*.
- **Players can change their mind:** a player who pressed *Pass* can still claim until table time ends.
- **The host can pause the game** from their phone at any time, for as long as the group wants to argue, then resume.
- In slow mode, table time lasts up to 90 seconds.

### 4. End

After the 15th card, the TV shows the ranking. **Fewest points wins.** Players can play again or switch games without reconnecting.

## Scoring

| Pyramid level | Cards | Points handed out | If someone calls *Liar!* |
| --- | --- | --- | --- |
| 1 (base) | 5 | 1 | 2 |
| 2 | 4 | 2 | 4 |
| 3 | 3 | 3 | 6 |
| 4 | 2 | 4 | 8 |
| 5 (top) | 1 | 5 | 10 |

### Rules made precise for the digital version

The original rules are played around a table and leave some cases open. The game settles them as follows:

1. **Several players can claim the same card.** Claims are handled one after the other, in the order they came in.
2. **A claimer must hand out all the points of the level**, to one or several other players, never to themselves.
3. **Each target answers on their own.** Some may accept while others call *Liar!*.
4. **The claimer reveals one card, chosen from memory** (as in the original rules). If it matches the value, they were honest, even if they did not remember it was that card. If it does not match, it counts as a lie, even if another of their cards would have matched: memory is part of the game.
5. **If the claimer lied:** the points they handed out are cancelled, and they take double the level's points.
6. **If the claimer was honest:** each player who called *Liar!* takes double the points they had been given. Players who accepted take their points as normal.
7. **A revealed card goes back face down.** It is shown to everyone on the TV for 5 seconds, then flips back: the claimer still has to remember it. Only the pyramid cards stay face up once revealed.
8. **Ties:** players with equal points share the rank.

## Variants

The host sets two options on the TV before the game starts. Defaults give the classic game.

| Option | Choices | Default |
| --- | --- | --- |
| **Deal** | *Classic*: 4 cards each. *Red or Black*: each player answers 4 questions to receive their cards: red or black?, higher or lower than card 1?, inside or outside cards 1 and 2?, which suit? A right answer lets them hand out 1, 2, 3 or 4 points; a wrong one makes them take those points | Classic |
| **Game mode** | *Classic*: points as in the scoring table. *Double penalties*: every point value is doubled (2, 4, 6, 8, 10; ×4 when someone calls *Liar!*). *Bonus cards*: 2 or 3 random pyramid cards are laid sideways from the start, so everyone sees them; when one is revealed, its level's points are doubled | Classic |

### Setting: penalty unit

Not a variant, just a label: penalties are called "points" by default, and the host can type another word (for example "sips" or "gorgées"). The game only counts; what a group does with the count is up to them.

## Table talk

Bluffing is also about talking. During the game, any player can open a text field on their phone and send a short message (up to 60 characters). It appears for a few seconds at the side of the TV, next to the sender's name.

- Messages are filtered on the server before being shown, like nicknames (E11-04)
- One message every 5 seconds per player at most (anti-spam)
- The host can turn table talk off

## Controllers used

| Moment | What the phone shows | Platform components |
| --- | --- | --- |
| Any time (table talk) | Text field + send button, behind a small *Chat* button | Text input |
| *Red or Black* deal | 2 to 4 large answer buttons | Multiple choice |
| Memorise | The player's 4 cards for 20 seconds, then 4 face-down cards | Game display (private message) |
| Table time | *"I have one!"* and *Pass* buttons + own hand (face down) | Buttons |
| Hand out | One row per player with − / + and a *Confirm* button | Buttons (possibly a new *counter* component, to check with E6) |
| Answer | *Accept* / *Liar!* | Multiple choice |
| Reveal | 4 slots to pick from | Multiple choice |
| Being targeted | Vibration | Vibration |

The controller changes several times during a round: it shows the platform's ability to **switch controllers in the middle of a game** (E6-05).

## What it shows about the platform

| Platform feature | Use in The Pyramid |
| --- | --- |
| Private messages (E7-06) | Each player's hand, sent to their phone only |
| Controller switching (E6-05) | Claim → hand out → answer → reveal, in every round |
| Game lifecycle and turns (E7-05) | 15 rounds with timed steps, scores, end of game |
| Server authority (E3-08) | The server deals, keeps every hand, checks every claim and reveal; a modified phone cannot see other hands or fake a card |
| Reconnection (E3-04) | A player who drops comes back with the same hand and the same score |
| Targeted vibration (E7-06) | Only the players who receive points feel it |
| Achievements (E11-03) | See below |

## Accessibility

The Pyramid is a candidate for the **game playable without sight** required by the subject (Ex-05).

- **Read aloud:** the TV announces every revealed card, claim, target and result. During memorisation, each phone reads its owner's cards aloud privately, through the phone's screen reader.
- **Screen readers:** every phone screen has labels for VoiceOver and TalkBack, such as "Card 2, face down" or "Pyramid, level 3, 8 of hearts".
- **Colour-blind modes:** suits always show their symbol and name; red and black are never carried by colour alone.
- **Slow mode:** every timer is doubled, including memorisation, claim and answer.
- **Table talk:** messages on the TV are also sent to phones, so screen reader users hear them.
- **Memory aid:** an *easy mode* option keeps cards visible on the phone, for players with memory or attention difficulties, or for younger players.
- **No flashing:** card reveals use a flip animation, never a flash, and can be turned off.
- **Vibration** can be turned off; important sounds have subtitles on the TV.
- **Touch targets** are at least 44 × 44 px, and the *"I have one!"* button fills most of the screen.

Declared accessibility features in the game manifest: text-to-speech, screen reader support, colour-blind modes, slow mode, memory aid, no flashing, vibration optional, subtitles.

## Achievements (ideas)

| Achievement | Condition |
| --- | --- |
| Poker face | Bluff on the top card without being caught |
| Lie detector | Call *Liar!* correctly 3 times in one game |
| Elephant memory | Reveal the right card every time you are challenged in a game (at least 2 challenges) |

## Art, sound and originality

- Original name, card designs, pyramid board and sounds made by the team, or free-licence assets credited in [`docs/CREDITS.md`](../CREDITS.md)
- No reference to an existing commercial game, brand or character

## Open questions

| # | Question | Recommendation |
| --- | --- | --- |
| 1 | **Drawing.** The subject expects the party game to demonstrate drawing, and the classic rules have none | Not decided yet. One idea: each player draws their **"poker face"** with a finger at the start, shown next to their name on the TV for the whole game |

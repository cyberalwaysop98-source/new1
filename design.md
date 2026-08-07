# DESIGN.md — NOIR

> Context file for Claude Code. Read this before touching any file in this repo.
> Every colour, size, easing and string in the build comes from this document.
> If something isn't specified here, ask before inventing it.

---

## 1. The brief

**NOIR (ノワール)** — a seven-seat *kissaten* (喫茶店) in Tomigaya, Tokyo. Dark wood, one
low light, hand-drip only. No music, no wifi, no second cup.

**The page has one job:** make someone who has never heard of this place feel the room, and
then book a seat. It is not a menu site. It is not a brand site. It is a slow, cinematic
descent that ends at a reservation.

**Voice:** declarative, short, slightly severe. Never "artisanal", "crafted", "journey",
"experience", "passion". Statements, not selling.

**Reference:** `https://www.alethia.earth/` — we are copying its *mechanics*, not its look.
Alethia is a climate-tech site: cold, blue-green, data-forward. NOIR is warm-black, analogue,
zero data. Section 2 maps exactly what carries over.

---

## 2. What we take from Alethia

| Alethia mechanic | NOIR equivalent | Where |
|---|---|---|
| Full-bleed looping `.webm` between content sections | Ambient loops: steam, roast drum, empty room | §6.3, §6.6 |
| Hero with background video + "Scroll to discover" cue | Hero with steam loop + 下へ / Scroll | §6.1 |
| Numbered 01–05 list revealing on scroll | The Method, 01–05 | §6.4 |
| Sticky pinned section, background holds, content swaps over it | The Ritual — pinned scrubbed sequence | §6.5 |
| Section label repeated 3× as a scroll marquee ("our vision") | 間 / ma repeated across the ambient break | §6.3 |
| Two-card solutions grid | The Room — two plates | §6.8 |
| Footer that reveals from underneath with its own video | Same, with the closing-time loop | §6.10 |
| Tiny wide-tracked eyebrow above an enormous heading | Same, everywhere | §4 |

**What we do NOT take:** Alethia's palette, its rounded UI cards, its floating dashboard
screenshots, its logo-wall, its blog cards. Those are B2B SaaS furniture.

---

## 3. Tokens

```css
:root{
  /* colour — 6 values, no others exist */
  --sumi:      #0B0A09;   /* page ground. warm black, never #000 */
  --sumi-2:    #14110E;   /* raised surface: footer, ambient fallback */
  --washi:     #E8E1D4;   /* primary text, brush strokes */
  --washi-dim: #8A8076;   /* secondary text, eyebrows, captions */
  --shu:       #8C2A1E;   /* vermilion lacquer — rules, seal, borders */
  --shu-lit:   #B33A25;   /* vermilion ink — accents only, never a fill */
  --rule:      rgba(232,225,212,.13);

  /* type */
  --display: 'Shippori Mincho', 'Hiragino Mincho ProN', Georgia, serif;
  --body:    'Zen Kaku Gothic New', 'Hiragino Sans', -apple-system, sans-serif;

  /* space */
  --gut: clamp(20px, 6vw, 96px);

  /* motion */
  --ease: cubic-bezier(.16, 1, .3, 1);
}
```

**Vermilion rules.** It is lacquer, not neon. Permitted: hairline rules, the seal, the liquid
in the sequence, one word of emphasis per section, the CTA underline. Forbidden: button fills,
glows, box-shadows, gradients-to-transparent, hover backgrounds, anything that makes it look
like a dark-mode SaaS accent.

**Radius is 0 everywhere.** One exception: the seal, at 2px.

**No shadows.** Depth comes from value and grain, not elevation.

**Two permitted colour literals outside this block.** "Six values, no others exist" governs
*design* colour — anything a viewer perceives as a chosen hue. These two are not that, and are
allowed to sit outside the token system. Nothing else may.

- `#808080` in `src/components/overlays.css` — **blend substrate.** Mid-grey is the identity
  value for `mix-blend-mode: overlay`; it is the surface the grain filter modulates, chosen so
  the overlay is neutral where the noise is neutral. Any other value would tint the whole page.
  It is arithmetic, not a colour decision.
- The colour literals in `src/lib/ritualProcedural.js` — **language boundary.** Canvas 2D takes
  colour strings and cannot read CSS custom properties; resolving them would mean a
  `getComputedStyle` call per frame inside the render loop, which is exactly what §9's 60fps
  scrub budget forbids. They mirror `--sumi`, `--washi` and `--shu` and must be updated by hand
  if those change.

Both sites carry a comment pointing back to this note. If a third exception is proposed, it is
almost certainly a token that should have been added here instead — ask first.

---

## 4. Typography

Shippori Mincho carries **both** the Latin and the Japanese. This is the single most important
decision in the design — a mincho setting Latin capitals is what stops this reading as a
generic dark serif site. Do not substitute a Western display serif.

| Role | Face | Size | Tracking | Case |
|---|---|---|---|---|
| Hero title | display 400 | `clamp(76px, 21vw, 300px)` / lh .82 | -0.02em | as-is |
| Section heading | display 400 | `clamp(24px, 3.2vw, 44px)` | 0 | Title |
| Manifesto line | display 400 | `clamp(26px, 4.4vw, 62px)` / lh 1.34 | 0 | Sentence |
| Statement (footer, reserve) | display 400 | `clamp(34px, 5.6vw, 84px)` / lh 1.06 | -0.015em | Sentence |
| Eyebrow / label | body 300 | 10px | 0.34em | UPPER |
| Body / caption | body 300 | 12.5–13px / lh 2 | 0.02em | Sentence |
| Menu name | display 400 | `clamp(19px, 2vw, 27px)` | 0 | as-is |
| Price | body 300, `tnum` | 14px | 0 | — |
| Vertical rail (tategaki) | display 400 | 11px | 0.55em | JP only |

The tension in this design is **giant mincho against 10px tracked-out labels**. Nothing sits
in the middle. Avoid 16–20px display type entirely.

Japanese never gets translated inline with a slash-gloss more than once per section. `間 — the
interval` is fine. `珈琲 (coffee)` is not.

### 4.1 Font loading

Both faces are self-hosted, subset, and preloaded. No Google Fonts CDN request in the
production build.

- **Subset scope:** Latin basic (the glyphs needed for the English copy in §6, including
  small caps and punctuation actually used — no full Latin Extended) plus only the kana and
  kanji that appear in §6's copy (hero, manifesto, section labels, menu, footer). Do not ship
  the full JIS character set for either face — regenerate the subset whenever §6 copy changes.
- **Format:** `woff2` only. No `woff`, no `ttf` fallback — the browser support matrix for this
  build does not need it.
- **Hosting:** `public/fonts/`, referenced with relative `@font-face src: url(...)`. No
  third-party font host in the critical path.
- **Loading strategy:** `font-display: swap`, with a `<link rel="preload" as="font" type="font/woff2" crossorigin>`
  for the two weights used above the fold (display 400, body 300) in `index.html`. Everything
  else loads lazily.
- **Metrics-matched fallback:** each face gets a `size-adjust` / `ascent-override` /
  `descent-override` / `line-gap-override` fallback so the swap does not reflow the layout
  (this is also how CLS stays at 0 through a webfont swap per §9):
  - Shippori Mincho → fallback stack `Georgia, serif`, metrics-matched.
  - Zen Kaku Gothic New → fallback stack `-apple-system, 'Hiragino Sans', sans-serif`,
    metrics-matched.

```css
@font-face{
  font-family: 'Shippori Mincho';
  src: url('/fonts/shippori-mincho-subset.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
@font-face{
  font-family: 'Shippori Mincho Fallback';
  src: local('Georgia');
  size-adjust: 112%;
  ascent-override: 92%;
  descent-override: 28%;
  line-gap-override: 0%;
}
:root{ --display: 'Shippori Mincho', 'Shippori Mincho Fallback', Georgia, serif; }

@font-face{
  font-family: 'Zen Kaku Gothic New';
  src: url('/fonts/zen-kaku-gothic-new-subset.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
@font-face{
  font-family: 'Zen Kaku Gothic New Fallback';
  src: local('-apple-system'), local('Helvetica Neue'), local('Arial');
  size-adjust: 100%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
:root{ --body: 'Zen Kaku Gothic New', 'Zen Kaku Gothic New Fallback', -apple-system, 'Hiragino Sans', sans-serif; }
```

```html
<link rel="preload" href="/fonts/shippori-mincho-subset.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/zen-kaku-gothic-new-subset.woff2" as="font" type="font/woff2" crossorigin>
```

**Known LCP risk — the interim Google Fonts CDN link.** The build currently loads both faces
from the Google Fonts CDN via a `<link>` in `index.html`, because the subset `.woff2` files
above do not exist yet. This is not a cosmetic shortcut, it is a direct threat to the ≤ 2.0s
LCP in §9:

- The hero title *is* the LCP element (§9), and it is set in Shippori Mincho. Its paint is
  therefore gated on a webfont that arrives over a third-party origin.
- The CDN adds a DNS lookup, TLS handshake and an extra round trip on a connection the browser
  has not already opened, and serves a full unsubset face rather than the §6-scoped subset.
- `font-display: swap` keeps text visible, but the metrics-matched fallback is tuned for the
  subset faces — the swap-in from an unsubset CDN face is where layout shift creeps back and
  threatens CLS = 0.

**This must be replaced with the self-hosted subsets before Phase 5 exits.** Phase 5 cannot be
signed off with the CDN link still in `index.html`, regardless of what the measured numbers say
on a warm local connection — a passing LCP measured against a cached CDN font is not evidence
the budget holds for a first-time visitor.

---

## 5. Layout

- Single column, `--gut` side padding, no max-width container. Content blocks set their own
  `max-width` in `ch`.
- Asymmetry is the rule: manifesto lines alternate flush-right / flush-left. Section heads are
  `space-between` baseline-aligned pairs (heading left, eyebrow right).
- Vertical rhythm is in `vh`, not px. Section padding: `20vh` minimum, `34vh` for the manifesto.
  The empty space *is* the design — do not compress it to fit more on screen.
- Persistent chrome: fixed nav (`mix-blend-mode: difference`), fixed vertical tategaki rail on
  the right with a scroll-progress hairline. Rail hides under 820px.
- Global overlays: film grain (SVG turbulence, opacity .055, `mix-blend-mode: overlay`) and a
  radial vignette. Both `position: fixed`, `pointer-events: none`.

---

## 6. Page architecture

Ten sections, in this order. Each lists the assets it needs and its motion contract.

### 6.1 Hero
```
┌──────────────────────────────────────────────┐
│ TOKYO · 喫茶室  ──  EST. 2019                 │
│                                              │
│   NOIR                          ノ           │
│                                 ワ           │
│                                 ル           │
│   We keep the room dark on purpose.          │
│   Light flatters coffee — shadow tells       │
│   the truth about it.                        │
│                                              │
│ │ 下へ / SCROLL              七席のみ         │
└──────────────────────────────────────────────┘
```
- **Assets:** `video/hero.webm|mp4` + `img/hero-poster.webp`. Loop plays at 22% opacity behind
  the type, `object-fit: cover`, muted/loop/playsinline.
- **Motion:** on load, title + kana + lede rise from `yPercent: 110` behind an overflow mask,
  1.5s `power3.out`, 90ms stagger. Scroll cue hairline drops on a 2.6s infinite loop.
- **LCP constraint:** the title must paint before the video. Video is `preload="none"` and
  fades in at 800ms.

### 6.2 Manifesto
Three lines, `34vh` padding top and bottom, `26vh` between lines. Alternating alignment.

1. There is no music, no wifi, and no second cup.
2. The beans are ground when you sit down, not before.
3. What arrives will take **four minutes**. Please let it.

- **Motion:** each line masked, `yPercent: 105 → 0`, 1.4s, trigger `top 88%`. One at a time —
  they must never both be moving.

### 6.3 間 — ambient break I
Full-bleed 100svh video loop, hairline border top and bottom. Over it, a horizontal marquee
of six tokens, alternating outline and solid: `間`(outline) `ma`(solid) `間`(outline)
`ma`(solid) `間`(outline) `ma`(solid) — i.e. every 間 is outlined
(`-webkit-text-stroke: 1px`) and every `ma` is solid fill, six tokens total, no more, no fewer.
Caption bottom-left.

> 間 — the interval. Not empty space, but the pause that gives the next thing its weight.
> We build the room around it.

- **Assets:** `video/ma.webm|mp4` + poster.
- **Motion:** marquee `xPercent: -34` scrubbed across the section. Video scales `1.25 → 1.0`
  scrubbed. No text reveal — it's already moving.

### 6.4 The Method — 01 to 05
Alethia's numbered list, adapted. Left column sticks; right column scrolls the five items past it.

| № | Title | Line |
|---|---|---|
| 01 | Single origin, single lot | We buy one lot at a time and stop when it's gone. |
| 02 | Roasted over binchōtan | Charcoal, not gas. It is slower and it is worse for business. |
| 03 | Ground at the seat | Nothing is ground in advance. You will hear it. |
| 04 | Ninety-two degrees | Held thirty seconds off the boil so it does not scorch on contact. |
| 05 | Four minutes, three pours | Each smaller than the last. The bed sits flat when it's done. |

- **Motion:** left heading holds for the duration via CSS `position: sticky` — **not** a GSAP
  pin. One pinning mechanism per page: the Ritual (§6.5) owns the page's only ScrollTrigger
  pin, and a second pinned trigger competing for pin-spacing calculations through the Lenis
  bridge is where this pattern breaks. Sticky is visually equivalent for a single always-in-flow
  column and costs nothing. Items stagger in at `top 82%`, 80ms apart, with the number in
  `--shu-lit` and a hairline rule that draws left-to-right over 1.2s.

### 6.5 The Ritual — pinned scrub sequence ★ signature
The centrepiece. Pinned for `+=340%` of viewport height. **Full-bleed: the sequence is the
whole viewport, and the type sits on it.**

```
┌──────────────────────────────────────────────┐
│▒▒▒                                           │
│▒▒ 抽出                                       │
│▒▒ Four minutes            [ the sequence,    │
│▒▒ 四分間                    100vw × 100svh,  │
│▒▒                           edge to edge ]   │
│▒▒                                            │
│▒▒ 92°C                                       │
│▒▒ 一 湯                                      │
│▒▒▒                                           │
└──────────────────────────────────────────────┘
  ▒ = scrim: linear-gradient(90deg, rgba(11,10,9,.75), transparent)
```

The sequence fills the viewport behind everything — no framed box, no bordered stage, no
column grid. **A dripper centred in a box reads as a product photo**, which is exactly the
stock-café failure §10 exists to prevent; full-bleed is what makes it a room instead of a
product.

- **Type over footage:** `抽出 / Four minutes / 四分間` pinned top-left, the step captions
  bottom-left, both inside `--gut`. All type sits on a **vertical scrim** — a left-to-right
  gradient from `rgba(11,10,9,.75)` to transparent, spanning the full height. The scrim is a
  gradient, never a box, card, or panel; it has no edge, no border and no corner. It exists so
  the type stays legible over a moving image, nothing more.
- **All type is on the left.** Nothing sits at the right edge: the tategaki rail (§5) and the
  scrollbar both live there, and caption text collides with them. `92°C` moves to the left
  column with the captions.
- **Assets:** `frames/ritual/ritual_0001.webp` … `ritual_0120.webp`, 1440×2160, WebP q75,
  99.6 KB average. Produced in Flow — see WORKFLOW.md §Phase 0. Actual figures in §8; the
  frame count is read from `FRAMES` in `src/assets/manifest.js`, never hardcoded.

> **1440px is the native ceiling — do not scale above it.** The cropped source is exactly
> 1440×2160, so any larger export is pure upscale carrying **no additional real detail**, only
> weight. A 1920px pass was produced and measured (132.9 KB average, 15.57 MB total) and
> discarded for exactly that reason: 33% more bytes for zero more picture. If the sequence ever
> looks soft edge-to-edge at wide viewports, the fix is a higher-resolution source clip, not a
> bigger export.

> **The two source clips share their joining frame.** Video 1's last frame and video 2's first
> frame are the same moment, so video 2's first frame is trimmed before concatenation
> (`trim=start_frame=1`) and extraction runs in ONE pass across the joined clip so frames
> distribute evenly. Verified: luminance across the seam is continuous (33.041 → 33.007 YAVG),
> and consecutive-frame SSIM at the join (0.928) is *higher* than the sequence's typical
> frame-to-frame similarity (0.90–0.92), i.e. no hitch.
>
> Do not judge the seam with a naive per-pixel comparison. Raw SSIM between the two joining
> frames is only 0.768 against an in-clip adjacent-frame baseline of 0.985 — not because the
> clips fail to meet, but because they were encoded independently and SSIM punishes differing
> compression noise severely on near-black frames. The luminance continuity and the best-match
> peak landing exactly at `v1[last] ↔ v2[first]` are the reliable signals.

> **Do not re-run `cropdetect` on the Ritual source and "fix" the crop.** It does not work on
> this footage, and the reason is the brief itself. §Phase 0 requires 70% of the frame in
> shadow, which puts actual image brightness at **20–27** — inside `cropdetect`'s default
> `limit=24` border threshold, so it eats real picture and reports a different crop depending on
> how bright that part of the clip happens to be. Two windows of the same clip disagreed by
> 268px on width. Dropping the limit does not help either: at `limit=1`, `2` and `6` the
> padding's own compression noise reads as content and it returns the full frame. **No limit
> value separates image from padding on this material.**
>
> The crop in use — `crop=1440:2160:1200:0` — was derived by measuring the column brightness
> profile and confirmed visually against a brightened, grid-overlaid frame: symmetric 1200px
> pillarbox bars around a 1440×2160 image, which is exactly the 2:3 aspect of the source stills
> Veo padded. It is correct. It is not what `cropdetect` reports, and that is expected.
- **Implementation:** `<canvas>`, single `render(p)` function, `p` from `ScrollTrigger.progress`.
  `drawImage(images[Math.round(p * (FRAMES - 1))], 0, 0, W, H)`, where `FRAMES` is the frame
  count exported from the asset manifest (`src/assets/manifest.js`) — never hardcode the frame
  count in the component. Preload frames 1–12 eagerly, the rest lazily when the section enters
  at `top bottom`.
- **Canvas fit:** `cover`, centre-anchored, with a 12% safe area inset on all four sides of the
  source frame — the subject (dripper, bloom, drips) must sit inside that inner 76%×76% region
  so a `cover` crop at any supported viewport (§9: 360px–2560px) never clips it. This framing
  constraint applies to how the source frames are shot/cropped in Phase 0 (see WORKFLOW.md
  §0.1), not just to the canvas math.
- **Do not** scrub a `<video>` element's `currentTime`. It stutters on Safari and iOS and will
  ruin the one moment the whole page is built around.
- **Captions:** three steps cross-fade across thirds of the progress — 一 湯 / 二 蒸らし /
  三 抽出. Opacity ramps `clamp(min(local*4, (1-local)*4))`, y offset `(1-o)*22`. They occupy
  the **same** bottom-left position and fade through one another — they are not a stacked list
  of three, or nothing is cross-fading.

### 6.6 Ambient break II — the roast
Same construction as 6.3, `70svh`, no marquee. Single caption right-aligned:
> Binchōtan. Twelve minutes. By ear.

- **Assets:** `video/roast.webm|mp4` + poster.

### 6.7 The Selection
Five menu rows. Hairline between each. No photographs.

| Name | Notes | Price |
|---|---|---|
| 黒 *Kuro* | Ethiopia Guji, natural — bergamot, dark plum, cocoa nib | ¥1,400 |
| 霧 *Kiri* | Colombia Huila, washed — white peach, lemon peel, cane | ¥1,300 |
| 炭 *Sumi* | House roast over binchōtan — burnt sugar, walnut, smoke | ¥1,100 |
| 氷出し *Kōridashi* | Ice drip, eight hours unattended — clarified, almost weightless | ¥1,600 |
| 抹茶 *Matcha* | Uji, stone-milled that morning — whisked, no sugar, served warm | ¥1,200 |

- **Motion:** rows stagger in 80ms apart. Hover: `padding-left: 0 → 22px` over 0.7s, price
  shifts to `--shu-lit`. Rows are `<button>` elements — keyboard focusable, visible focus ring.

### 6.8 The Room
Two plates, Alethia's card pair. Full-width stills, heavy crop, caption underneath in 10px
tracked labels.

- **Assets:** `img/room-01.webp` (the counter), `img/room-02.webp` (the lamps).
- **Motion:** each plate enters at `scale 1.12 → 1.0` with `clip-path` wipe from the bottom,
  1.4s. Parallax `yPercent: -8` scrubbed while in view.

### 6.9 Reserve
```
┌──────────────────────────────────────────────┐
│ 予約 / RESERVE          WALK-INS AFTER 15:00 │
│                                              │
│ Sit down.        HOURS          ┌────┐       │
│ Say nothing.     Wed–Sun        │ 黒 │       │
│                  08:00–19:00    └────┘       │
│ BOOK A SEAT →    Closed Mon,Tue              │
└──────────────────────────────────────────────┘
```
Address: 2-14-6 Tomigaya, Shibuya-ku, Tokyo 151-0063.
The seal is a 104px vermilion-bordered square containing 黒 — the only enclosed shape on the
entire page.

### 6.10 Footer reveal
`position: fixed; bottom: 0; height: 74svh; z-index: 0`, with the content wrapper at `z-index: 1`
and `margin-bottom: 74svh`. Contains `video/close.webm` at low opacity, an outlined NOIR at
`clamp(58px, 17vw, 240px)`, a hairline, and one row of links.

---

## 7. Motion system

Every animation in the build uses these. No exceptions, no per-component improvisation.

| | Value |
|---|---|
| Ease | `cubic-bezier(.16, 1, .3, 1)` — GSAP `power3.out` |
| Reveal duration | 1.2–1.5s |
| Hover / micro | 0.6–0.7s |
| Stagger | 80ms |
| Image enter | `scale 1.12 → 1.0` |
| Text enter | masked `yPercent 105 → 0` |
| Scrub value | `1.1` (never `true`, except under reduced-motion) |
| Bounce / elastic / back | **never** |

**Stack:**
```
vite + react 19
├── lenis                 smooth scroll, lerp 0.075
└── gsap + ScrollTrigger  pin, scrub, parallax, all reveals
```
No component animation library. Micro-interactions (hover, focus, small state changes) are
plain CSS `transition`, using the durations and ease from the table above. GSAP/ScrollTrigger
owns everything that is scroll-driven or a page-load reveal; CSS owns everything that is a
direct response to user input on a static element.

**Lenis ↔ ScrollTrigger bridge** (this is where pinning usually breaks):
```js
const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

**Reduced motion:** grain animation off, scroll cue static, all scrubs → `true`, all reveal
tweens → `duration: 0` with final state applied. The page must remain fully readable.

The Ritual (§6.5) does not simply collapse its scrub to `true` on a `+=340%` pin — that would
leave a nearly-static 3.4-viewport-tall section with nothing happening in it, which fails
"fully readable" as badly as a broken animation would. Under reduced motion the Ritual pin
shortens to `+=100vh` and renders three static keyframes (one per caption: 一 湯, 二 蒸らし,
三 抽出) with all three captions visible simultaneously, not cross-fading. It is a short,
legible, non-animated triptych — never a 340%-tall no-op.

---

## 8. Asset manifest

| Path | Spec | Budget |
|---|---|---|
| `public/video/hero.webm` + `.mp4` | 8s loop, 1600px wide, muted, seamless | 1.2 MB |
| `public/video/ma.webm` + `.mp4` | 8s loop | 1.2 MB |
| `public/video/roast.webm` + `.mp4` | 6s loop | 1.0 MB |
| `public/video/close.webm` + `.mp4` | 6s loop | 800 KB |
| `public/img/*-poster.webp` | first frame of each loop | 40 KB ea |
| `public/frames/ritual/ritual_0001–0120.webp` | **1440×2160, q75** (actual) | **99.6 KB avg (82.6–130.8), 11.67 MB total** (actual) |
| `public/img/room-01.webp`, `room-02.webp` | 2000px wide | 220 KB ea |

**Every video:** `muted loop playsinline preload="none"` with a `poster`. Never autoplay with
sound. Never let a black rectangle sit where a video hasn't loaded — the poster covers it.

**Ritual frames — measured, not estimated.** The row above is the real output of the Phase 0
extraction, not a target.

- **Two source clips**, each 3840×2160 / 24fps / 192 frames / 8.000s. Video 2's first frame is
  trimmed as a shared join frame, giving 383 frames across 15.958s, concatenated and extracted
  in a single pass so frames distribute evenly across the seam.
- `fps=7.5` over 15.958s lands **exactly 120 frames** — a ~3.2:1 downsample of the source, so
  every output frame is a genuine source frame and none is duplicated.
- **1440×2160 at q75: 99.6 KB average (82.6–130.8), 11.67 MB total.** Native resolution, no
  upscale — see the ceiling note in §6.5.

> **The old 60 KB/frame and 7 MB totals no longer apply.** They were written for a boxed stage;
> the sequence is now full-bleed (§6.5) and carries the entire viewport, so it is the single
> heaviest thing on the page by a wide margin. 11.67 MB is **not** inside any budget previously
> written here, and it is not covered by §9's JS budget either — the frames are lazy-loaded
> after the eager first twelve and never block LCP. What it does affect is data cost on mobile
> and time-to-smooth-scrub on a cold connection. The remaining lever is quality, not size: q75
> is the current setting and dropping it has not been tried at 1440px. Resolution is already at
> the source ceiling and must not be traded further.

---

## 9. Budgets and quality floor

- LCP ≤ 2.0s. The hero title is the LCP element — it is type, not media.
- Initial JS ≤ 120 KB gzipped. Ritual frames are not part of initial load.

  The budget is set from what the stack actually costs, not from an aspiration:
  - **React + react-dom ≈ 45 KB gzipped, and is not negotiable.** It is the framework the
    project is built on; trimming it means a different project, not a smaller bundle.
  - **GSAP + ScrollTrigger ≈ 30 KB gzipped, and buys all page motion** — every pin, scrub,
    parallax and reveal in §6 and §7. Nothing else in the stack does that work; this is a
    load-bearing 30 KB, not overhead.
  - Lenis and application code make up the remainder.

  **LCP is the budget that governs here.** The byte count is a proxy; the real constraint is
  the ≤ 2.0s LCP above, and the hero title paints as type before any of this JS is needed.
  If a change trades bytes for a faster LCP, take it. If a change buys bytes back but delays
  the title, reject it.
- CLS = 0. Every media element has explicit dimensions or aspect-ratio.
- 60fps during the pinned scrub on a mid-range Android. If it drops, cut frame count to 90
  before you cut anything else.
- Keyboard: nav, menu rows, and CTA all reachable with a visible `1px solid var(--shu-lit)`
  focus ring at `6px` offset.
- Responsive to 360px. Below 900px the Ritual stacks to one column; below 820px the rail hides.
- Colour contrast: `--washi-dim` on `--sumi` is the floor — do not go dimmer for anything a
  user needs to read.

---

## 10. Anti-patterns

Reject these in review, they are the failure modes for this specific design:

- Vermilion used as a glow, fill, or gradient → it becomes a generic dark-mode SaaS site.
- A Western display serif replacing Shippori Mincho → loses the only distinctive type decision.
- Photographs of coffee cups, latte art, or hands holding mugs → instant stock-photo café.
- Rounded corners, drop shadows, glassmorphism, or any card with a background colour.
- Compressing `vh` padding to "fit more content" → the emptiness is the product.
- Scrubbing a `<video>` element instead of frames.
- Adding a testimonials section, a logo wall, an Instagram grid, or a newsletter modal.
- More than one animation moving at any given moment.
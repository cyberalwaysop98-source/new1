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
| Full-bleed looping `.webm` between content sections | Ambient loops: steam, roast drum, empty room | §6.3, §6.5 |
| Hero with background video + "Scroll to discover" cue | Hero with steam loop + 下へ / Scroll | §6.1 |
| Numbered 01–05 list revealing on scroll | The Method, 01–05 | §6.4 |
| Sticky pinned section, background holds, content swaps over it | The Ritual — pinned scrubbed sequence | §6.2 |
| Section label repeated 3× as a scroll marquee ("our vision") | 間 / ma repeated across the ambient break | §6.3 |
| Two-card solutions grid | The Room — two plates | §6.7 |
| Footer that reveals from underneath with its own video | Same, with the closing-time loop | §6.9 |
| Tiny wide-tracked eyebrow above an enormous heading | Same, everywhere | §4 |

**What we do NOT take:** Alethia's palette, its rounded UI cards, its floating dashboard
screenshots, its logo-wall, its blog cards. Those are B2B SaaS furniture.

---

## 3. Tokens

```css
:root{
  /* colour — 6 values, no others exist */
  --sumi:      #0B0A09;   /* page ground. warm black, never #000 */
  --sumi-2:    #1C1815;   /* raised surface: Room bands, ambient fallback */
  --washi:     #E8E1D4;   /* primary text, brush strokes */
  --washi-dim: #A39A8B;   /* secondary text, eyebrows, captions. 7.11:1 on --sumi */
  --shu:       #8C2A1E;   /* vermilion lacquer — rules, seal, borders */
  --shu-lit:   #B33A25;   /* vermilion ink — accents only, never a fill */
  --rule:      rgba(232,225,212,.20);

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

**`--washi-dim` was lifted from `#8A8076` to `#A39A8B`.** At the old value body copy measured
**5.1:1** against `--sumi` — WCAG AA, but below AAA, and at 13px it read as thin rather than
quiet. The new value measures **7.11:1**, clearing AAA for body text. The hue relationship is
unchanged (same warm grey, R>G>B); only the value moved. §9's rule still stands: this is the
floor, nothing a reader needs may go dimmer.

**The neutrals were warmed and lifted.** `--sumi` and the two vermilions are untouched — the
ground stays warm black and the accent stays lacquer. What changed is the middle of the scale,
which was so close to the ground that raised surfaces and hairlines had no presence at all: a
surface you cannot see is not a surface, it is a rounding error.

| | before | after |
|---|---|---|
| `--sumi-2` surface vs ground | 1.05:1 | **1.12:1** |
| `--rule` hairline vs ground | 1.31:1 | **1.62:1** |

`--sumi-2` went `#14110E → #1C1815` and `--rule` went `.13 → .20` alpha, compositing
`#282623 → #373532`. Both keep the warm R>G>B relationship; only value moved.

**What it costs.** Text on the raised surface loses a little contrast, because the surface came
up to meet it. `--washi` on `--sumi-2` goes 14.47:1 → **13.56:1**, and `--washi-dim` goes
6.77:1 → **6.34:1**. That second figure is comfortably AA but below AAA, and the only place it
applies is the `--washi-dim` label on a Room band. On the ground itself nothing moved:
`--washi` 15.21:1, `--washi-dim` 7.11:1 — §3's AAA floor is intact where the body copy lives.
If the Room label must reach AAA, the fix is to set it in `--washi` on the band, not to push
`--sumi-2` back down.

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
| Eyebrow / label | body 300 | **11px** | 0.34em | UPPER |
| Body / caption | body **400** | **14px** / lh 2 | 0.02em | Sentence |
| Menu name | display 400 | `clamp(19px, 2vw, 27px)` | 0 | as-is |
| Price | body **400**, `tnum` | 14px | 0 | — |
| Vertical rail (tategaki) | display 400 | 11px | 0.55em | JP only |

The tension in this design is **giant mincho against 11px tracked-out labels**. Nothing sits
in the middle. Avoid 16–20px display type entirely.

**Body/caption is 14px weight 400**, raised from 12.5–13px weight 300. Against display type at
80px, 300 weight at 13px read as *thin* — and thin is not the same as quiet. Quiet is the
intent. Widening the body does not soften the display-to-label contrast, it just makes the
readable text readable.

**The eyebrow is 11px**, raised from 10px. It previously stayed at 10px on the argument that the
giant-display-to-tiny-label jump is carried by the label. That argument survives at 11px — the
jump is from 300px to 11px — but 10px at `0.34em` tracking did not survive contact with a real
screen. Tracking is unchanged, so the label keeps its width and its character.

**No caption-class text sits below 14px.** Three 13px holdouts were raised: `.method__num`,
`.room__jp`, `.selection__romaji`. The **vertical rail stays at 11px** — it is a label, not
running copy, and after this change it matches the eyebrow exactly, which is the size relation
it should have had all along. Setting a vertically-composed rail at 14px would widen the rail
and pull it toward the middle ground this scale explicitly excludes.

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
  for the **three** faces used above the fold in `index.html`: display 400, body 300 (eyebrows)
  and body 400 (the hero lede, since body copy moved to weight 400). Everything else loads
  lazily. If a weight is used above the fold and not preloaded, it swaps in late and the
  metrics-matched fallback is doing more work than it should.
- **Metrics-matched fallback:** each face gets a `size-adjust` / `ascent-override` /
  `descent-override` / `line-gap-override` fallback so the swap does not reflow the layout
  (this is also how CLS stays at 0 through a webfont swap per §9):
  - Shippori Mincho → fallback stack `Georgia, serif`, metrics-matched.
  - Zen Kaku Gothic New → fallback stack `-apple-system, 'Hiragino Sans', sans-serif`,
    metrics-matched.

```css
/* Shipped values — see src/styles/fonts.css. The overrides below are MEASURED
   (real face's average advance vs the fallback's, vertical metrics from the real
   face's hhea divided by that size-adjust), not estimated. */
@font-face{
  font-family: 'Shippori Mincho';
  src: url('/fonts/shippori-mincho-subset.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
@font-face{
  font-family: 'Shippori Mincho Fallback';
  src: local('Georgia'), local('Times New Roman');
  size-adjust: 106.11%;
  ascent-override: 109.33%;
  descent-override: 27.14%;
  line-gap-override: 0%;
}
:root{ --display: 'Shippori Mincho', 'Shippori Mincho Fallback', Georgia, serif; }

/* Two weights: 300 above the fold, 400 for menu names. */
@font-face{
  font-family: 'Zen Kaku Gothic New';
  src: url('/fonts/zen-kaku-gothic-new-300-subset.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
@font-face{
  font-family: 'Zen Kaku Gothic New Fallback';
  src: local('Arial'), local('Helvetica Neue');
  size-adjust: 92.85%;
  ascent-override: 124.93%;
  descent-override: 31.02%;
  line-gap-override: 0%;
}
:root{ --body: 'Zen Kaku Gothic New', 'Zen Kaku Gothic New Fallback', -apple-system, 'Hiragino Sans', sans-serif; }
```

```html
<link rel="preload" href="/fonts/shippori-mincho-subset.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/zen-kaku-gothic-new-subset.woff2" as="font" type="font/woff2" crossorigin>
```

**Resolved in Phase 5 — the CDN is gone.** Both faces are now self-hosted subsets and no
request leaves the origin. Measured on the production build:

| | before (CDN) | after (subset) |
|---|---|---|
| LCP element | `SPAN.footer__mark` | **`[data-reveal="title"]` in `#hero`, text "NOIR"** |
| LCP time | 120 ms | **92–108 ms** |
| Third-party hosts | fonts.googleapis, fonts.gstatic | **none** |
| Font bytes | full unsubset faces over a cross-origin round trip | **36.5 KB** total |

- `shippori-mincho-subset.woff2` — 19.9 KB, `zen-kaku-gothic-new-300-subset.woff2` — 8.2 KB,
  `zen-kaku-gothic-new-400-subset.woff2` — 8.4 KB. Only the first two are preloaded: they are
  the weights above the fold.
- **125 glyphs**: printable ASCII plus 30 non-ASCII — the kana and kanji in §6 copy, `ō` for
  *Kōridashi* and *binchōtan*, `¥`, `·`, the dashes and `→`. Derived by scanning the source, not
  hand-listed. **Regenerate whenever §6 copy changes** — a missing glyph falls back mid-word.
- Fallback overrides are **measured**, not estimated: the real face's average advance over
  `[A-Za-z0-9 .,]` against the local fallback's gives `size-adjust`, and the vertical overrides
  come from the real face's own hhea metrics divided by it. Shippori→Georgia 106.11%,
  Zen Kaku→Arial 92.85%. CLS across the swap measures 0.

---

## 5. Layout

- Single column, `--gut` side padding, no max-width container. Content blocks set their own
  `max-width` in `ch`.
- Asymmetry is the rule: manifesto lines alternate flush-right / flush-left. Section heads are
  `space-between` baseline-aligned pairs (heading left, eyebrow right).
- Vertical rhythm is in `vh`, not px. **Section padding is a uniform `20vh`.** The empty space
  *is* the design — do not compress it to fit more on screen.

  > Amended in Phase 6 to match what was built. This previously read "`20vh` minimum, `34vh`
  > for the manifesto", setting up a contrast between the manifesto and everything else. That
  > contrast no longer has anywhere to live: the manifesto is a **pinned viewport** (§6.2), not
  > a padded block, so it has no block padding at all. Measured on the build, every content
  > section carries exactly `180px` top and bottom at a 900px viewport. Uniform 20vh is the
  > real rhythm — the spec now says so rather than describing a build that does not exist.
- Persistent chrome: fixed nav (`mix-blend-mode: difference`), fixed vertical tategaki rail on
  the right with a scroll-progress hairline. Rail hides under 820px.
- **Nav contents:** `NOIR` at the left; `Selection`, `The Room`, `予約 / Reserve` at the right,
  all at eyebrow scale (11px, 0.34em, upper). Hover is an opacity transition only — a colour
  change would fight the difference blend, which is already inverting whatever sits behind it.
  **Links scroll through Lenis**, never a native anchor jump: a native jump bypasses the smooth
  scroll and lands without emitting the scroll events ScrollTrigger listens on, so pins and
  scrubs arrive in the wrong state. Below 640px only the reservation link survives — four items
  do not fit at that tracking, and the reservation is the one §1 says the page exists for.
- Global overlays: film grain (SVG turbulence, opacity .055, `mix-blend-mode: overlay`) and a
  radial vignette. Both `position: fixed`, `pointer-events: none`.

---

## 6. Page architecture

Ten sections, in this order. Each lists the assets it needs and its motion contract.

### 6.1 Hero
```
┌──────────────────────────────────────────────┐
│                                     ~~~      │
│   There is no music,             ((dripper)) │
│   no wifi, and no                   |||      │
│   second cup.                    \_______/   │
│                                   \_____/    │
│  [ type on the dark LEFT half ]  [ subject ] │
└──────────────────────────────────────────────┘
   full-bleed COVER, edge to edge, no bleed
```
- **Assets:** `video/hero.webm|mp4` + `img/hero-poster.webp`. Loop plays at 22% opacity behind
  the type, `object-fit: cover`, muted/loop/playsinline.
- **Motion:** on load, title + kana + lede rise from `yPercent: 110` behind an overflow mask,
  1.5s `power3.out`, 90ms stagger. Scroll cue hairline drops on a 2.6s infinite loop.
- **LCP constraint:** the title must paint before the video. Video is `preload="none"` and
  fades in at 800ms.

### 6.2 The Manifesto, scrubbed ★ signature

The centrepiece, and now the only pinned section. The frame sequence and the three manifesto
lines share **one** timeline: the coffee fills the carafe as the text arrives. Pinned for
`+=340%` of viewport height.

```
┌──────────────────────────────────────────────┐
│              ┌──────────────┐                │
│              │              │  There is no   │
│              │   2:3 frame  │  music, no     │
│   sumi       │  full height │  wifi, and no  │
│   bleed      │   contain    │  second cup.   │
│              │   never      │                │
│  The beans   │   cropped    │                │
│  are ground  │              │                │
│              └──────────────┘                │
└──────────────────────────────────────────────┘
   line 1 right · line 2 left · line 3 right
```

**The source is 16:9 landscape, so the fit is `cover`** — full-bleed, edge to edge. The
composition does the work: the subject sits in the right half and the left half is near-black,
so the type overlays that dark half and never touches the dripper. At 1440×900 cover crops only
~5% a side, so almost nothing is lost.

**No scrim.** Tested rather than assumed: the measured luminance of the footage directly under
the type peaks at **16/255** across a 61-point sweep of the pin. Against `--washi` (#E8E1D4)
that is roughly 14:1 contrast — past WCAG AAA — so a gradient would darken an already-black
region for nothing. If the footage is ever regraded brighter, re-measure before adding one.

> **The narrow branch requires its own portrait crop set. This is not optional.**
>
> Below `NARROW_BREAKPOINT` (900px) the section serves a **second frame set, cropped 4:5 around
> the subject** from the same source clip with the same grade —
> `crop=576:720:640:0`, in `public/frames/ritual-portrait/`. Neither alternative works with a
> 16:9 master:
>
> - **Contain the 16:9 frame** and a 360×780 phone gets a 360×203 strip with roughly **two
>   thirds of the viewport left as empty ground**. That is not §10's productive emptiness, it
>   reads as a broken layout — measured and rejected.
> - **Cover at 360** and the frame shows only the **middle ~26% of the width**, which cuts
>   straight through the dripper. Rejected: the subject is the one thing that may not be
>   cropped.
>
> The 4:5 crop is the only option that keeps the subject whole *and* fills the phone viewport.
> Layout is unchanged from the treatment already described: full width, top-anchored, type in
> the band beneath, alternating flush-left/right.
>
> **One predicate drives both** the frame set and the layout mode, so they can never disagree.
> The contained height is also capped at 60% of the viewport, so a landscape phone cannot
> compute a taller-than-viewport frame and push the type off screen.
>
> Any new source clip must be extracted **twice** — the landscape master and this portrait crop.
> The crop offset is subject-dependent: derive it by measuring the subject's horizontal extent,
> do not reuse `640` blindly.

- **Copy** (unchanged, verbatim):
  1. There is no music, no wifi, and no second cup.
  2. The beans are ground when you sit down, not before.
  3. What arrives will take **four minutes**. Please let it.
- **Type:** manifesto sizing from §4 — `clamp(26px, 4.4vw, 62px)` mincho, lh 1.34. **Do not
  shrink it to fit the margin.** If a line will not fit, the margin is wrong, not the type.
- **Alternating:** line 1 flush-right, line 2 flush-left, line 3 flush-right (§5's asymmetry
  rule), each in the bleed on its side.

**Timeline across the pin.** Text and footage are driven by the same `ScrollTrigger.progress`:

| progress | what happens |
|---|---|
| 0.00–0.15 | footage only, no text. The pour begins. |
| 0.15–0.40 | line 1 reveals, holds |
| 0.40–0.65 | line 1 exits, line 2 reveals, holds |
| 0.65–0.90 | line 2 exits, line 3 reveals, holds |
| 0.90–1.00 | text gone, footage finishes on the steam |

Lines enter masked `yPercent 105 → 0` and **exit upward, `0 → -105`**. A line never retraces
its own path. `EASE` and `DUR` come from `src/lib/motion.js` — no new easing values, no new
durations.

> **Amended.** This previously read "exit the same way", i.e. back down to `+105`, and that
> was the cause of a visible vertical bounce in the scrubbed sequence. Measured: each line
> travelled 260px up and the identical 260px back down, three times across the pin. Because
> the footage is nearly static (mean inter-frame luma delta 0.77/255, global camera motion
> 0.12px per frame with zero direction reversals), the lines were the only high-contrast
> moving element in the viewport, so their retrace was read as the *frame sequence* bouncing.
> Cross-correlating rendered screenshots under monotonic scroll isolated it: 3.95px mean
> vertical shift with 10 direction reversals text-visible, against 0.42px and 2 text-hidden.
>
> A second fault rode along with it. Both halves were driven by one ramp that rose `0→1` and
> fell `1→0`, and `EASE` evaluated on a descending parameter is `power3.in` — the exit put
> 87.5% of its travel into its final half, moving the text *down* at ~2.1px per px of scroll
> while the reader scrolled down. Each phase now runs its own ramp forward through `EASE`, so
> enter and exit both decelerate, matching every other motion on the page.
>
> Ruled out and recorded so they are not re-opened: the canvas element never moves (rect top
> range 0.00px across 8 viewport/DPR combinations), the `drawImage` destination rect never
> moves (0.00px), the drawn frame index is strictly monotonic, exactly 1.00 draw occurs per
> animation frame, and Lenis's lerp is not fighting `scrub: 1.1` — `scrub: true` measured
> marginally *worse* (4.16px mean, 11 reversals).

> **The pin stays at `+=340%`. Settled in Phase 6 — do not relitigate.**
>
> The critique raised that this is 35% of total scroll depth (3960 of 11,347px) for three
> sentences, and that `0.00–0.15` and `0.90–1.00` carry no text at all. That is the intended
> reading. This is the centrepiece and the only pinned section on the page; the silent head and
> tail are **pacing**, not dead scroll — the pour arriving before the first line, and the steam
> settling after the last, are what make the section feel like a room rather than a slideshow.
> Shortening the pin would buy scroll depth back at the cost of the one moment §1 exists for.

> **Open, pending real footage: §6.2 and §6.3/§6.5 may be doing the same job.** The Phase 6
> critique found the two ambient breaks (間 and the roast) structurally identical — one
> `<AmbientBreak>` component used twice, both currently rendering the same placeholder gradient,
> so the page meets the same beat twice with nothing learned between. **Deferred, not dismissed:**
> the judgement is about the placeholder, not the design. Re-run it once real ambient video
> exists, and if they still read as one beat, fold the roast caption into §6.4 where binchōtan is
> already named.

- **One line moving at a time, enforced by the non-overlapping windows above** — not by trigger
  separation, and not by a queue. Separation cannot guarantee it: a single large scroll delta
  crosses every boundary within a couple of frames however far apart they are (measured: 3
  lines mid-tween on one 2600px wheel). A serial queue cannot either — it plays tweens to
  completion in order and has no meaning when the user scrubs *backwards*. Line position is a
  pure function of progress, and the windows never overlap, so the invariant holds in both
  directions. Verified at 1 across a 61-point sweep at both 1440 and 360.

- **Assets:** `frames/ritual/ritual_0001.webp` … `ritual_0120.webp`, **1238×720**, WebP q75,
  25.1 KB average, plus the portrait set below. Actual figures in §8; the frame count is read from `FRAMES` in
  `src/assets/manifest.js`, never hardcoded.

> **1440 is a ceiling, not a target.** The current source is 1280×720, so its long edge is
> already below it and the frames are extracted at native size with **no scale filter at all**.
> Scaling up to 1440 would add weight and no picture. Never upscale to hit the number.

> **RESOLVED — not an outstanding item.** The source carries a generator watermark; the crop
> removes it. Every frame in both sets is clean and has been since commit `10cd5f3`. This note
> exists so the crop is not undone, **not** because anything is left to do. Do not re-open it.
>
> The clip has a "Veo" mark burned into the bottom-right corner. It cannot be removed at source,
> and WORKFLOW.md §0.1 requires that nothing in frame is identifiably branded, so the master is
> extracted as **`crop=1238:720:0:0`** — 42 columns off the **right edge only**.
>
> Measured, not guessed: the mark occupies **x 1243–1263, y 695–703**, identical in frames 0, 95
> and 191 (peak 137 against a local background median of ~15). A 1238-wide crop clears it by
> 6px.
>
> Why the right edge and not the bottom:
> - **The left half must stay intact** — it is where the manifesto type sits. The crop never
>   touches it, and the subject is not re-centred.
> - Right-trim removes less picture than the equivalent bottom-trim (30,240 px vs 38,400 px).
> - It keeps the aspect nearer the viewport (1.719 vs 1.855), so `cover` crops *less* at display
>   time. Trimming the bottom would have widened the frame and cut more off the sides.
> - Nothing important is lost: the **dripper and server end at x 953**, and even the background
>   object that appears late reaches only x 1216.
>
> If the footage is ever replaced, re-measure the mark before assuming this crop still applies —
> and note the frames must be extracted **twice**, master and portrait set, with the portrait
> offset re-derived (see §8).

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
- **Canvas fit:** `contain`, centre-anchored, with `--sumi` filling the bleed. The 2:3 frame
  sits at **full viewport height**, horizontally centred, and the ground either side is the page
  ground — the canvas is cleared rather than filled, so the bleed is `--sumi` via the element's
  own background and not a colour literal.

  **Not `cover`.** Cover cropped the 2:3 frame to a 16:9-ish viewport and threw away the
  negative space the composition is built on: the dripper filled the frame and bled off the top,
  and at some scroll positions the screen held nothing but condensation texture. The emptiness
  around the subject is the shot — cropping it is the §10 "compressing the emptiness" failure
  wearing a different hat.

  On viewports **narrower** than 2:3 (portrait phones) contain necessarily flips to
  width-limited: the frame spans the full width with `--sumi` above and below, because full
  height there would overflow horizontally. This is contain behaving correctly, not a special
  case.

  The 12% safe-area inset from WORKFLOW.md §0.1 no longer protects against clipping — contain
  clips nothing. Keep it anyway as a *composition* rule: it is what stops the subject crowding
  the frame edge, which is the thing that made cover look like a product shot.
- **Do not** scrub a `<video>` element's `currentTime`. It stutters on Safari and iOS and will
  ruin the one moment the whole page is built around.

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
  pin. One pinning mechanism per page: the Ritual (§6.2) owns the page's only ScrollTrigger
  pin, and a second pinned trigger competing for pin-spacing calculations through the Lenis
  bridge is where this pattern breaks. Sticky is visually equivalent for a single always-in-flow
  column and costs nothing. Items stagger in at `top 82%`, 80ms apart, with the number in
  `--shu-lit` and a hairline rule that draws left-to-right over 1.2s.

### 6.5 Ambient break II — the roast
Same construction as 6.3, `70svh`, no marquee. Single caption right-aligned:
> Binchōtan. Twelve minutes. By ear.

- **Assets:** `video/roast.webm|mp4` + poster.

### 6.6 The Selection
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

### 6.7 The Room
```
┌──────────────────────────────────────────────┐
│ The Room                        SEVEN SEATS  │
│ ┌──────────────────────────────────────────┐ │
│ │ 素  Cedar, one plank.                    │ │
│ │ 材  Lime plaster.                        │ │
│ │     Blackened steel.                     │ │
│ └──────────────────────────────────────────┘ │
│   MATERIALS                                  │
│ ┌──────────────────────────────────────────┐ │
│ │ 室  Seven seats.                         │ │
│ │     Three pendants.                      │ │
│ │     No overhead light.                   │ │
│ └──────────────────────────────────────────┘ │
│   THE ROOM                                   │
└──────────────────────────────────────────────┘
```

Two full-width plates carrying **type only** — the material list, then the room's facts. Lines
are set at **menu-name scale** (`clamp(19px, 2vw, 27px)`); each plate takes a vertical
`素材` / `室` label and an 11px tracked caption beneath.

> **Not manifesto scale.** These lines were briefly set at `clamp(26px, 4.4vw, 62px)` and it was
> wrong: the manifesto's three lines are the page's emotional centre, and nothing else may read
> at that volume. At 62px a material list competes with the one thing the page is built around.
> Menu-name scale keeps it a list.

**No photography and no line drawing.** An SVG architectural elevation stood here through
phases 2–6 and was removed: at 1440 it read as a CAD drawing — thin hairlines with large dead
areas — not as a room. The stills this section originally specified were never produced. Type
alone carries it, and does so in the voice §1 asks for: declarative, short, slightly severe.

**These are bands, not cards.** §10 forbids "any card with a background colour", and the
distinction is the edge: a card has four and reads as UI. A band runs the full width of the
section with no left or right edge, no corner, no radius — the same construction as the ambient
breaks in §6.3 and §6.5, which are also full-bleed with hairlines top and bottom. `--sumi-2` is
the token already designated for a raised surface.

- **Motion:** unchanged from the plates it replaces — each face enters at `scale 1.12 → 1.0`
  with a `clip-path` wipe from the bottom, 1.4s, then parallaxes `yPercent: -8` scrubbed while
  in view.
- **If real stills are ever produced**, they can replace the band's background without touching
  the motion or the layout. The type would then need re-siting, since it currently occupies the
  space a photograph would.

### 6.8 Reserve
```
┌──────────────────────────────────────────────┐
│ 予約 / RESERVE                               │
│                                              │
│ Sit down.                       HOURS        │
│ Say nothing.                    Wed–Sun      │
│                                 08:00–19:00  │
│ BOOK A SEAT →                   Closed Mon,Tue│
│                                              │
│ 2-14-6 Tomigaya, Shibuya-ku, Tokyo 151-0063. │
└──────────────────────────────────────────────┘
```
Address: 2-14-6 Tomigaya, Shibuya-ku, Tokyo 151-0063.

**No seal.** A 104px vermilion-bordered square containing 黒 stood here through phases 2–5 and
was removed in Phase 6. It was the only enclosed shape on the page, so it had no vocabulary to
belong to, and at that size against flat `--sumi` it read as a **badge** — the eye reached it
before "Sit down. Say nothing." and before the CTA. It cost the page its most important call to
action for decoration. See §10. Do not reintroduce it.

**One eyebrow at the top, not two.** `WALK-INS AFTER 15:00` was removed in the same pass: with
the fixed nav sitting directly above, three tracked-caps items stacked into a band that read as
UI chrome rather than composition. The information was redundant anyway — the hours are
immediately below it.

### 6.9 Footer reveal
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
| Text exit | masked `yPercent 0 → -105` — never retraces the enter (§6.2) |
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

### 7.1 Typographic effects

Every effect draws its durations, staggers and easing from `src/lib/motion.js`
(`DUR`, `STAGGER`, `CHAR`, `ENTER_CHAR`, `ENTER`). No new easing values, no bounce. **No two
sections share a technique** — that is the point of the set: the page should feel like one hand
made all of it, without any two moments looking alike.

| Where | Effect |
|---|---|
| Hero (§6.1) | `NOIR` splits into four masked characters rising on a 90ms stagger, each with a 2° rotation and a 4px blur that resolve as it settles. `ノワール` follows 200ms later, character by character, vertically. |
| Manifesto (§6.2) | Each line reveals **word by word, 60ms apart**, every word in its own mask. Scrubbed, and it exits upward without retracing — see §6.2. |
| Section headings (§6.6, §6.7) | Clip wipe left→right over `DUR.wipe`. |
| The Method (§6.4) | Each numeral counts `00 →` its value over `DUR.count` as the item enters, while the title's **characters resolve from a vertical scatter** — each glyph starting at a different depth inside its own mask, 35ms apart. |
| Menu rows (§6.6) | On hover the Japanese name holds still while the romaji rebuilds character by character, 25ms apart. **Pure CSS** — the stagger is a `transition-delay` driven by the `--i` index, so §7's "micro-interactions are CSS" still holds. |
| Reserve statement (§6.8) | **Line by line, clipped from the left**, each line carrying a slight skew that resolves to 0. The only skew in the build. |

**The manifesto is no longer excluded.** §7.1 previously held it out on the grounds that it is
the page's emotional centre and must not compete with effect work elsewhere. The word-by-word
reveal does not compete with it, it *is* it — the technique now serves the centrepiece rather
than decorating the edges. The exclusion stands in spirit: nothing else on the page may add
motion while the pin is engaged.

**The scatter is a fixed cycle, not a random one.** `ENTER_CHAR.scatter` is five start depths
applied by index. A seeded RNG would look identical and be one more thing to keep deterministic;
the effect must be the same on every load and every replay.

**Under a scrub, a stagger is not a delay.** The manifesto is progress-driven, so
`CHAR.wordStagger` cannot be applied as 60ms of clock. It is converted to a fraction of the
reveal band — 60ms measured against `DUR.reveal` — and each word gets its own sub-ramp inside
the band. The tail is clamped so the last word still has 40% of the band to travel in;
without that clamp a long line starves its final words into a snap.

**One at a time, measured.** The reveals sit in separate viewports. The one place they can
overlap is adjacent Method items, whose triggers are ~one item apart while `DUR.reveal` is 1.4s:
measured at a normal 1500px/s scroll, two titles are in motion in **3 frames out of 645**
(0.5%), rising to 3.6% at a 9000px/s flick. This is trigger adjacency, not two competing
animations, and it is unchanged from the previous technique — same triggers, same duration.

**Weight interpolation on the Selection heading is NOT implemented, and cannot be with the
current faces.** The brief asked for the heading to arrive lighter and settle. Shippori Mincho
is subset at **weight 400 only**, it is not a variable font, and **400 is the lightest weight
the family ships** — there is no lighter weight to arrive from even if another subset were
added. Animating `font-weight` would produce a synthetic faux-light, which is exactly the kind
of substitute §4 exists to prevent. The Selection heading therefore keeps the shared clip wipe.
Two real paths, both needing a decision rather than an invention: ship a Shippori Mincho 500
subset and interpolate `500 → 400`, which is weight interpolation that *settles* but arrives
**heavier**, at the cost of one more woff2 against §9's font budget; or give the Selection a
different non-weight technique.

**Reduced motion drops every one of these to its final state** — characters at rest and
unblurred, words at rest, headings and statement lines unclipped and unskewed, numerals printed
at their value, no hover cascade. Verified: 0 of 29 manifesto words, 0 of 108 method characters
displaced, and both statement lines at `inset(0 0% 0 0)`.

**Reduced motion:** grain animation off, scroll cue static, all scrubs → `true`, all reveal
tweens → `duration: 0` with final state applied. The page must remain fully readable.

The Manifesto (§6.2) does not simply collapse its scrub to `true` on a `+=340%` pin — that
would leave a nearly-static 3.4-viewport-tall section with nothing happening in it, which fails
"fully readable" as badly as a broken animation would. Under reduced motion the pin shortens to
`+=100vh` and renders three static keyframes, with **all three manifesto lines visible
simultaneously** in their alternating margins rather than revealing in sequence. It is a short,
legible, non-animated triptych — never a 340%-tall no-op.

> Spell it `'+=100%'` in code. ScrollTrigger's `end` takes pixels or a percentage **of the
> viewport** and does not parse CSS units, so `'+=100vh'` silently resolves to 100 *pixels*.

---

## 8. Asset manifest

| Path | Spec | Budget |
|---|---|---|
| `public/video/hero.webm` + `.mp4` | 8s loop, 1600px wide, muted, seamless | 1.2 MB |
| `public/video/ma.webm` + `.mp4` | 8s loop | 1.2 MB |
| `public/video/roast.webm` + `.mp4` | 6s loop | 1.0 MB |
| `public/video/close.webm` + `.mp4` | 6s loop | 800 KB |
| `public/img/*-poster.webp` | first frame of each loop | 40 KB ea |
| `public/frames/ritual/ritual_0001–0120.webp` | **1238×720, q75** (actual) | **25.1 KB avg (22.4–30.6), 2.94 MB total** (actual) |
| `public/frames/ritual-portrait/ritual_0001–0120.webp` | **576×720, q75** (actual) | **18.3 KB avg (15.5–23.6), 2.15 MB total** (actual) |
| `public/img/room-01.webp`, `room-02.webp` | 2000px wide | 220 KB ea |

**Every video:** `muted loop playsinline preload="none"` with a `poster`. Never autoplay with
sound. Never let a black rectangle sit where a video hasn't loaded — the poster covers it.

**Ritual frames — measured, not estimated.** The row above is the real output of the Phase 0
extraction, not a target.

- **One source clip**, 1280×720 / 24fps / 192 frames / 8.000s, 16:9 landscape. **No letterbox
  padding** — verified by cropdetect (both windows returned the full frame) and confirmed on a
  brightened grid frame plus column/row brightness profiles.
- **Cropped to 1238×720 to remove a generator watermark** — right edge only, see §6.2.
- **Extracted twice**: the landscape master above and a 4:5 portrait set for the narrow branch,
  `crop=576:720:532:0`. **Combined 5.09 MB.**
- `fps=15` over 8.000s lands **exactly 120 frames** — a 24→15 decimation, so every output frame
  is a genuine source frame and none is duplicated.
- **1238×720 at q75: 25.1 KB average, 2.94 MB.** Portrait set 576×720: 18.3 KB average,
  2.15 MB. No scale filter on either — both are native pixels.

> **The old 60 KB/frame and 7 MB totals no longer apply.** They were written for a boxed stage;
> the sequence is now full-bleed (§6.2) and carries the entire viewport, so it is the single
> heaviest thing on the page by a wide margin. 11.67 MB is **not** inside any budget previously
> written here. It is no longer a live concern either: at **2.97 MB** the whole sequence is now
> lighter than a single hero photograph on most sites, down from 11.67 MB, because the new
> source is 1280×720 rather than 1440×2160. Nothing is being traded — this is simply a smaller
> master. The frames are still lazy-loaded after the eager first twelve and never block LCP.

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
- Vermilion drawn as an **enclosed shape** — a bordered square, badge, pill, or chip. The
  geometry failure, not the glow one: a closed vermilion outline reads as a UI badge however
  restrained the colour is, and it will out-compete the reservation CTA for attention. The
  seal in §6.8 did exactly this and was removed. Vermilion is a rule, a seal-less mark, or one
  word — never a container.
- A Western display serif replacing Shippori Mincho → loses the only distinctive type decision.
- Photographs of coffee cups, latte art, or hands holding mugs → instant stock-photo café.
- Rounded corners, drop shadows, glassmorphism, or any card with a background colour.
- Compressing `vh` padding to "fit more content" → the emptiness is the product.
- Scrubbing a `<video>` element instead of frames.
- Cropping the subject out of the frame sequence to make it fill the viewport. The fit follows
  the source: a portrait master is `contain` (its negative space IS the shot), a 16:9 master is
  `cover` (§6.2). What is never acceptable is a crop that cuts the dripper or strands most of
  the viewport in dead ground — measure before choosing, do not default either way.
- Adding a testimonials section, a logo wall, an Instagram grid, or a newsletter modal.
- More than one animation moving at any given moment.
- **Verifying that an animation RUNS is not verifying that it RENDERS.** Third occurrence of
  this shape in this project, so it is now a rule. A property changing over time proves the
  tween is wired, nothing more. The rail characters rotated exactly as instrumented while laid
  out horizontally at 3px wide — the effect ran perfectly on a broken element. Earlier:
  "0/61 determinism mismatches" scored a frozen canvas as perfect scrub determinism, and
  "CLS 0" scored a page on which nothing moved. **Assert the rendered result — box, position,
  size, orientation — not only the animated value.** If a measurement looks flawless, confirm
  the thing being measured is intact before believing it.

# WORKFLOW.md — NOIR build order

Assets first, code second. The Ritual sequence gates everything — if the Flow clips come back
wrong, the whole centrepiece changes, so generate and approve them before writing a line of React.

Skills referenced are the ones already installed in your Claude Code global skills folder.

---

## Skills discipline — `find-skills` is bounded per phase

`find-skills` is available in every phase below, but only inside that phase's stated remit. It
exists to find *reasoning* you are missing, never to widen the build.

**Three rules that hold in every phase:**

1. **A skill is advisory. It never becomes a project dependency.** Installing a skill must not
   add a package, a runtime, a build plugin, or a CSS framework. The stack in DESIGN.md §7 is
   closed — `vite + react 19 + gsap/ScrollTrigger + lenis`, and nothing else.
2. **If a skill recommends a dependency, that is a DESIGN.md amendment, not an install.** Stop,
   propose the change against §7 and the §9 JS budget, and get it agreed before writing code.
   framer-motion was removed from this project by exactly that route, in reverse.
3. **Search inside the phase, resolve inside the phase.** `find-skills` may not be used to
   import work from a later phase, and anything it turns up must be settled before the current
   phase's exit criteria are checked. Carrying an open skill question across a phase boundary
   is the same failure as carrying an unbuilt asset across one.

**Default answer is no.** Most phases already name the skills they need. Reach for `find-skills`
only when a phase's own list demonstrably does not cover the problem in front of you — and say
which listed skill fell short and why.

---

## Phase 0 — Asset production (Flow / Veo)

**Nothing else starts until this phase passes its checklist.**

> **Skills:** none.
>
> `find-skills` — **bound:** out of scope. This phase is prompting Flow/Veo and running ffmpeg;
> there is no code to reason about. A skill that offers to generate or source imagery is
> answering a question this phase does not ask — the assets are authored, not fetched.

### The one rule for every prompt

> Dark room. **Single** warm low light source from the upper left. 70% of the frame in shadow.
> Locked-off camera. No hands, no branding, no text, no people.

If a generation comes back evenly lit, discard it. Even lighting is the single thing that will
make this read as a stock coffee ad instead of a Tokyo kissaten. Expect to re-roll 3–5× per shot.

### 0.1 The Ritual — three clips → 120 frames

Generate portrait 9:16 in Flow, 5s each. These become the scrubbed sequence.

**Clip A — 湯 / the pour begins**
> Locked-off macro shot, portrait. A gooseneck kettle tilts slowly and begins pouring a thin
> thread of water into a matte black ceramic V60 dripper. Near-black background, single warm
> tungsten source from the upper left raking across the scene, deep shadow filling most of the
> frame. Steam catches the light. No branding, no hands. 100mm macro, f/4, shallow depth of
> field, subtle 35mm film grain. Slow and deliberate, no camera movement.

**Clip B — 蒸らし / the bloom**
> Locked-off macro shot, portrait. Extreme close-up of a coffee bed in a ceramic dripper
> swelling and cracking as it blooms, carbon dioxide bubbles rising through wet grounds. The
> crust rises and fissures. Near-black background, single warm low-angle light from upper left.
> Rich red-brown against black. 100mm macro, f/4, film grain, static camera, no text.

**Clip C — 抽出 / the draw**
> Locked-off macro shot, portrait. Dark coffee drips from the base of a ceramic cone into a
> glass server below, the liquid level slowly rising. Near-black background, single warm light
> from upper left catching the falling droplets and the meniscus. Glass edge glints. 100mm
> macro, f/4, heavy negative space, film grain, static camera, no text.

**Continuity note for Flow:** generate A first, then use its last frame as the seed / reference
image for B, and B's last frame for C. Otherwise the dripper changes shape between clips and the
scrub will visibly jump.

**Framing constraint:** the subject (kettle/dripper/bloom/drips/carafe) must stay inside a 12%
safe-area inset on all four sides of the frame — i.e. inside the inner 76%×76% of the shot.
The canvas renders these frames with `object-fit: cover`, centre-anchored (DESIGN.md §6.5), so
anything outside that safe area risks being cropped at some supported viewport width. Frame
accordingly when prompting Flow and when cropping in the ffmpeg pass below.

**Stitch and extract:**
```bash
printf "file 'A.mp4'\nfile 'B.mp4'\nfile 'C.mp4'\n" > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy ritual_raw.mp4

mkdir -p public/frames/ritual
ffmpeg -i ritual_raw.mp4 \
  -vf "scale=1440:-1,crop=1440:1760,eq=contrast=1.18:brightness=-0.07:saturation=0.72,fps=8" \
  -frames:v 120 -q:v 75 public/frames/ritual/ritual_%04d.webp
```
`fps=8` × 15s = 120 frames. Adjust if your clips run longer or shorter.

**Checklist before moving on:**
- [ ] 120 files present, sequentially numbered, none blank
- [ ] Each ≤ 60 KB
- [ ] Scrubbing forward and backward through them in Finder/Preview reads as one continuous action
- [ ] No visible cut at the A→B and B→C joins
- [ ] Nothing in frame is identifiably branded

### 0.2 Ambient loops — four clips

Landscape 16:9, 6–8s, must loop seamlessly. In Flow, prefer a slow drift with no clear start
or end state; then crossfade the last 12 frames back onto the first in post if needed.

**`hero.webm` — steam**
> Slow drifting steam and dust motes in a dark room, a single shaft of warm low light from a
> narrow window. Nothing else in frame, almost abstract. Static camera, very slow motion, 35mm
> film grain, near-black.

**`ma.webm` — the interval**
> An empty dark cedar counter, one warm pendant lamp above it, faint steam crossing the light.
> Absolutely still except the steam. Static camera, cinematic, deep shadow, film grain.

**`roast.webm` — the drum**
> Extreme close-up of dark coffee beans tumbling slowly in a drum roaster, lit only by the
> orange glow from inside the drum. Near-black surroundings. Static camera, slow motion, no
> hands, no branding.

**`close.webm` — closing time**
> A dark Japanese coffee house at night, three low pendant lamps switching off one by one,
> leaving only ambient street light on the cedar counter. Static camera, no people, film grain.

**Encode each:**
```bash
for f in hero ma roast close; do
  ffmpeg -i raw/$f.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -an -vf "scale=1600:-2" public/video/$f.webm
  ffmpeg -i raw/$f.mp4 -c:v libx264 -crf 26 -an -movflags +faststart -vf "scale=1600:-2" public/video/$f.mp4
  ffmpeg -i raw/$f.mp4 -vframes 1 -vf "scale=1600:-2" public/img/$f-poster.webp
done
```

### 0.3 Stills — two plates

Flow or an image model, 16:9, 2000px wide.

**`room-01.webp`**
> Architectural interior, Japanese coffee house at dusk. A long cedar counter, lime plaster
> wall, blackened steel shelf. One warm pendant lamp. 90% of the frame in shadow. 35mm, natural
> light only, no people, no styled props. Muted, desaturated, film grain.

**`room-02.webp`**
> Three low pendant lamps in a row above a dark wooden counter, seen from a low angle. Warm
> pools of light on the wood, everything beyond in black. 35mm, no people, film grain.

**Phase 0 exit criteria:** all files in `public/`, total weight under 12 MB, and you would be
happy for any single frame to be the site's OG image.

---

## Phase 1 — Scaffold

> **Skills:** `pick-ui-library`, `ponytail`
>
> `find-skills` — **bound:** scaffold and tooling ergonomics only. It may not be used to find a
> UI library, CSS framework, or component library; this phase's brief already forbids all three
> and Tailwind is not on this project. If it surfaces one, that is the answer being wrong.

```
Read DESIGN.md in full.

Scaffold a Vite + React 19 project. Install gsap, lenis, framer-motion.
Set up:
- src/styles/tokens.css with the exact :root block from DESIGN.md §3, nothing added
- src/lib/smoothScroll.js with the Lenis ↔ ScrollTrigger bridge from §7, verbatim
- src/lib/motion.js exporting EASE, DUR, STAGGER, SCRUB as named constants
- Google Fonts link for Shippori Mincho 400/500 and Zen Kaku Gothic New 300/400
- Global grain + vignette overlays as described in §5
- A prefers-reduced-motion guard that other components can import

Do not build any sections yet. Do not add a UI library, a CSS framework,
or a component library. Tailwind is not being used on this project.
```

**Done when:** blank near-black page, grain visible, Lenis smooth on wheel and trackpad,
`ScrollTrigger.update` firing (verify in devtools).

---

## Phase 2 — Static build, no motion

> **Skills:** `luxury-layouts`, `typography-master`, `color-theory`, `apple-design`
>
> `find-skills` — **bound:** layout, type and colour *reasoning* only. Not components. Anything
> that returns a pre-built card, grid, or menu component is out of scope: the sections are hand
> built from §6, and §10 rejects cards outright.

```
Read DESIGN.md §4, §5, §6.

Build all ten sections as static components in src/sections/. Real copy from §6 —
do not write placeholder text, do not paraphrase, do not add sections.

Rules:
- Every colour and size from tokens.css. No hardcoded hex, no magic numbers.
- Radius 0 everywhere except the seal at 2px. No box-shadows.
- Vertical spacing in vh per §5. Do not reduce it to fit content on screen.
- Menu rows are <button> elements. Nav and CTA keyboard reachable.
- Videos: muted loop playsinline preload="none" with poster. Assets are already
  in public/ — wire the real paths.
- The Ritual section: static <canvas>, correct grid, captions present at opacity 1.
  No scroll logic yet.

Check against §10 anti-patterns before you finish and tell me anything you had to break.
```

**Done when:** the page reads top to bottom with no JS motion, at 360px and 1440px, and it
already looks like something. If it only works once it's animated, the layout is wrong.

---

## Phase 3 — Motion pass

> **Skills:** `gsap-scrolltrigger-storytelling`, `ui-motion-master`, `animate`,
> `animation-vocabulary`
>
> `find-skills` — **bound:** motion reasoning and GSAP/Lenis interaction only. It may not be
> used to add an animation runtime. If the answer to a motion problem is "install a library",
> the answer is wrong — GSAP already owns everything scroll-driven and CSS owns the rest (§7).

```
Read DESIGN.md §6 and §7.

Add scroll motion. Every tween uses the constants from src/lib/motion.js — no inline
easing strings, no ad-hoc durations.

Per section:
- Hero: masked load reveal, yPercent 110 → 0, 1.5s, 90ms stagger, video fades in at 800ms
- Manifesto: one masked line at a time, trigger 'top 88%'
- 間: marquee xPercent -34 scrubbed, video scale 1.25 → 1.0 scrubbed
- The Method: left heading pinned, items stagger 80ms, rule draws left to right
- Roast break: video scale scrub only
- Selection: rows stagger in, hover padding-left 0 → 22px over 0.7s
- The Room: scale 1.12 → 1.0 with clip-path wipe, parallax yPercent -8 scrubbed
- Footer: fixed reveal from underneath per §6.10

Constraint: never more than one animation moving at a time within a viewport.
Honour prefers-reduced-motion per §7.

Do not build the Ritual scrub yet.
```

**Done when:** you can scroll the whole page and nothing feels like it snaps, bounces, or
fires late. Slow scroll and fast scroll both read correctly.

---

## Phase 4 — The Ritual scrub

> **Skills:** `gsap-scrolltrigger-storytelling`, `performance`
>
> `find-skills` — **bound:** canvas rendering, image decode, and frame-sequence performance
> only. It may not be used to find a scroll-sequence or image-sequence library: §6.5 specifies a
> hand-written `render(p)` on a `<canvas>`, and §10 forbids scrubbing a `<video>` whatever a
> library makes convenient.

```
Read DESIGN.md §6.5.

Build the scrubbed frame sequence in the Ritual section.

- 120 WebP frames at public/frames/ritual/ritual_0001.webp … ritual_0120.webp
- Preload frames 1–12 eagerly; lazy-load the remaining 108 when the section
  hits 'top bottom'
- Canvas with a single render(p) function: index = Math.round(p * 119)
- ScrollTrigger: pin the stage, end '+=340%', scrub 1.1
- DPR-aware canvas sizing, re-fit and re-render on resize, then ScrollTrigger.refresh()
- Captions 一 / 二 / 三 cross-fade across thirds of progress per §6.5

Do NOT scrub a <video> element's currentTime.
Show me the frame-decode timing in devtools when you're done.
```

**Done when:** scrubbing forwards and backwards is smooth at 60fps, no white flash on first
entry, and it still works after a window resize mid-section.

---

## Phase 5 — Performance and quality floor

> **Skills:** `performance`, `ponytail-audit`, `ponytail-debt`
>
> `find-skills` — **bound:** measurement, profiling and font subsetting only. This is the one
> phase permitted to reach for a *build-time* tool (a subsetter for §4.1), and only if it leaves
> no runtime footprint. Anything that changes the shipped bundle is scored against the §9 budget
> and reported with what it cost, not merged quietly.

```
Read DESIGN.md §9.

Audit and fix against the budgets: LCP ≤ 2.0s, initial JS ≤ 90 KB gzipped, CLS 0,
60fps during the pinned scrub on a mid-range Android profile.

Also verify:
- Hero title is the LCP element, not a video or image
- Every media element has explicit dimensions or aspect-ratio
- Keyboard path through nav → menu rows → CTA with visible focus rings
- prefers-reduced-motion leaves the page fully readable
- 360px, 768px, 1440px, 2560px

If the scrub drops frames, reduce the sequence to 90 frames before touching anything else.
Report what you changed and what it cost.
```

---

## Phase 6 — Critique

> **Skills:** `impeccable`, `review-animations`, `awwwards`
>
> `find-skills` — **bound:** read-only. Critique may not install anything. If a skill would
> change the site, it belongs to an earlier phase and the phase order says you are too late.

```
Read DESIGN.md, especially §10.

Critique the built site as an outside design lead who did not make it. Specifically:
- Does the vermilion ever read as a SaaS accent rather than lacquer?
- Is any section doing the same thing as another section?
- Is the emptiness intact, or did it get compressed during the build?
- Which single element would you remove?

Give me a prioritised list. Do not fix anything yet.
```

Then run `find-animation-opportunities` and `improve-animations` on whatever survives the cut —
but the instruction from §10 stands: one moving thing at a time. Most opportunities should be
declined.

---

## Order of operations, short version

```
0  Flow assets ────────────────► approve before any code
1  Scaffold + tokens
2  Static sections, real copy
3  Motion pass (not the scrub)
4  Ritual scrub
5  Performance
6  Critique → remove one thing
```

Do not reorder. Building the layout before the assets exist means the layout gets designed
around placeholder rectangles, and the Ritual is the whole reason this page exists.
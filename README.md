# NOIR

A cinematic single-page site for **NOIR (ノワール)** — a seven-seat *kissaten* in Tomigaya,
Tokyo. Dark wood, one low light, hand-drip only.

The page has one job: make someone who has never heard of the place feel the room, and then
book a seat. It is not a menu site and not a brand site — it is a slow descent that ends at a
reservation.

The centrepiece is a scroll-scrubbed frame sequence: real footage of a pour-over, pinned to the
viewport, with the three manifesto lines arriving as the coffee fills the carafe.

---

## Stack

```
vite 8 + react 19
├── gsap + ScrollTrigger   pin, scrub, parallax, every reveal
└── lenis                  smooth scroll, lerp 0.075
```

That is the whole runtime. **No UI library, no CSS framework, no component library, no
animation library beyond GSAP** — micro-interactions are plain CSS transitions. The stack is
closed by design (DESIGN.md §7); adding to it is a spec amendment, not an install.

Fonts are self-hosted subsets. There is no third-party request in the document.

## Running it

```bash
npm install
npm run dev        # dev server
npm run build      # production build to dist/
npm run preview    # serve the production build
npm run lint       # oxlint
```

Node 20+. No environment variables, no API keys, no backend — it is a static site, so `dist/`
can be served by anything.

## Layout

```
src/
├── sections/     the ten sections of DESIGN.md §6
├── components/   nav, rail, overlays, ambient media
├── lib/          motion constants, smooth-scroll bridge, frame loader, canvas renderers
├── styles/       tokens, fonts, type, layout
└── assets/
    └── manifest.js    SINGLE source of truth for every asset path and dimension
public/
├── frames/ritual/           120 landscape frames  (1238×720)
├── frames/ritual-portrait/  120 portrait frames   (576×720, phones)
├── fonts/                   3 subset woff2
└── og/                      social card
```

`src/assets/manifest.js` is the only place asset paths and frame counts live. Nothing else
hardcodes a path, a dimension, or a frame count.

## Measured numbers

Measured against the **production build** (`npm run build` + `npm run preview`), not the dev
server.

| | Budget (DESIGN.md §9) | Measured |
|---|---|---|
| Initial JS | ≤ 120 KB gzipped | **115.29 KB** (340.44 KB raw) |
| CSS | — | 3.09 KB gzipped (11.01 KB raw) |
| CLS | 0 | **0.0004** through a full scroll |
| LCP | ≤ 2.0s, hero title | **92–108 ms**, hero title — see caveat |
| Scrub, mid-range Android | 60fps | **57.1 fps median**, p95 30.8 ms, 1.0% of frames > 32 ms |
| Fonts | — | 36.5 KB, 3 subsets, same-origin |
| `dist/` total | — | 6.1 MB (the two frame sets are 5.09 MB of it) |

Android figures are 4× CPU throttling at 360×780 / dpr 3, driven with real wheel input across
the pinned section, with the sequence fully decoded first.

**Two honest caveats on the table above.**

- **CLS is 0.0004, not 0.** §9 asks for 0. The residual is four ten-thousandths and well inside
  the "good" threshold, but it is not zero and the spec is not quite met.
- **The LCP figure was captured in an earlier session and could not be reproduced in the last
  one.** Headless Chromium throttled `requestAnimationFrame` to ~1 tick per 500 ms and reported
  `first-contentful-paint` at 22 seconds, so the Paint Timing API was not trustworthy in that
  environment. The 92–108 ms readings were real when taken, and the LCP *element* is confirmed
  to be the hero title (`[data-reveal="title"]` in `#hero`), which is the part §9 actually
  constrains. Re-measure on real hardware or in Lighthouse before quoting the number publicly.

## The frame sequence

120 frames, extracted from a single 1280×720 / 24fps / 8s clip at `fps=15` — a clean 24→15
decimation, so every output frame is a genuine source frame and none is duplicated.

The master is cropped to **1238×720**. That is not cosmetic: the source carries a generator
watermark at x1243–1263, and the crop removes it from the right edge only, leaving the dark
left half — where the manifesto type sits — untouched.

Phones get a **second frame set** cropped 4:5 around the subject. Neither alternative works
with a 16:9 master on a 360px viewport: contained it strands two thirds of the screen, covered
it cuts straight through the dripper.

Source footage lives in `source-footage/` and is gitignored. It must **not** sit in `public/` —
everything there is copied verbatim into `dist/`, and a 1.48 MB master was being deployed as
dead weight until that was caught.

## Before deploying

- **`og:image` and `og:url` in `index.html` are relative.** Most scrapers require absolute URLs
  and will silently render no card. Prefix both with the live origin.
- Everything else is origin-independent — no `localhost`, no dev-only paths, no third-party
  hosts in the built output.

## Documentation

- **`DESIGN.md`** — the spec. Every colour, size, easing and string comes from it, and it
  records *why* decisions were made, including the ones that were reversed.
- **`WORKFLOW.md`** — the phase order (0 assets → 6 critique) and the per-phase constraints.
- **`CLAUDE.md`** — the anti-patterns, for anyone or anything editing this repo.

Read DESIGN.md before changing anything. §10 in particular lists the specific ways this design
fails, several of which were learned by making the mistake.

## Known gaps

Deliberately deferred, each with a working treatment in place:

- **The four ambient loops** (`hero`, `ma`, `roast`, `close`) — currently layered CSS gradient
  fields. Wire real footage by filling in the paths in `src/assets/manifest.js`; nothing else
  changes.
- **The two room stills** — currently an SVG line elevation, recorded as provisional in §6.7.
- Whether the two ambient breaks do the same job is an open question in §6.2, deferred until
  real footage exists, since the judgement is currently about the placeholder.

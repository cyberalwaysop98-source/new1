// Single source of truth for every real asset the site will eventually load.
// DESIGN.md §8. Every component imports paths from here and nowhere else —
// swapping placeholders for real assets is an edit to this file only.
//
// All `src`/`poster` fields are `null` right now: no video, photograph, or frame
// sequence has been produced (Phase 0 is deferred). Components that consume these
// entries — <AmbientMedia>, <Room>, <Ritual> — must render their placeholder
// treatment whenever the relevant field is null, and switch to the real asset
// the moment a path is filled in here. No other file should hardcode a path.

// Actual count on disk, produced by the Phase 0 extraction (24fps/8.0s source
// sampled at fps=15 → 120 genuine frames, no duplication). Read from here and
// never hardcoded at a call site — §6.5 indexes with Math.round(p * (FRAMES - 1)).
export const FRAMES = 120;

// True: the real sequence exists in public/frames/ritual/. The procedural sumi-e
// renderer (src/lib/ritualProcedural.js) is retained as the fallback for when
// this is false — do not delete it.
export const USE_FRAMES = true;

export const ritualFrames = {
  count: FRAMES,
  // Measured, not the originally specified 1440×1760 — the sequence could not
  // meet the 60 KB/frame budget at 1440px. See DESIGN.md §8.
  width: 1200,
  height: 1800,
  // Number of leading frames fetched eagerly; the rest load when the section
  // reaches 'top bottom' (§6.5).
  eagerCount: 12,
  // Path for frame index i (0-based).
  path: (i) => `/frames/ritual/ritual_${String(i + 1).padStart(4, '0')}.webp`,
};

export const ambient = {
  hero: {
    webm: null, // public/video/hero.webm
    mp4: null, // public/video/hero.mp4
    poster: null, // public/img/hero-poster.webp
  },
  ma: {
    webm: null, // public/video/ma.webm
    mp4: null, // public/video/ma.mp4
    poster: null, // public/img/ma-poster.webp
  },
  roast: {
    webm: null, // public/video/roast.webm
    mp4: null, // public/video/roast.mp4
    poster: null, // public/img/roast-poster.webp
  },
  close: {
    webm: null, // public/video/close.webm
    mp4: null, // public/video/close.mp4
    poster: null, // public/img/close-poster.webp
  },
};

export const stills = {
  room01: {
    src: null, // public/img/room-01.webp — the counter
    width: 2000,
  },
  room02: {
    src: null, // public/img/room-02.webp — the lamps
    width: 2000,
  },
};

export const fonts = {
  displaySubset: null, // public/fonts/shippori-mincho-subset.woff2
  bodySubset: null, // public/fonts/zen-kaku-gothic-new-subset.woff2
};

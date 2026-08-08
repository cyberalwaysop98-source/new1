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

export const USE_FRAMES = true;

export const ritualFrames = {
  count: FRAMES,
  width: 1280,
  height: 720,
  eagerCount: 12,
  path: (i) => `/frames/ritual/ritual_${String(i + 1).padStart(4, '0')}.webp`,
};

export const NARROW_BREAKPOINT = 900;

export const ritualFramesPortrait = {
  count: FRAMES,
  width: 1280,
  height: 720,
  eagerCount: 12,
  path: (i) => `/frames/ritual/ritual_${String(i + 1).padStart(4, '0')}.webp`,
};

export const ambient = {
  hero: {
    webm: '/video/hero.webm',
    mp4: '/video/hero.mp4',
    poster: '/img/hero-poster.webp',
  },
  ma: {
    webm: '/video/ma.webm',
    mp4: '/video/ma.mp4',
    poster: '/img/ma-poster.webp',
  },
  roast: {
    webm: '/video/roast.webm',
    mp4: '/video/roast.mp4',
    poster: '/img/roast-poster.webp',
  },
  close: {
    webm: '/video/close.webm',
    mp4: '/video/close.mp4',
    poster: '/img/close-poster.webp',
  },
};

export const stills = {
  room01: {
    src: '/img/room-architecture.webp',
    width: 1024,
  },
  visit01: {
    src: '/img/visit-exterior.webp',
    width: 1024,
  },
};

export const fonts = {
  displaySubset: null, // public/fonts/shippori-mincho-subset.woff2
  bodySubset: null, // public/fonts/zen-kaku-gothic-new-subset.woff2
};

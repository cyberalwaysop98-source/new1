// Single source of truth for every real asset the site will eventually load.
// DESIGN.md §8. Every component imports paths from here and nowhere else —
// swapping placeholders for real assets is an edit to this file only.
//
// All `src`/`poster` fields are `null` right now: no video, photograph, or frame
// sequence has been produced (Phase 0 is deferred). Components that consume these
// entries — <AmbientMedia>, <Room>, <Ritual> — must render their placeholder
// treatment whenever the relevant field is null, and switch to the real asset
// the moment a path is filled in here. No other file should hardcode a path.

export const FRAMES = 120; // DESIGN.md §6.5 — ritual_0001.webp … ritual_0120.webp

// Set true only once all 120 frames listed below actually exist in public/.
export const USE_FRAMES = false;

export const ritualFrames = {
  count: FRAMES,
  width: 1440,
  height: 1760,
  // Returns the path for frame index i (0-based). Null while USE_FRAMES is false.
  path: (i) =>
    USE_FRAMES
      ? `/frames/ritual/ritual_${String(i + 1).padStart(4, '0')}.webp`
      : null,
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

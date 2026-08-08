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
  // Source is 1280×720; the master is cropped to 1238 wide to remove the
  // generator watermark at x1243-1263 (§6.2). Right edge only - the dark left
  // half is where the type sits and must stay intact. No scaling: the long edge
  // is already under the 1440 ceiling, so any scale would be an upscale.
  width: 1238,
  height: 720,
  // Number of leading frames fetched eagerly; the rest load when the section
  // reaches 'top bottom' (§6.5).
  eagerCount: 12,
  // Path for frame index i (0-based).
  path: (i) => `/frames/ritual/ritual_${String(i + 1).padStart(4, '0')}.webp`,
};

// Below this viewport width the section switches to the portrait crop set and
// the narrow layout (§6.2). Phones cannot use the 16:9 master: contained it
// strands two thirds of the viewport, and covered it cuts through the dripper.
export const NARROW_BREAKPOINT = 900;

// Same 120 frames, same source clip and grade, cropped 4:5 around the subject:
// crop=576:720:532:0. The offset is re-measured against the watermark-cropped
// master (dripper+server span x686-953, centre 820) - it is NOT reusable across
// source clips, re-derive it whenever the footage changes (§6.2).
export const ritualFramesPortrait = {
  count: FRAMES,
  width: 576,
  height: 720,
  eagerCount: 12,
  path: (i) =>
    `/frames/ritual-portrait/ritual_${String(i + 1).padStart(4, '0')}.webp`,
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

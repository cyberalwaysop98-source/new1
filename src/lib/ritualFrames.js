// DESIGN.md §6.5 — frame sequence loading for the Ritual scrub.
// Eager for the first `eagerCount`, lazy for the remainder once the section
// reaches 'top bottom'. Count comes from the manifest, never hardcoded.
import { FRAMES, ritualFrames } from '../assets/manifest';

// `set` is a frame-set descriptor from the manifest (landscape master or the
// portrait crop) — same shape, different paths and dimensions.
export function createFrameLoader(set = ritualFrames) {
  const images = new Array(FRAMES).fill(null);
  let lazyStarted = false;

  function load(i) {
    if (images[i]) return images[i];
    const img = new Image();
    img.decoding = 'async';
    img.src = set.path(i);
    images[i] = img;
    return img;
  }

  function loadEager() {
    const n = Math.min(set.eagerCount, FRAMES);
    return Promise.all(
      Array.from({ length: n }, (_, i) => {
        const img = load(i);
        // decode() resolves when the bitmap is ready to draw, so the first
        // render cannot land on a decoded-but-not-yet-drawable image.
        return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
      })
    );
  }

  function loadRest() {
    if (lazyStarted) return;
    lazyStarted = true;
    for (let i = Math.min(set.eagerCount, FRAMES); i < FRAMES; i++) load(i);
  }

  function isReady(img) {
    return Boolean(img && img.complete && img.naturalWidth);
  }

  // Never return null while ANY frame is decoded: fall back to the nearest
  // loaded neighbour. This is what prevents a white/blank flash when the user
  // scrubs into a region whose frames are still in flight — the sequence holds
  // on the closest available image instead of clearing to nothing.
  function getDrawable(i) {
    if (isReady(images[i])) return images[i];
    for (let d = 1; d < FRAMES; d++) {
      if (isReady(images[i - d])) return images[i - d];
      if (isReady(images[i + d])) return images[i + d];
    }
    return null;
  }

  function loadedCount() {
    return images.reduce((n, img) => n + (isReady(img) ? 1 : 0), 0);
  }

  return { loadEager, loadRest, getDrawable, loadedCount };
}

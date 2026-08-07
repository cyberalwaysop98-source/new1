// DESIGN.md §7 — "The page must remain fully readable" under prefers-reduced-motion.
// Other components import prefersReducedMotion() (a live check) or subscribe via
// onReducedMotionChange for cases that need to react to the setting flipping mid-session.

const QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

export function onReducedMotionChange(callback) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  const handler = (e) => callback(e.matches);
  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
}

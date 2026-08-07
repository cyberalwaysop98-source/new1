// DESIGN.md §7 — motion system constants. No inline easing strings or ad-hoc
// durations anywhere else in the codebase; everything imports from here.

export const EASE = 'power3.out';
export const EASE_CSS = 'cubic-bezier(.16, 1, .3, 1)';

export const DUR = {
  reveal: 1.4,   // 1.2–1.5s
  hover: 0.65,   // 0.6–0.7s
};

export const STAGGER = 0.08; // 80ms

export const SCRUB = 1.1; // never `true`, except under prefers-reduced-motion

export const ENTER = {
  imageScaleFrom: 1.12,
  imageScaleTo: 1,
  textYPercentFrom: 105,
  textYPercentTo: 0,
  // §6.1 gives the hero its own, larger rise. Mirrored as translateY(110%) in
  // src/styles/layout.css so the masked state exists at first paint — change
  // both together.
  heroYPercentFrom: 110,
  heroOpacityTo: 0.22,
};

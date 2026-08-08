// DESIGN.md §7 — the motion system has exactly two homes and they must stay in
// step:
//   * JS tweens import the constants below. No duration, delay, stagger or ease
//     is written as a literal at a call site.
//   * CSS transitions cannot import JS, so they read the mirrored tokens in
//     src/styles/tokens.css (--ease, --dur-hover, --cascade). Those tokens are
//     the same values as DUR.hover, CHAR.cascade and EASE.
// Changing a value means changing it in both places. The previous version of
// this comment claimed no ad-hoc values existed anywhere, which was false in ten
// places — a source of truth whose first sentence is wrong is worse than none.

export const EASE = 'power3.out';

export const DUR = {
  reveal: 1.4,      // 1.2–1.5s
  heroReveal: 1.5,  // §6.1 gives the hero load reveal its own, longer rise
  hover: 0.65,      // 0.6–0.7s — mirrored as --dur-hover in tokens.css
  wipe: 1.2,        // section-heading clip wipe
  rule: 1.2,        // §6.4 hairline rule drawing left to right
  fade: 0.6,        // opacity-only fades (the hero ambient loop)
  cascadeStep: 0.4, // the character cascade is a rebuild, not a fade — at DUR.hover it stops reading as sequential
  count: 0.4,       // numeral count-up — mechanical, not decorative
};

export const STAGGER = 0.08; // 80ms

// Typography-effect constants. Every duration and stagger used by the effects
// pass lives here — no ad-hoc numbers at the call sites (§7).
export const CHAR = {
  heroStagger: 0.09,   // 90ms between hero characters
  kanaDelay: 0.2,      // kana follows the latin by 200ms
  cascade: 0.025,      // 25ms — mirrored as --cascade in tokens.css
  mediaDelay: 0.8,     // §6.1: the hero loop fades in at 800ms
};

export const ENTER_CHAR = {
  rotate: 2,   // degrees, resolves to 0
  blur: 4,     // px, resolves to 0
};

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

// DESIGN.md §6 + §7 — Phase 3 motion pass. Every tween uses the constants from
// ./motion.js. The pinned Manifesto scrub (§6.2) lives in its own component and
// is deliberately not driven from here.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, DUR, STAGGER, SCRUB, ENTER } from './motion';
import { prefersReducedMotion } from './reducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Singleton, matching initSmoothScroll. React StrictMode double-invokes effects
// in dev (mount → cleanup → mount); without this guard the second pass built a
// duplicate set of tweens whose immediateRender re-applied every start value,
// leaving the hero frozen at its 110% offset instead of animating to rest.
let initialized = false;

export function initAnimations() {
  if (initialized) return;
  initialized = true;

  const reduced = prefersReducedMotion();
  const scrub = reduced ? true : SCRUB;

  // ---- Hero: masked load reveal, 1.5s power3.out, 90ms stagger ----
  // The pre-animation state lives in CSS (styles/layout.css), NOT in a .set()
  // here — setting it after mount painted the title at rest first and then
  // pushed it back down, a visible flash. fromTo's immediateRender matches the
  // value CSS already applied, so nothing moves backwards on first paint.
  // fromTo with an EXPLICIT yPercent start. gsap.to cannot be used here: the
  // start value comes from CSS, and getComputedStyle resolves translateY(110%)
  // to a pixel matrix, so GSAP would read y:270.6px / yPercent:0 and animating
  // yPercent→0 becomes a no-op that leaves the title stranded. immediateRender
  // writes exactly the value CSS already painted, so there is no visible jump,
  // and the singleton guard above means it is asserted only once.
  const heroTargets = gsap.utils.toArray('#hero [data-reveal]');
  if (heroTargets.length) {
    if (reduced) {
      gsap.set(heroTargets, { yPercent: ENTER.textYPercentTo });
    } else {
      // `y: 0` is load-bearing, not decoration. GSAP composes the final
      // transform as translate(yPercent% + y), and it parses the CSS matrix
      // into y: 270.6px. Without zeroing y, the tween runs yPercent 110→0
      // correctly and still lands on translate(0px, 270.6px) — the title
      // animates to the wrong resting place.
      gsap.fromTo(
        heroTargets,
        { yPercent: ENTER.heroYPercentFrom, y: 0 },
        { yPercent: ENTER.textYPercentTo, y: 0, duration: 1.5, ease: EASE, stagger: 0.09 }
      );
    }
  }

  const heroMedia = document.querySelector('#hero .hero__media');
  if (heroMedia) {
    if (reduced) {
      gsap.set(heroMedia, { opacity: ENTER.heroOpacityTo });
    } else {
      gsap.fromTo(
        heroMedia,
        { opacity: 0 },
        { opacity: ENTER.heroOpacityTo, duration: 0.6, delay: 0.8, ease: EASE }
      );
    }
  }

  // ---- Manifesto ----
  // Not handled here. The manifesto is now a pinned, scrubbed section sharing
  // one timeline with the frame sequence (§6.2) — its line reveals are a pure
  // function of ScrollTrigger.progress inside src/sections/Manifesto.jsx, so a
  // separate trigger here would fight it.

  // ---- 間: marquee xPercent -34 scrubbed, video scale 1.25 → 1.0 scrubbed ----
  const maSection = document.getElementById('ma');
  if (maSection) {
    const track = maSection.querySelector('.ambient-break__marquee-track');
    const media = maSection.querySelector('.ambient-media');
    if (track) {
      gsap.to(track, {
        xPercent: -34,
        ease: 'none',
        scrollTrigger: {
          trigger: maSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub,
        },
      });
    }
    if (media) {
      gsap.fromTo(
        media,
        { scale: 1.25 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: maSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
          },
        }
      );
    }
  }

  // ---- The Method: items stagger 80ms, rule draws left→right ----
  // The left heading uses CSS `position: sticky` (method.css) rather than a
  // ScrollTrigger pin — visually equivalent for a single always-in-flow column
  // and avoids a second pinning mechanism fighting the Lenis/ScrollTrigger
  // bridge. Flagged as a deliberate deviation from a literal GSAP pin in the
  // phase report.
  const methodItems = gsap.utils.toArray('[data-method-item]');
  gsap.set(methodItems, { opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 });
  gsap.set('[data-method-rule]', { scaleX: reduced ? 1 : 0 });
  if (!reduced && methodItems.length) {
    ScrollTrigger.batch(methodItems, {
      start: 'top 82%',
      onEnter: (batch) => {
        gsap.to(batch, { opacity: 1, y: 0, duration: DUR.reveal, ease: EASE, stagger: STAGGER });
        const rules = batch.map((el) => el.querySelector('[data-method-rule]')).filter(Boolean);
        gsap.to(rules, { scaleX: 1, duration: 1.2, ease: EASE, stagger: STAGGER });
      },
    });
  }

  // ---- Roast break: video scale scrub only ----
  const roastSection = document.getElementById('roast');
  if (roastSection) {
    const media = roastSection.querySelector('.ambient-media');
    if (media) {
      gsap.fromTo(
        media,
        { scale: 1.25 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: roastSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
          },
        }
      );
    }
  }

  // ---- Selection: rows stagger in (hover is CSS, see selection.css) ----
  const selectionRows = gsap.utils.toArray('.selection__row');
  gsap.set(selectionRows, { opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 });
  if (!reduced && selectionRows.length) {
    ScrollTrigger.batch(selectionRows, {
      start: 'top 90%',
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: DUR.reveal, ease: EASE, stagger: STAGGER }),
    });
  }

  // ---- The Room: scale 1.12→1.0 + clip-path wipe from bottom, parallax scrub ----
  gsap.utils.toArray('.room__plate').forEach((plate) => {
    const el = plate.querySelector('.room-elevation');
    if (!el) return;
    gsap.set(el, {
      scale: reduced ? 1 : ENTER.imageScaleFrom,
      clipPath: reduced ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
    });
    if (!reduced) {
      gsap.to(el, {
        scale: ENTER.imageScaleTo,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: DUR.reveal,
        ease: EASE,
        scrollTrigger: { trigger: plate, start: 'top 85%' },
      });
      gsap.to(el, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: plate,
          start: 'top bottom',
          end: 'bottom top',
          scrub,
        },
      });
    }
  });

  // ---- Rail scroll-progress hairline (chrome, DESIGN.md §5) ----
  const railProgress = document.querySelector('.rail__progress');
  const pageContent = document.querySelector('.page-content');
  if (railProgress && pageContent) {
    gsap.to(railProgress, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: pageContent,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  }

  ScrollTrigger.refresh();
}

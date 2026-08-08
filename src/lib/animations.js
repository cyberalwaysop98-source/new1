// DESIGN.md §6 + §7 — Phase 3 motion pass. Every tween uses the constants from
// ./motion.js. The pinned Manifesto scrub (§6.2) lives in its own component and
// is deliberately not driven from here.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, DUR, STAGGER, SCRUB, ENTER, CHAR, ENTER_CHAR } from './motion';
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
  // Latin rises character by character; each glyph carries a 2deg rotation and a
  // 4px blur that resolve as it settles. The kana follows 200ms later, top to
  // bottom. y:0 is load-bearing here for the same reason as before — GSAP
  // composes translate(yPercent% + y) and parses the CSS matrix into y.
  const heroChars = gsap.utils.toArray('#hero .hero__chars [data-char]');
  const heroKana = gsap.utils.toArray('#hero .hero__kana-chars [data-char]');
  const heroLede = gsap.utils.toArray('#hero .hero__lede [data-reveal]');
  const heroCta = gsap.utils.toArray('#hero .hero__cta[data-reveal]');
  const restChar = { yPercent: 0, y: 0, rotate: 0, filter: 'blur(0px)' };

  if (reduced) {
    gsap.set([...heroChars, ...heroKana], restChar);
    gsap.set([...heroLede, ...heroCta], { yPercent: 0, y: 0 });
  } else {
    gsap.fromTo(
      heroChars,
      { yPercent: 110, y: 0, rotate: ENTER_CHAR.rotate, filter: `blur(${ENTER_CHAR.blur}px)` },
      { ...restChar, duration: DUR.heroReveal, ease: EASE, stagger: CHAR.heroStagger }
    );
    gsap.fromTo(
      heroKana,
      { yPercent: 110, y: 0, rotate: ENTER_CHAR.rotate, filter: `blur(${ENTER_CHAR.blur}px)` },
      {
        ...restChar,
        duration: DUR.heroReveal,
        ease: EASE,
        stagger: CHAR.heroStagger,
        delay: CHAR.kanaDelay,
      }
    );
    gsap.fromTo(
      [...heroLede, ...heroCta],
      { yPercent: ENTER.heroYPercentFrom, y: 0 },
      { yPercent: 0, y: 0, duration: DUR.heroReveal, ease: EASE, delay: CHAR.kanaDelay, stagger: 0.15 }
    );
  }

  const heroMedia = document.querySelector('#hero .hero__media');
  if (heroMedia) {
    if (reduced) {
      gsap.set(heroMedia, { opacity: ENTER.heroOpacityTo });
    } else {
      gsap.fromTo(
        heroMedia,
        { opacity: 0 },
        { opacity: ENTER.heroOpacityTo, duration: DUR.fade, delay: CHAR.mediaDelay, ease: EASE }
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
        gsap.to(rules, { scaleX: 1, duration: DUR.rule, ease: EASE, stagger: STAGGER });
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

  // §6.6's 22px hover shift, driven by GSAP rather than CSS. It cannot be a
  // stylesheet :hover rule: the reveal above leaves an INLINE transform on the
  // row (translate(0px, 0px)), and inline beats the stylesheet, so the shift
  // silently never applied. quickTo writes the same inline transform GSAP
  // already owns, so the two compose instead of fighting.
  selectionRows.forEach((row) => {
    if (reduced) return;
    const xTo = gsap.quickTo(row, 'x', { duration: DUR.hover, ease: EASE });
    const on = () => xTo(22);
    const off = () => xTo(0);
    row.addEventListener('pointerenter', on);
    row.addEventListener('pointerleave', off);
    row.addEventListener('focus', on);
    row.addEventListener('blur', off);
  });

  // ---- The Room: clip-path wipe on the static band, scale + parallax on the
  // ground layer inside it. The two are deliberately split: transforming the
  // band itself made a full-width element 12% wider than the viewport (measured
  // -46..2606 at 2560), while clip-path is paint-only and cannot overflow.
  gsap.utils.toArray('.room__plate').forEach((plate) => {
    const face = plate.querySelector('.room__face');
    const ground = plate.querySelector('.room__ground');
    if (!face || !ground) return;
    gsap.set(face, {
      clipPath: reduced ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
    });
    gsap.set(ground, { scale: reduced ? 1 : ENTER.imageScaleFrom });
    if (!reduced) {
      gsap.to(face, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: DUR.reveal,
        ease: EASE,
        scrollTrigger: { trigger: plate, start: 'top 85%' },
      });
      gsap.to(ground, {
        scale: ENTER.imageScaleTo,
        duration: DUR.reveal,
        ease: EASE,
        scrollTrigger: { trigger: plate, start: 'top 85%' },
      });
      gsap.to(ground, {
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

  // ---- Section headings: clip reveal left to right ----
  gsap.utils.toArray('[data-wipe]').forEach((head) => {
    const text = head.querySelector('.heading-wipe__text');
    if (!text) return;
    if (reduced) {
      gsap.set(text, { clipPath: 'inset(0 0% 0 0)' });
      return;
    }
    gsap.fromTo(
      text,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: DUR.wipe,
        ease: EASE,
        scrollTrigger: { trigger: head, start: 'top 85%' },
      }
    );
  });

  // ---- The Method: numerals count up while the title masks in ----
  // Mechanical on purpose — 400ms, two digits, no easing flourish beyond the
  // shared curve. It should read as instrumentation.
  gsap.utils.toArray('[data-method-num]').forEach((num) => {
    const to = parseInt(num.dataset.countTo, 10);
    const title = num.closest('[data-method-item]')?.querySelector('[data-method-title]');
    if (reduced) {
      num.textContent = String(to).padStart(2, '0');
      if (title) gsap.set(title, { yPercent: 0 });
      return;
    }
    const counter = { v: 0 };
    ScrollTrigger.create({
      trigger: num.closest('[data-method-item]'),
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          v: to,
          duration: DUR.count,
          ease: EASE,
          onUpdate: () => {
            num.textContent = String(Math.round(counter.v)).padStart(2, '0');
          },
        });
        if (title) {
          gsap.fromTo(
            title,
            { yPercent: ENTER.textYPercentFrom },
            { yPercent: 0, duration: DUR.reveal, ease: EASE }
          );
        }
      },
    });
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

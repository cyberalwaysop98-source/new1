// DESIGN.md §6 + §7 — Phase 3 motion pass. Every tween uses the constants from
// ./motion.js. The Ritual (§6.5) is explicitly out of scope here — it stays a
// static canvas until Phase 4, which this pass does not run.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, DUR, STAGGER, SCRUB, ENTER } from './motion';
import { prefersReducedMotion } from './reducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  const reduced = prefersReducedMotion();
  const scrub = reduced ? true : SCRUB;

  // ---- Hero: masked load reveal, 1.5s power3.out, 90ms stagger ----
  const heroTargets = gsap.utils.toArray('#hero [data-reveal]');
  gsap.set(heroTargets, { yPercent: reduced ? 0 : ENTER.textYPercentFrom });
  if (!reduced && heroTargets.length) {
    gsap.to(heroTargets, {
      yPercent: ENTER.textYPercentTo,
      duration: 1.5,
      ease: EASE,
      stagger: 0.09,
    });
  }

  const heroMedia = document.querySelector('#hero .hero__media');
  if (heroMedia) {
    if (reduced) {
      gsap.set(heroMedia, { opacity: 0.22 });
    } else {
      gsap.fromTo(
        heroMedia,
        { opacity: 0 },
        { opacity: 0.22, duration: 0.6, delay: 0.8, ease: EASE }
      );
    }
  }

  // ---- Manifesto: one masked line at a time, trigger 'top 88%' ----
  gsap.utils.toArray('.manifesto [data-reveal="manifesto"]').forEach((el) => {
    gsap.set(el, { yPercent: reduced ? 0 : ENTER.textYPercentFrom });
    if (!reduced) {
      gsap.to(el, {
        yPercent: ENTER.textYPercentTo,
        duration: DUR.reveal,
        ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    }
  });

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

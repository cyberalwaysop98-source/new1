import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { renderRitual } from '../lib/ritualProcedural';
import { createFrameLoader } from '../lib/ritualFrames';
import {
  FRAMES,
  USE_FRAMES,
  ritualFrames,
  ritualFramesPortrait,
  NARROW_BREAKPOINT,
} from '../assets/manifest';
import { SCRUB, EASE, ENTER } from '../lib/motion';
import { prefersReducedMotion } from '../lib/reducedMotion';
import './manifesto.css';

gsap.registerPlugin(ScrollTrigger);

// ONE predicate drives both the frame set and the layout, so they can never
// disagree: below NARROW_BREAKPOINT the section serves the 4:5 portrait crop and
// the narrow layout; above it, the 16:9 master and full-bleed cover.
const isNarrow = (w) => w < NARROW_BREAKPOINT;
const setFor = (w) => (isNarrow(w) ? ritualFramesPortrait : ritualFrames);
const aspectOf = (set) => set.width / set.height;

// Narrow branch: the frame is contained to the full width but capped so a type
// band always survives beneath it. Without the cap a landscape phone (say
// 880×500) would compute a taller-than-viewport image and push the text off
// screen entirely.
const NARROW_MAX_H = 0.6;

const LINES = [
  { side: 'right', text: 'There is no music, no wifi, and no second cup.' },
  { side: 'left', text: 'The beans are ground when you sit down, not before.' },
  { side: 'right', text: null }, // line 3 carries emphasis markup, see JSX
];

// §6.2 timeline. Segments never overlap, which is what guarantees "one line
// moving at a time" under a SCRUB. A serial promise-queue cannot do that job
// here: a queue plays tweens to completion in order and has no meaning when the
// user scrubs backwards, so the ordering is expressed in the timeline itself.
// in/out are the reveal and exit windows; between them the line simply holds.
const STEPS = [
  { in: [0.15, 0.24], out: [0.4, 0.47] },
  { in: [0.47, 0.56], out: [0.65, 0.72] },
  { in: [0.72, 0.81], out: [0.9, 0.97] },
];

export default function Manifesto() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const lineRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    let activeSet = setFor(window.innerWidth);
    let loader = USE_FRAMES ? createFrameLoader(activeSet) : null;

    let view = { w: 0, h: 0, dpr: 1 };

    function fitCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      const bw = Math.round(w * dpr);
      const bh = Math.round(h * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      view = { w, h, dpr };
      publishImageBox(w, h);
    }

    // The type lives in the bleed, so the layout has to know exactly where the
    // contained image sits. Publish it as custom properties and let CSS place
    // the lines against it — no magic numbers, correct at every viewport.
    function boxFor(w, h, ir) {
      if (!isNarrow(w)) {
        // cover
        return { dw: Math.max(w, h * ir), dh: Math.max(h, w / ir), top: null };
      }
      let dw = w;
      let dh = w / ir;
      const maxH = h * NARROW_MAX_H;
      if (dh > maxH) {
        dh = maxH;
        dw = maxH * ir;
      }
      return { dw, dh, top: 0 };
    }

    function publishImageBox(w, h) {
      const narrow = isNarrow(w);
      const { dw, dh, top } = boxFor(w, h, aspectOf(setFor(w)));
      section.style.setProperty('--img-b', `${(top === null ? (h - dh) / 2 : top) + dh}px`);
      section.classList.toggle('manifesto--narrow', narrow);
      return { dw, dh };
    }

    // Landscape viewports COVER the 16:9 master, full-bleed edge to edge.
    // Narrow viewports contain the 4:5 crop, top-anchored, with the type in the
    // band beneath. clearRect leaves any uncovered ground as the element's own
    // background, var(--sumi).
    function drawFrame(img) {
      const { w, h, dpr } = view;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const ir = img.naturalWidth / img.naturalHeight;
      const { dw, dh, top } = boxFor(w, h, ir);
      ctx.drawImage(img, (w - dw) / 2, top === null ? (h - dh) / 2 : top, dw, dh);
    }

    function render(p) {
      const clamped = Math.min(1, Math.max(0, p));
      if (!USE_FRAMES) {
        ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
        renderRitual(ctx, clamped, view.w, view.h, 0);
        return;
      }
      const index = reduced
        ? [0, Math.floor((FRAMES - 1) / 2), FRAMES - 1][
            Math.min(2, Math.floor(clamped * 3))
          ]
        : Math.round(clamped * (FRAMES - 1));
      const img = loader.getDrawable(index);
      if (img) drawFrame(img);
    }

    fitCanvas();

    let trigger;
    let progress = 0;

    // Masked enter/exit, yPercent 105 -> 0 -> 105. Position is a pure function
    // of progress, so scrubbing backwards reverses exactly.
    function renderLines(p) {
      if (reduced) return;
      const els = lineRefs.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const s = STEPS[i];
        let t;
        if (p < s.in[0]) t = 0;
        else if (p < s.in[1]) t = (p - s.in[0]) / (s.in[1] - s.in[0]);
        else if (p < s.out[0]) t = 1;
        else if (p < s.out[1]) t = 1 - (p - s.out[0]) / (s.out[1] - s.out[0]);
        else t = 0;
        const eased = gsap.parseEase(EASE)(Math.min(1, Math.max(0, t)));
        const gone = p >= s.out[1] || p < s.in[0];
        el.style.transform = `translateY(${(1 - eased) * ENTER.textYPercentFrom}%)`;
        el.style.opacity = gone ? '0' : '1';
      }
    }

    function paint() {
      render(progress);
      renderLines(progress);
    }

    trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      // '%' not 'vh' — ScrollTrigger does not parse CSS units (§7).
      end: reduced ? '+=100%' : '+=340%',
      pin: true,
      // Pin by transform, not position:fixed. The default 'fixed' pinType makes
      // the browser treat the pin engaging as an abrupt layout change and it
      // scored CLS 0.625 on a single entry (canvas 0x0 -> full size) the moment
      // the section pinned. Transforms never generate layout-shift entries, and
      // it is also the correct pinType alongside a smooth-scroll library (§7).
      pinType: 'transform',
      scrub: reduced ? true : SCRUB,
      onUpdate: (self) => {
        progress = self.progress;
        paint();
      },
      onRefresh: () => {
        fitCanvas();
        paint();
      },
    });

    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      once: true,
      onEnter: () => loader && loader.loadRest(),
    });

    if (reduced) {
      // §7: three static keyframes, all three lines visible at once.
      lineRefs.current.forEach((el) => {
        if (!el) return;
        el.style.transform = 'translateY(0%)';
        el.style.opacity = '1';
      });
    }

    if (USE_FRAMES) {
      loader.loadEager().then(() => {
        fitCanvas();
        paint();
      });
    }
    paint();
    ScrollTrigger.refresh();

    let raf = 0;
    function onResize() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Crossing the breakpoint swaps the frame set, so the loader is rebuilt
        // against the new paths rather than drawing the wrong aspect.
        const next = setFor(window.innerWidth);
        if (USE_FRAMES && next !== activeSet) {
          activeSet = next;
          loader = createFrameLoader(activeSet);
          loader.loadEager().then(() => {
            loader.loadRest();
            fitCanvas();
            paint();
          });
        }
        fitCanvas();
        paint();
        ScrollTrigger.refresh();
      });
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      if (trigger) trigger.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === section)
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="manifesto" className="manifesto" ref={sectionRef}>
      <canvas ref={canvasRef} className="manifesto__canvas" />

      {LINES.map((l, i) => (
        <div key={i} className={`manifesto__slot manifesto__slot--${l.side}`}>
          <p className="manifesto-line reveal-mask">
            <span
              className="reveal-mask__inner"
              data-manifesto-line
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
            >
              {i === 2 ? (
                <>
                  What arrives will take <strong>four minutes</strong>. Please let it.
                </>
              ) : (
                l.text
              )}
            </span>
          </p>
        </div>
      ))}
    </section>
  );
}

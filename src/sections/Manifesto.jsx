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
import { SCRUB, EASE, ENTER, CHAR, DUR } from '../lib/motion';
import { prefersReducedMotion } from '../lib/reducedMotion';
import Words from '../components/Words';
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

// `em` is a [first, last] word index — the emphasis now lives in the data rather
// than in a branch in the JSX, because every line is word-split the same way and
// a special-cased third line could not be.
const LINES = [
  { side: 'right', text: 'There is no music, no wifi, and no second cup.' },
  { side: 'left', text: 'The beans are ground when you sit down, not before.' },
  { side: 'right', text: 'What arrives will take four minutes. Please let it.', em: [4, 5] },
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
  const slotRefs = useRef([]);
  const wordRefs = useRef([]);

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

    // Masked enter/exit, yPercent 105 -> 0 -> -105. The line rises in and keeps
    // rising out; it never retraces its own path (§6.2).
    //
    // The old form exited back down to +105 and drove BOTH halves off one ramp
    // `t` that rose 0->1 then fell 1->0. That had two costs. Each line travelled
    // 260px up and the same 260px back down, and with the near-static footage
    // behind them the three lines were the only high-contrast moving thing in
    // the viewport, so the retrace read as the whole frame sequence bouncing.
    // And EASE evaluated on a descending `t` is power3.**in**: the exit put
    // 87.5% of its travel in its final half, driving the text DOWN at ~2.1px per
    // px of scroll while the reader scrolled down. Both are gone: each phase now
    // runs its own ramp forward through EASE, so both decelerate.
    //
    // y stays a pure function of p, so scrubbing backwards still reverses exactly.
    const easeFn = gsap.parseEase(EASE);

    // §7.1 — the line reveals word by word, 60ms apart, rather than as one block.
    //
    // Under a scrub there is no clock, so CHAR.wordStagger cannot be applied as
    // a delay. It is expressed as a fraction of the band instead: 60ms measured
    // against DUR.reveal, the duration this rise would have had if it were timed.
    // Each word then gets its own sub-ramp inside the band, offset by that
    // fraction, and the tail is clamped so the last word still has at least 40%
    // of the band to travel in — otherwise a long line starves its final words.
    function wordSpan(band, n) {
      const raw = band * (CHAR.wordStagger / DUR.reveal);
      const step = Math.min(raw, (band * 0.6) / Math.max(1, n - 1));
      return { step, run: band - step * (n - 1) };
    }

    function renderLines(p) {
      if (reduced) return;
      const FROM = ENTER.textYPercentFrom;

      for (let i = 0; i < wordRefs.current.length; i++) {
        const words = wordRefs.current[i];
        if (!words || !words.length) continue;
        const s = STEPS[i];
        const n = words.length;
        const enter = wordSpan(s.in[1] - s.in[0], n);
        const exit = wordSpan(s.out[1] - s.out[0], n);

        for (let k = 0; k < n; k++) {
          const i0 = s.in[0] + k * enter.step;
          const o0 = s.out[0] + k * exit.step;
          let y;
          if (p < i0) y = FROM;
          else if (p < i0 + enter.run) y = (1 - easeFn((p - i0) / enter.run)) * FROM;
          else if (p < o0) y = ENTER.textYPercentTo;
          else if (p < o0 + exit.run) y = -easeFn((p - o0) / exit.run) * FROM;
          else y = -FROM;
          const gone = p >= o0 + exit.run || p < i0;
          words[k].style.transform = `translateY(${y}%)`;
          words[k].style.opacity = gone ? '0' : '1';
        }
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
      wordRefs.current.flat().forEach((el) => {
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
          <p
            className="manifesto-line"
            ref={(el) => {
              slotRefs.current[i] = el;
              wordRefs.current[i] = el ? [...el.querySelectorAll('[data-word]')] : [];
            }}
          >
            <Words text={l.text} em={l.em} />
          </p>
        </div>
      ))}
    </section>
  );
}

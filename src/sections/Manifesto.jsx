import { useEffect, useRef, useState } from 'react';
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

const isNarrow = (w) => w < NARROW_BREAKPOINT;
const setFor = (w) => (isNarrow(w) ? ritualFramesPortrait : ritualFrames);
const aspectOf = (set) => set.width / set.height;


// Signature Coffee Experience: 5 ritual stages
const STAGES = [
  { p: 0.00, kanji: '一 · 挽き', name: 'GRIND', desc: 'Granular bed · Ground at the seat' },
  { p: 0.18, kanji: '二 · 蒸らし', name: 'BLOOM', desc: 'Carbon dioxide rises · 30s expansion' },
  { p: 0.40, kanji: '三 · 注ぎ', name: 'POUR', desc: 'Thin thread of water · 92 degrees' },
  { p: 0.65, kanji: '四 · 滴り', name: 'DRIP', desc: '4 minutes · 3 pours · Dark draw' },
  { p: 0.88, kanji: '五 · 提供', name: 'SERVE', desc: 'Flat bed · Poured for the seat' },
];

// `em` is a [first, last] word index — the emphasis now lives in the data rather
// than in a branch in the JSX, because every line is word-split the same way and
// a special-cased third line could not be.
const LINES = [
  { side: 'right', text: 'There is no music, no wifi, and no second cup.' },
  { side: 'left', text: 'The beans are ground when you sit down, not before.' },
  { side: 'right', text: 'What arrives will take four minutes. Please let it.', em: [4, 5] },
];

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
  const [activeStage, setActiveStage] = useState(STAGES[0]);

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
      const w = Math.max(1, Math.round(rect.width || window.innerWidth));
      const h = Math.max(1, Math.round(rect.height || window.innerHeight));
      const bw = Math.round(w * dpr);
      const bh = Math.round(h * dpr);
      
      // Prevent 1px sub-pixel rounding jitter from clearing HTML5 canvas buffer
      if (Math.abs(canvas.width - bw) > 2 || Math.abs(canvas.height - bh) > 2) {
        canvas.width = bw;
        canvas.height = bh;
      }
      view = { w, h, dpr };
      publishImageBox(w, h);
    }

    function boxFor(w, h, ir) {
      let dw = w;
      let dh = w / ir;
      if (dh > h) {
        dh = h;
        dw = h * ir;
      }
      const left = (w - dw) / 2;
      const top = (h - dh) / 2;
      return { dw, dh, left, top };
    }

    function publishImageBox(w, h) {
      const { dw, dh, top } = boxFor(w, h, aspectOf(setFor(w)));
      section.style.setProperty('--img-b', `${top + dh}px`);
      return { dw, dh };
    }

    function drawFrame(img) {
      const { w, h, dpr } = view;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const ir = (img.naturalWidth && img.naturalHeight) ? (img.naturalWidth / img.naturalHeight) : (16 / 9);
      const { dw, dh, left, top } = boxFor(w, h, ir);
      ctx.drawImage(img, left, top, dw, dh);
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
        : Math.min(FRAMES - 1, Math.max(0, Math.round(clamped * (FRAMES - 1))));
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

    // main's ritual stage indicator (GRIND -> BLOOM -> POUR -> DRIP -> SERVE).
    // Driven from the same progress as the scrub, so it cannot drift from it.
    function updateStage(p) {
      let st = STAGES[0];
      for (let i = 0; i < STAGES.length; i++) {
        if (p >= STAGES[i].p) st = STAGES[i];
      }
      setActiveStage((prev) => (prev.name !== st.name ? st : prev));
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
      updateStage(progress);
    }

    trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: reduced ? '+=100%' : '+=340%',
      pin: true,
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
      <div className="manifesto__canvas-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <canvas ref={canvasRef} className="manifesto__canvas" />
        
        <div className="manifesto__stage-bar eyebrow" aria-live="polite" aria-atomic="true">
          <span className="manifesto__stage-kanji">{activeStage.kanji}</span>
          <span className="manifesto__stage-sep">/</span>
          <span className="manifesto__stage-name">{activeStage.name}</span>
          <span className="manifesto__stage-desc">{activeStage.desc}</span>
        </div>
      </div>

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


import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { renderRitual } from '../lib/ritualProcedural';
import { createFrameLoader } from '../lib/ritualFrames';
import { FRAMES, USE_FRAMES } from '../assets/manifest';
import { SCRUB } from '../lib/motion';
import { prefersReducedMotion } from '../lib/reducedMotion';
import './ritual.css';

gsap.registerPlugin(ScrollTrigger);

const CAPTIONS = ['一 湯', '二 蒸らし', '三 抽出'];

// DESIGN.md §7 reduced-motion branch: three static keyframes rather than a
// continuous scrub. Evenly spaced across the sequence.
const KEYFRAMES = [0, Math.floor((FRAMES - 1) / 2), FRAMES - 1];

export default function Ritual() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const captionRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    const loader = USE_FRAMES ? createFrameLoader() : null;

    // ---- DPR-aware sizing. The backing store follows the DISPLAYED box, not
    // the source frame dimensions. Capped at 2 because beyond that the extra
    // pixels cost fill-rate during the scrub for no visible gain (§9: 60fps on
    // a mid-range Android).
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
    }

    // ---- cover, centre-anchored (§6.5) ----
    function drawCover(img) {
      const { w, h, dpr } = view;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = w / h;
      let dw;
      let dh;
      if (cr > ir) {
        dw = w;
        dh = w / ir;
      } else {
        dh = h;
        dw = h * ir;
      }
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }

    // ---- the single render(p) the whole section is driven by ----
    function render(p) {
      const clamped = Math.min(1, Math.max(0, p));
      if (!USE_FRAMES) {
        ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
        renderRitual(ctx, clamped, view.w, view.h, 0);
        return;
      }
      const index = reduced
        ? KEYFRAMES[Math.min(KEYFRAMES.length - 1, Math.floor(clamped * KEYFRAMES.length))]
        : Math.round(clamped * (FRAMES - 1));
      const img = loader.getDrawable(index);
      if (img) drawCover(img);
    }

    // ---- captions: cross-fade across thirds (§6.5). Under reduced motion all
    // three stay visible and static instead.
    function renderCaptions(p) {
      if (reduced) return;
      const els = captionRefs.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const local = p * 3 - i;
        const o = Math.max(0, Math.min(1, Math.min(local * 4, (1 - local) * 4)));
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 22}px)`;
      }
    }

    fitCanvas();
    if (reduced) captionRefs.current.forEach((el) => el && (el.style.opacity = '1'));

    let trigger;
    let progress = 0;

    function paint() {
      render(progress);
      renderCaptions(progress);
    }

    function start() {
      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        // §7: the reduced-motion pin is a short, legible triptych — never a
        // 340%-tall section with nothing happening in it.
        // NOTE: '%' not 'vh'. ScrollTrigger's end string takes px or a
        // percentage OF THE VIEWPORT; it does not parse CSS units, so '+=100vh'
        // silently resolves to 100 PIXELS (measured: pin-spacer 1000px against a
        // 900px viewport). '+=100%' is the correct spelling of §7's "+=100vh".
        end: reduced ? '+=100%' : '+=340%',
        pin: true,
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

      // Lazy remainder once the section is within a viewport of entering.
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        once: true,
        onEnter: () => loader && loader.loadRest(),
      });

      paint();
      ScrollTrigger.refresh();
    }

    if (USE_FRAMES) {
      // Paint frame 0 as soon as it can be drawn, before wiring the scrub, so
      // the section is never blank on first entry.
      loader.loadEager().then(() => {
        fitCanvas();
        paint();
      });
    }
    start();

    // Re-fit on resize, then refresh so pin distance and start/end are
    // recomputed against the new geometry.
    let resizeRaf = 0;
    function onResize() {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        fitCanvas();
        paint();
        ScrollTrigger.refresh();
      });
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(resizeRaf);
      // Kill only this section's triggers — never ScrollTrigger.getAll().
      if (trigger) trigger.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === section)
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    /* Not .section — that carries --gut padding, and this one is full-bleed. */
    <section id="ritual" className="ritual" ref={sectionRef}>
      {/* Full-bleed behind everything; the backing store is sized to the
          displayed box by fitCanvas, and cover-fit absorbs the aspect mismatch
          between the 1920×2880 source and the viewport. */}
      <canvas ref={canvasRef} className="ritual__canvas" />
      <div className="ritual__scrim" aria-hidden="true" />

      <div className="ritual__intro">
        <span className="tategaki ritual__jp">抽出</span>
        <h2 className="h-section">Four minutes</h2>
        <span className="eyebrow">四分間</span>
      </div>

      <div className="ritual__foot">
        <span className="eyebrow ritual__temp">92°C</span>
        <div className="ritual__captions">
          {CAPTIONS.map((c, i) => (
            <p
              key={c}
              className="eyebrow ritual__caption"
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
            >
              {c}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

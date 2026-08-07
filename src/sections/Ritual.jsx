import { useEffect, useRef } from 'react';
import { renderRitual } from '../lib/ritualProcedural';
import { ritualFrames, USE_FRAMES } from '../assets/manifest';
import './ritual.css';

// Phase 2: static only — no ScrollTrigger, no scrubbing (that's Phase 4, not run
// in this pass). The canvas paints once, at progress 0, using the exact
// render(p, t) contract the real frame sequence will use later.
export default function Ritual() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = ritualFrames.width * dpr;
    canvas.height = ritualFrames.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!USE_FRAMES) {
      renderRitual(ctx, 0, ritualFrames.width, ritualFrames.height, 0);
    }
    // USE_FRAMES path (real decoded frame draw) is wired in Phase 4.
  }, []);

  return (
    <section id="ritual" className="section ritual">
      <div className="ritual__intro">
        <span className="tategaki ritual__jp">抽出</span>
        <h2 className="h-section">Four minutes</h2>
        <span className="eyebrow">四分間</span>
      </div>

      <div className="ritual__stage">
        <canvas
          ref={canvasRef}
          className="ritual__canvas"
          style={{ aspectRatio: `${ritualFrames.width} / ${ritualFrames.height}` }}
        />
        <div className="ritual__captions">
          <p className="eyebrow ritual__caption">一 湯</p>
          <p className="eyebrow ritual__caption">二 蒸らし</p>
          <p className="eyebrow ritual__caption">三 抽出</p>
        </div>
        <span className="eyebrow ritual__temp">92°C</span>
      </div>
    </section>
  );
}

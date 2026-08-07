// DESIGN.md §5 — global overlays: film grain (SVG turbulence) and a radial
// vignette. Both fixed, pointer-events none, sit above all content.
import './overlays.css';

export default function Overlays() {
  return (
    <>
      <svg className="grain-source" aria-hidden="true" focusable="false">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
        </filter>
      </svg>
      <div className="grain-overlay" />
      <div className="vignette-overlay" />
    </>
  );
}

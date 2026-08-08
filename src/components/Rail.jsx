// DESIGN.md §5 — fixed vertical tategaki rail, right edge, with a scroll-progress
// hairline. Hides under 820px. The progress fill's height is driven by GSAP in
// src/lib/animations.js; here it starts at 0.
import Chars from './Chars';
import './rail.css';

export default function Rail() {
  return (
    <aside className="rail" aria-hidden="true">
      <Chars text="喫茶室" className="rail__label tategaki" vertical />
      <div className="rail__track">
        <div className="rail__progress" />
      </div>
    </aside>
  );
}

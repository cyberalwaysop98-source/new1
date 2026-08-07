// DESIGN.md §5 — fixed nav, mix-blend-mode difference so it reads over any background.
import './nav.css';

export default function Nav() {
  return (
    <header className="nav">
      <a href="#hero" className="nav__mark eyebrow">
        NOIR
      </a>
      <a href="#reserve" className="nav__cta eyebrow">
        予約 / Reserve
      </a>
    </header>
  );
}

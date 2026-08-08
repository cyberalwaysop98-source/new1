// DESIGN.md §5 — fixed nav, mix-blend-mode: difference so it reads over any
// background. Section links scroll through Lenis rather than jumping natively:
// a native anchor jump would bypass the smooth scroll entirely and, worse, land
// without emitting the scroll events ScrollTrigger listens on.
import { getLenis } from '../lib/smoothScroll';
import './nav.css';

const LINKS = [
  { href: '#selection', label: 'Selection' },
  { href: '#room', label: 'The Room' },
  { href: '#reserve', label: '予約 / Reserve' },
];

export default function Nav() {
  function go(e, href) {
    const target = document.querySelector(href);
    if (!target) return;
    const lenis = getLenis();
    // Only take over the event once Lenis is actually available. If it is not,
    // letting the browser do its native anchor jump is better than swallowing
    // the click.
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0 });
  }

  return (
    <header className="nav">
      <a href="#hero" className="nav__mark eyebrow" onClick={(e) => go(e, '#hero')}>
        NOIR
      </a>
      <nav className="nav__links">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="nav__link eyebrow"
            onClick={(e) => go(e, l.href)}
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

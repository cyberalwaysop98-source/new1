import { useState, useEffect, useRef } from 'react';
import { getLenis } from '../lib/smoothScroll';
import './nav.css';

const LINKS = [
  { href: '#manifesto', num: '01', label: 'ROOM' },
  { href: '#method', num: '02', label: 'METHOD' },
  { href: '#selection', num: '03', label: 'SELECTION' },
  { href: '#reserve', num: '04', label: 'RESERVE' },
];

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100 && currentScrollY > lastScrollY.current + 10) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY.current - 10 || currentScrollY <= 50) {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  function go(e, href) {
    const target = document.querySelector(href);
    if (!target) return;
    const lenis = getLenis();
    if (mobileOpen) setMobileOpen(false);
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0 });
  }

  return (
    <>
      <header className={`nav ${hidden ? 'nav--hidden' : ''}`}>
        <a href="#hero" className="nav__mark eyebrow" onClick={(e) => go(e, '#hero')}>
          NOIR
        </a>

        <nav className="nav__desktop-links" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav__link eyebrow"
              onClick={(e) => go(e, l.href)}
            >
              <span className="nav__num">{l.num}</span> {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="nav__mobile-toggle eyebrow"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? '閉じる / CLOSE' : '目録 / MENU'}
        </button>
      </header>

      {/* Editorial Mobile Navigation Overlay */}
      <div className={`nav__overlay ${mobileOpen ? 'nav__overlay--open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="nav__overlay-backdrop" onClick={() => setMobileOpen(false)} />
        <div className="nav__overlay-content">
          <div className="nav__overlay-header eyebrow">
            <span>NOIR · 喫茶室</span>
            <span>TOMIGAYA</span>
          </div>

          <nav className="nav__overlay-links" aria-label="Mobile Navigation">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="nav__overlay-link"
                onClick={(e) => go(e, l.href)}
              >
                <span className="nav__overlay-num eyebrow">{l.num}</span>
                <span className="menu-name nav__overlay-label">{l.label}</span>
              </a>
            ))}
          </nav>

          <div className="nav__overlay-footer">
            <div className="eyebrow">
              <span>HOURS: WED–SUN 08:00–19:00</span>
              <br />
              <span>2-14-6 TOMIGAYA, SHIBUYA-KU</span>
            </div>
            <a
              href="mailto:reserve@noir.jp"
              className="eyebrow nav__overlay-cta"
            >
              RESERVE A SEAT →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}


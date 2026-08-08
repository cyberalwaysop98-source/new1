import AmbientMedia from '../components/AmbientMedia';
import { ambient } from '../assets/manifest';
import './footer.css';

const LINKS = [
  { label: '01 REQUEST A SEAT', href: 'mailto:reserve@noir.jp?subject=Reservation%20request%20%E2%80%94%20NOIR' },
  { label: '02 FIND THE ROOM', href: 'https://maps.google.com/?q=2-14-6+Tomigaya,+Shibuya-ku,+Tokyo' },
  { label: '03 TEL +81 3 6407 0000', href: 'tel:+81364070000' },
  { label: '04 INSTAGRAM', href: 'https://instagram.com' },
];

export default function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer__media">
        <AmbientMedia
          webm={ambient.close.webm}
          mp4={ambient.close.mp4}
          poster={ambient.close.poster}
          alt=""
          variant="close"
        />
      </div>

      <div className="footer__content">
        <div className="footer__top-bar eyebrow">
          <span>07 · COLOPHON & INVITATION / 結び</span>
          <span>TOMIGAYA / TOKYO</span>
        </div>

        <div className="footer__invitation">
          <div className="footer__invitation-text">
            <span className="eyebrow footer__invitation-tag">FIND THE ROOM</span>
            <h3 className="menu-name footer__invitation-head">
              NOIR — 喫茶室
            </h3>
            <p className="body-text footer__invitation-body">
              Seven seats in Tomigaya. Seven cups drawn slowly over binchōtan.
              We open at eight in the morning.
            </p>
          </div>

          <a
            className="eyebrow footer__primary-cta"
            href="https://maps.google.com/?q=2-14-6+Tomigaya,+Shibuya-ku,+Tokyo"
            target="_blank"
            rel="noopener noreferrer"
          >
            FIND THE ROOM →
          </a>
        </div>

        <div className="footer__brand-row">
          <span className="footer__mark">NOIR</span>
          <span className="footer__tategaki tategaki">喫茶室</span>
        </div>

        <hr className="hairline footer__rule" />

        <nav className="footer__links" aria-label="Footer Navigation">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="eyebrow footer__link"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}


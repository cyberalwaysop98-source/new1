import AmbientMedia from '../components/AmbientMedia';
import { ambient } from '../assets/manifest';
import './footer.css';

const LINKS = [
  { label: 'Reserve', href: '#reserve' },
  { label: 'reserve@noir.jp', href: 'mailto:reserve@noir.jp?subject=Reservation%20request%20%E2%80%94%20NOIR' },
  { label: '+81 3 6407 0000', href: 'tel:+81364070000' },
  { label: 'Directions', href: 'https://maps.google.com/?q=2-14-6+Tomigaya,+Shibuya-ku,+Tokyo' },
  { label: 'Instagram', href: 'https://instagram.com' },
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
        <span className="footer__mark">NOIR</span>
        <hr className="hairline footer__rule" />
        <nav className="footer__links">
          {LINKS.map((link) => (
            <a key={link.label} href={link.href} className="eyebrow footer__link">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

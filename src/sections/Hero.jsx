import AmbientMedia from '../components/AmbientMedia';
import Chars from '../components/Chars';
import { ambient } from '../assets/manifest';
import { getLenis } from '../lib/smoothScroll';
import './hero.css';

export default function Hero() {
  function scrollToRoom(e) {
    const target = document.querySelector('#manifesto');
    if (!target) return;
    const lenis = getLenis();
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0 });
  }

  return (
    <section id="hero" className="hero">
      <div className="hero__media">
        <AmbientMedia
          webm={ambient.hero.webm}
          mp4={ambient.hero.mp4}
          poster={ambient.hero.poster}
          alt="Dark room with ambient light and drifting steam"
          variant="hero"
        />
      </div>

      <div className="hero__content">
        <div className="hero__top eyebrow">
          <span>TOMIGAYA · TOKYO · 喫茶室</span>
          <span>EST. 2019</span>
        </div>

        <div className="hero__title-row">
          <h1 className="h-hero hero__title">
            <Chars text="NOIR" className="hero__chars" />
          </h1>
          <div className="hero__kanji-col">
            <Chars text="喫茶室" className="tategaki hero__kana hero__kana-chars" vertical />
          </div>
        </div>

        <div className="hero__mid">
          <p className="body-text hero__lede reveal-mask">
            <span className="reveal-mask__inner" data-reveal="lede">
              We keep the room dark on purpose.
              <br />
              Light flatters coffee — shadow tells the truth about it.
            </span>
          </p>

          <div className="hero__cta-wrapper reveal-mask">
            <a
              href="#manifesto"
              className="eyebrow hero__cta"
              data-reveal="cta"
              onClick={scrollToRoom}
            >
              <span className="hero__cta-text">ENTER THE ROOM →</span>
            </a>
          </div>
        </div>

        <div className="hero__bottom eyebrow">
          <a href="#manifesto" className="hero__scroll" onClick={scrollToRoom}>
            <span className="hero__scroll-hairline" aria-hidden="true" />
            下へ / SCROLL
          </a>
          <span>七席のみ · SEVEN SEATS</span>
        </div>
      </div>
    </section>
  );
}


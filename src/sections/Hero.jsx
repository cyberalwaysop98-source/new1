import AmbientMedia from '../components/AmbientMedia';
import { ambient } from '../assets/manifest';
import { getLenis } from '../lib/smoothScroll';
import SplitText from '../components/reactbits/SplitText';
import BlurText from '../components/reactbits/BlurText';
import './hero.css';

export default function Hero() {
  function scrollToRoom(e) {
    const target = document.querySelector('#ma');
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
          <SplitText
            text="NOIR"
            tag="h1"
            className="h-hero hero__title"
            delay={90}
            splitBy="characters"
          />
          <div className="hero__kanji-col">
            <BlurText
              text="喫茶室"
              className="tategaki hero__kana"
              delay={140}
              animateBy="letters"
              direction="top"
            />
          </div>
        </div>

        <div className="hero__mid">
          <p className="body-text hero__lede">
            We keep the room dark on purpose. Light flatters coffee — shadow tells the truth about it.
          </p>

          <div className="hero__cta-wrapper">
            <a
              href="#ma"
              className="eyebrow hero__cta"
              onClick={scrollToRoom}
            >
              <span className="hero__cta-text">ENTER THE ROOM →</span>
            </a>
          </div>
        </div>

        <div className="hero__bottom eyebrow">
          <a href="#ma" className="hero__scroll" onClick={scrollToRoom}>
            <span className="hero__scroll-hairline" aria-hidden="true" />
            <span>下へ / SCROLL</span>
          </a>
          <span>七席のみ · SEVEN SEATS</span>
        </div>
      </div>
    </section>
  );
}



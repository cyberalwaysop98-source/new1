import AmbientMedia from '../components/AmbientMedia';
import { ambient } from '../assets/manifest';
import { getLenis } from '../lib/smoothScroll';
import SplitText from '../components/reactbits/SplitText';
import BlurText from '../components/reactbits/BlurText';
import ShinyText from '../components/reactbits/ShinyText';
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
          <BlurText text="TOMIGAYA · TOKYO · 喫茶室" delay={60} animateBy="words" />
          <ShinyText text="EST. 2019" speed={4} />
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



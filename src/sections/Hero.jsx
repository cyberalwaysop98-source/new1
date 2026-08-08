import AmbientMedia from '../components/AmbientMedia';
import Chars from '../components/Chars';
import { ambient } from '../assets/manifest';
import './hero.css';

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero__media">
        <AmbientMedia
          webm={ambient.hero.webm}
          mp4={ambient.hero.mp4}
          poster={ambient.hero.poster}
          alt=""
          variant="hero"
        />
      </div>

      <div className="hero__content">
        <div className="hero__top eyebrow">
          <span>TOKYO · 喫茶室</span>
          <span>EST. 2019</span>
        </div>

        <div className="hero__title-row">
          <h1 className="h-hero hero__title">
            <Chars text="NOIR" className="hero__chars" />
          </h1>
          <Chars text="ノワール" className="tategaki hero__kana hero__kana-chars" vertical />
        </div>

        <p className="body-text hero__lede reveal-mask">
          <span className="reveal-mask__inner" data-reveal="lede">
            We keep the room dark on purpose.
            <br />
            Light flatters coffee — shadow tells the truth about it.
          </span>
        </p>

        <div className="hero__bottom eyebrow">
          <span className="hero__scroll">
            <span className="hero__scroll-hairline" aria-hidden="true" />
            下へ / SCROLL
          </span>
          <span>七席のみ</span>
        </div>
      </div>
    </section>
  );
}

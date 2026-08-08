import './reserve.css';

export default function Reserve() {
  return (
    <section id="reserve" className="section reserve">
      <div className="reserve__top eyebrow">
        <span>06 · VISIT & PLACE / 予約 富ヶ谷</span>
        <span>35.6664° N, 139.6894° E</span>
      </div>

      <div className="reserve__body">
        <div className="reserve__statement">
          <p className="statement heading-wipe" data-wipe>
            <span className="heading-wipe__text">
              Sit down.
              <br />
              Say nothing.
            </span>
          </p>
          <a
            className="eyebrow reserve__cta"
            href="mailto:reserve@noir.jp?subject=Reservation%20request%20%E2%80%94%20NOIR"
          >
            BOOK A SEAT →
          </a>
        </div>

        <div className="reserve__tomigaya-story">
          <span className="eyebrow reserve__section-tag">TOMIGAYA · 富ヶ谷</span>
          <p className="body-text reserve__narrative">
            A quiet residential corner of Tomigaya, where Shibuya slows down before reaching the trees of Yoyogi Park.
            No sign on the street — only a warm low light raking the cedar entrance at dusk.
          </p>

          <div className="reserve__access-grid">
            <div className="reserve__access-item">
              <span className="eyebrow reserve__access-num">01</span>
              <p className="body-text">
                <strong>Yoyogi-Koen Station</strong>
                <br />
                Tokyo Metro Chiyoda Line · Exit 1 (6 min)
              </p>
            </div>

            <div className="reserve__access-item">
              <span className="eyebrow reserve__access-num">02</span>
              <p className="body-text">
                <strong>Yoyogi-Hachiman Station</strong>
                <br />
                Odakyu Line · South Exit (7 min)
              </p>
            </div>
          </div>
        </div>

        <div className="reserve__details">
          <div className="reserve__hours">
            <span className="eyebrow">Hours</span>
            <p className="body-text">
              Wed–Sun
              <br />
              08:00–19:00
              <br />
              Closed Mon, Tue
            </p>
          </div>
        </div>
      </div>

      <div className="reserve__footer-bar">
        <p className="body-text reserve__address">
          2-14-6 Tomigaya, Shibuya-ku, Tokyo 151-0063.
        </p>
        <a
          href="https://maps.google.com/?q=2-14-6+Tomigaya,+Shibuya-ku,+Tokyo"
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow reserve__dir-link"
        >
          GET DIRECTIONS →
        </a>
      </div>
    </section>
  );
}


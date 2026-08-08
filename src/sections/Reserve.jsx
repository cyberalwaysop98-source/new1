import './reserve.css';

export default function Reserve() {
  return (
    <section id="reserve" className="section reserve">
      <div className="reserve__top eyebrow">
        <span>予約 / RESERVE</span>
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
          <a className="eyebrow reserve__cta" href="mailto:reserve@noir.jp?subject=Reservation%20request%20%E2%80%94%20NOIR">
            BOOK A SEAT →
          </a>
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

      <p className="body-text reserve__address">
        2-14-6 Tomigaya, Shibuya-ku, Tokyo 151-0063.
      </p>
    </section>
  );
}

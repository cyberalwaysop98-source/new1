import AmbientMedia from '../components/AmbientMedia';
import './ambientBreak.css';

const MARQUEE_TOKENS = ['間', 'ma', '間', 'ma', '間', 'ma'];

export default function AmbientBreak({
  id,
  media,
  variant,
  height = '100svh',
  marquee = false,
  caption,
  captionAlign = 'left',
}) {
  return (
    <section
      id={id}
      className="ambient-break"
      style={{ height }}
    >
      <div className="ambient-break__media">
        <AmbientMedia
          webm={media.webm}
          mp4={media.mp4}
          poster={media.poster}
          alt=""
          variant={variant}
        />
      </div>
      <hr className="hairline ambient-break__rule ambient-break__rule--top" />
      <hr className="hairline ambient-break__rule ambient-break__rule--bottom" />

      {marquee && (
        <div className="ambient-break__marquee" aria-hidden="true">
          <div className="ambient-break__marquee-track">
            {MARQUEE_TOKENS.map((token, i) => (
              <span
                key={i}
                className={
                  token === '間'
                    ? 'ambient-break__token ambient-break__token--outline'
                    : 'ambient-break__token ambient-break__token--solid'
                }
              >
                {token}
              </span>
            ))}
          </div>
        </div>
      )}

      {caption && (
        <p
          className={`body-text ambient-break__caption ambient-break__caption--${captionAlign}`}
        >
          {caption}
        </p>
      )}
    </section>
  );
}

import { Fragment } from 'react';

// Splits a string into per-word spans, each in its own overflow-hidden mask, so
// a line can reveal word by word rather than as one block (§7.1).
//
// The spaces stay OUTSIDE the masks, as real text nodes between them. Inside a
// mask a trailing space is clipped, and — the reason that matters — the line
// loses every one of its wrap opportunities, so a long manifesto line would run
// off the side instead of breaking.
//
// `em` is a [first, last] word-index range carrying the line's emphasis. Trailing
// punctuation is held outside the <strong>: "four minutes." should emphasise the
// two words, not the full stop.
export default function Words({ text, em, className = '' }) {
  const words = text.split(' ');

  return (
    <span className={`words ${className}`.trim()} aria-label={text}>
      {words.map((w, i) => {
        const emphasised = em && i >= em[0] && i <= em[1];
        const tail = emphasised ? (w.match(/[.,;:!?]+$/) || [''])[0] : '';
        const core = tail ? w.slice(0, -tail.length) : w;

        return (
          <Fragment key={`${w}-${i}`}>
            <span className="words__mask" aria-hidden="true">
              <span className="words__w" data-word style={{ '--i': i }}>
                {emphasised ? (
                  <>
                    <strong>{core}</strong>
                    {tail}
                  </>
                ) : (
                  w
                )}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        );
      })}
    </span>
  );
}

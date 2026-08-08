// Splits a string into per-character spans for staggered typographic reveals.
// Each character gets its own overflow-hidden mask so it can rise independently
// (§7). `--i` is exposed for CSS-only staggers such as the menu-row cascade.
//
// The split glyphs are decoration and are marked so: aria-hidden, and made
// unselectable in CSS. One intact copy of the string carries both the
// accessible name and the clipboard. Two defects had this single cause and this
// single fix — `aria-label` on a bare <span> is prohibited (axe
// `aria-prohibited-attr`), and selecting a split heading copied the four letters
// of NOIR on four separate lines, because innerText inserts a break for every
// inline-block mask.
export default function Chars({ text, className = '', tag: Tag = 'span', vertical = false }) {
  return (
    <Tag className={`chars ${vertical ? 'chars--vertical' : ''} ${className}`}>
      <span className="vh">{text}</span>
      {[...text].map((ch, i) => (
        <span className="chars__mask" key={`${ch}-${i}`} aria-hidden="true">
          <span className="chars__ch" data-char style={{ '--i': i }}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        </span>
      ))}
    </Tag>
  );
}

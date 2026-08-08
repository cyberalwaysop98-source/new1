// Splits a string into per-character spans for staggered typographic reveals.
// Each character gets its own overflow-hidden mask so it can rise independently
// (§7). `--i` is exposed for CSS-only staggers such as the menu-row cascade.
export default function Chars({ text, className = '', tag: Tag = 'span', vertical = false }) {
  return (
    <Tag className={`chars ${vertical ? 'chars--vertical' : ''} ${className}`} aria-label={text}>
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

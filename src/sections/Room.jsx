import './room.css';

// §6.7 — two full-width plates carrying type only. No photography, no line
// drawing: the SVG elevation that stood here read as a CAD drawing rather than a
// room. The material list and the room's facts do the work the stills would.
const PLATES = [
  {
    jp: '素材',
    label: 'Materials',
    lines: ['Cedar, one plank.', 'Lime plaster.', 'Blackened steel.'],
  },
  {
    jp: '室',
    label: 'The room',
    lines: ['Seven seats.', 'Three pendants.', 'No overhead light.'],
  },
];

export default function Room() {
  return (
    <section id="room" className="section room">
      <div className="section-head">
        <h2 className="h-section">The Room</h2>
        <span className="eyebrow">Seven seats</span>
      </div>

      {PLATES.map((plate) => (
        <figure key={plate.label} className="room__plate">
          <div className="room__face">
            {/* The layer that scales. The band box itself must stay untransformed
                — scaling a full-width element pushes it past the viewport. */}
            <div className="room__ground" aria-hidden="true" />
            <span className="tategaki room__jp" aria-hidden="true">
              {plate.jp}
            </span>
            <ul className="room__lines">
              {plate.lines.map((line) => (
                <li key={line} className="menu-name room__line">
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <figcaption className="eyebrow room__caption">{plate.label}</figcaption>
        </figure>
      ))}
    </section>
  );
}

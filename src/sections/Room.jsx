import ScrollReveal from '../components/reactbits/ScrollReveal';
import BlurText from '../components/reactbits/BlurText';
import './room.css';

const PLATES = [
  {
    jp: '素材',
    label: 'MATERIALS · 素材',
    lines: ['Cedar, one plank.', 'Lime plaster.', 'Blackened steel.'],
  },
  {
    jp: '室',
    label: 'THE ROOM · 七席',
    lines: ['Seven seats.', 'Three pendants.', 'No overhead light.'],
  },
];

export default function Room() {
  return (
    <section id="room" className="section room">
      <ScrollReveal className="section-head">
        <h2 className="h-section heading-wipe" data-wipe>
          <span className="heading-wipe__text">The Room</span>
        </h2>
        <span className="eyebrow">05 · THE ROOM / SEVEN SEATS</span>
      </ScrollReveal>

      {PLATES.map((plate) => (
        <figure key={plate.label} className="room__plate">
          <div className="room__face">
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
          <figcaption className="eyebrow room__caption">
            <BlurText text={plate.label} animateBy="words" delay={40} />
          </figcaption>
        </figure>
      ))}
    </section>
  );
}


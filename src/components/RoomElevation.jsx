// DESIGN.md §6.8 — placeholder AND viable permanent treatment: an SVG
// architectural line elevation of the counter, seven stools, and three pendant
// lamps in --washi hairlines. Two variants share one drawing, cropped by viewBox
// to match the two-plate layout (the counter / the lamps) without duplicating markup.
import './roomElevation.css';

const STOOL_X = [220, 460, 700, 940, 1180, 1420, 1660];
const LAMP_X = [560, 1000, 1440];

export default function RoomElevation({ variant = 'counter', className = '' }) {
  const viewBox = variant === 'lamps' ? '300 0 1400 700' : '0 350 2000 775';

  return (
    <svg
      className={`room-elevation ${className}`}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={
        variant === 'lamps'
          ? 'Line drawing of three pendant lamps above the counter'
          : 'Line drawing of the cedar counter with seven stools'
      }
    >
      {/* back wall */}
      <line x1="0" y1="350" x2="2000" y2="350" className="re-line re-line--dim" />

      {/* pendant lamps */}
      {LAMP_X.map((x) => (
        <g key={x}>
          <line x1={x} y1="0" x2={x} y2="210" className="re-line" />
          <ellipse cx={x} cy="234" rx="52" ry="26" className="re-line" />
          <line x1={x} y1="260" x2={x} y2="300" className="re-line re-line--thin" />
        </g>
      ))}

      {/* counter */}
      <rect x="60" y="820" width="1880" height="34" className="re-line" />
      <line x1="60" y1="900" x2="1940" y2="900" className="re-line re-line--dim" />

      {/* stools */}
      {STOOL_X.map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="1010" rx="46" ry="16" className="re-line" />
          <line x1={x - 30} y1="1024" x2={x - 30} y2="1120" className="re-line re-line--thin" />
          <line x1={x + 30} y1="1024" x2={x + 30} y2="1120" className="re-line re-line--thin" />
        </g>
      ))}
    </svg>
  );
}

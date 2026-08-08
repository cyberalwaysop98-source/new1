import Chars from '../components/Chars';
import './selection.css';

const ROWS = [
  {
    name: '黒',
    romaji: 'Kuro',
    notes: 'Ethiopia Guji, natural — bergamot, dark plum, cocoa nib',
    price: '¥1,400',
  },
  {
    name: '霧',
    romaji: 'Kiri',
    notes: 'Colombia Huila, washed — white peach, lemon peel, cane',
    price: '¥1,300',
  },
  {
    name: '炭',
    romaji: 'Sumi',
    notes: 'House roast over binchōtan — burnt sugar, walnut, smoke',
    price: '¥1,100',
  },
  {
    name: '氷出し',
    romaji: 'Kōridashi',
    notes: 'Ice drip, eight hours unattended — clarified, almost weightless',
    price: '¥1,600',
  },
  {
    name: '抹茶',
    romaji: 'Matcha',
    notes: 'Uji, stone-milled that morning — whisked, no sugar, served warm',
    price: '¥1,200',
  },
];

export default function Selection() {
  return (
    <section id="selection" className="section selection">
      <div className="section-head">
        <h2 className="h-section heading-wipe" data-wipe><span className="heading-wipe__text">The Selection</span></h2>
        <span className="eyebrow">Five, only</span>
      </div>

      <hr className="hairline" />
      {ROWS.map((row) => (
        <div key={row.name} className="selection__group">
          <button type="button" className="selection__row">
            <span className="menu-name selection__name">
              {row.name}{' '}
              <Chars text={row.romaji} tag="em" className="selection__romaji" />
            </span>
            <span className="body-text selection__notes">{row.notes}</span>
            <span className="price selection__price">{row.price}</span>
          </button>
          <hr className="hairline" />
        </div>
      ))}
    </section>
  );
}

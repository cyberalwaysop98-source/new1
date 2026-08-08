import { useState } from 'react';
import Chars from '../components/Chars';
import './selection.css';

const CATEGORIES = [
  { id: 'all', label: 'ALL / すべて' },
  { id: 'coffee', label: 'COFFEE / 珈琲' },
  { id: 'tea', label: 'TEA / 茶' },
  { id: 'food', label: 'FOOD / 甘味' },
  { id: 'seasonal', label: 'SEASONAL / 季節' },
];

const MENU_ITEMS = [
  {
    id: 'kuro',
    category: 'coffee',
    categoryLabel: '珈琲',
    name: '黒',
    romaji: 'Kuro',
    notes: 'Ethiopia Guji, natural — bergamot, dark plum, cocoa nib',
    origin: 'Guji Zone, 2100m · Natural Process',
    price: '¥1,400',
  },
  {
    id: 'kiri',
    category: 'coffee',
    categoryLabel: '珈琲',
    name: '霧',
    romaji: 'Kiri',
    notes: 'Colombia Huila, washed — white peach, lemon peel, cane',
    origin: 'Huila, 1850m · Fully Washed',
    price: '¥1,300',
  },
  {
    id: 'sumi',
    category: 'coffee',
    categoryLabel: '珈琲',
    name: '炭',
    romaji: 'Sumi',
    notes: 'House roast over binchōtan — burnt sugar, walnut, smoke',
    origin: 'Binchōtan Charcoal Slow Roast',
    price: '¥1,100',
  },
  {
    id: 'koridashi',
    category: 'coffee',
    categoryLabel: '珈琲',
    name: '氷出し',
    romaji: 'Kōridashi',
    notes: 'Ice drip, eight hours unattended — clarified, almost weightless',
    origin: 'Slow Ice Drip · 8 Hours Extraction',
    price: '¥1,600',
  },
  {
    id: 'matcha',
    category: 'tea',
    categoryLabel: '茶',
    name: '抹茶',
    romaji: 'Matcha',
    notes: 'Uji, stone-milled that morning — whisked, no sugar, served warm',
    origin: 'Uji, Kyoto · First Harvest Ceremonial',
    price: '¥1,200',
  },
  {
    id: 'hojicha',
    category: 'tea',
    categoryLabel: '茶',
    name: '焙じ茶',
    romaji: 'Hōjicha',
    notes: 'Roasted green tea — toasted rice, chestnut, honeyed finish',
    origin: 'Shizuoka · Charcoal Roasted Leaf',
    price: '¥1,000',
  },
  {
    id: 'toast',
    category: 'food',
    categoryLabel: '甘味',
    name: '厚切りトースト',
    romaji: 'Ogura Toast',
    notes: 'Thick-cut milk bread toasted over charcoal, Hokkaido adzuki, salted butter',
    origin: 'Artisan Shokupan · House Adzuki',
    price: '¥950',
  },
  {
    id: 'yokan',
    category: 'food',
    categoryLabel: '甘味',
    name: '羊羹',
    romaji: 'Yōkan',
    notes: 'Dark red bean jelly with binchōtan salt, served with cedar toothpick',
    origin: 'Hand-pressed Red Bean · Sea Salt',
    price: '¥800',
  },
  {
    id: 'single-lot',
    category: 'seasonal',
    categoryLabel: '季節',
    name: '極',
    romaji: 'Kiwami',
    notes: 'Gesha Village 1931, Ethiopia — wild jasmine, nectarine, sparkling acidity',
    origin: 'Bench Maji · Anaerobic Natural · Limited 7 Lots',
    price: '¥2,200',
  },
];

export default function Selection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filteredItems = MENU_ITEMS.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  function toggleItem(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <section id="selection" className="section selection">
      <div className="section-head">
        <h2 className="h-section heading-wipe" data-wipe>
          <span className="heading-wipe__text">The Selection</span>
        </h2>
        <span className="eyebrow">04 · THE COFFEE & MENU</span>
      </div>

      {/* Category Tabs */}
      <div className="selection__tabs eyebrow" role="tablist" aria-label="Menu Categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            className={`selection__tab ${activeCategory === cat.id ? 'selection__tab--active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <hr className="hairline" />

      <div className="selection__list">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className="selection__group">
              <button
                type="button"
                className={`selection__row ${isExpanded ? 'selection__row--expanded' : ''}`}
                onClick={() => toggleItem(item.id)}
                aria-expanded={isExpanded}
              >
                <div className="selection__col-name">
                  <span className="eyebrow selection__cat-tag">{item.categoryLabel}</span>
                  <span className="menu-name selection__name">
                    {item.name}{' '}
                    <Chars text={item.romaji} tag="em" className="selection__romaji" />
                  </span>
                </div>

                <div className="selection__col-body">
                  <span className="body-text selection__notes">{item.notes}</span>
                  {isExpanded && (
                    <span className="eyebrow selection__origin-detail">
                      {item.origin}
                    </span>
                  )}
                </div>

                <span className="price selection__price">{item.price}</span>
              </button>
              <hr className="hairline" />
            </div>
          );
        })}
      </div>
    </section>
  );
}


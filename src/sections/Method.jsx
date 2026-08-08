import ScrollReveal from '../components/reactbits/ScrollReveal';
import SplitText from '../components/reactbits/SplitText';
import './method.css';

const ITEMS = [
  {
    n: '01',
    title: 'Single origin, single lot',
    line: "We buy one lot at a time and stop when it's gone.",
  },
  {
    n: '02',
    title: 'Roasted over binchōtan',
    line: 'Charcoal, not gas. It is slower and it is worse for business.',
  },
  {
    n: '03',
    title: 'Ground at the seat',
    line: 'Nothing is ground in advance. You will hear it.',
  },
  {
    n: '04',
    title: 'Ninety-two degrees',
    line: 'Held thirty seconds off the boil so it does not scorch on contact.',
  },
  {
    n: '05',
    title: 'Four minutes, three pours',
    line: "Each smaller than the last. The bed sits flat when it's done.",
  },
];

export default function Method() {
  return (
    <section id="method" className="section method">
      <div className="method__sticky">
        <ScrollReveal>
          <span className="eyebrow">03 · THE RITUAL / METHOD</span>
          <h2 className="h-section">01 — 05</h2>
        </ScrollReveal>
      </div>

      <ol className="method__list">
        {ITEMS.map((item) => (
          <li key={item.n} className="method__item" data-method-item>
            <span className="method__num" data-method-num data-count-to={item.n}>00</span>
            <div className="method__body">
              <h3 className="menu-name method__title">
                <SplitText text={item.title} delay={25} splitBy="words" />
              </h3>
              <p className="body-text">{item.line}</p>
              <hr className="hairline method__rule" data-method-rule />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

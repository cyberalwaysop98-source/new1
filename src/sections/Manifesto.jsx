import './manifesto.css';

export default function Manifesto() {
  return (
    <section id="manifesto" className="section section--manifesto manifesto">
      <p className="manifesto-line manifesto__line manifesto__line--right reveal-mask">
        <span className="reveal-mask__inner" data-reveal="manifesto">
          There is no music, no wifi, and no second cup.
        </span>
      </p>
      <p className="manifesto-line manifesto__line manifesto__line--left reveal-mask">
        <span className="reveal-mask__inner" data-reveal="manifesto">
          The beans are ground when you sit down, not before.
        </span>
      </p>
      <p className="manifesto-line manifesto__line manifesto__line--right reveal-mask">
        <span className="reveal-mask__inner" data-reveal="manifesto">
          What arrives will take <strong>four minutes</strong>. Please let it.
        </span>
      </p>
    </section>
  );
}

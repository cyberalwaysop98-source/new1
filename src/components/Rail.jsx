import Chars from './Chars';
import './rail.css';

export default function Rail() {
  return (
    <aside className="rail" aria-hidden="true">
      <Chars text="喫茶室" className="rail__label tategaki rail__chars" vertical />
      <div className="rail__track">
        <div className="rail__progress" />
      </div>
    </aside>
  );
}

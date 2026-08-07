import RoomElevation from '../components/RoomElevation';
import './room.css';

export default function Room() {
  return (
    <section id="room" className="section room">
      <div className="section-head">
        <h2 className="h-section">The Room</h2>
        <span className="eyebrow">Seven seats</span>
      </div>

      <div className="room__grid">
        <figure className="room__plate">
          <div className="room__frame">
            <RoomElevation variant="counter" />
          </div>
          <figcaption className="eyebrow room__caption">The counter</figcaption>
        </figure>

        <figure className="room__plate">
          <div className="room__frame">
            <RoomElevation variant="lamps" />
          </div>
          <figcaption className="eyebrow room__caption">The lamps</figcaption>
        </figure>
      </div>
    </section>
  );
}

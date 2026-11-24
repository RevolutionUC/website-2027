export default function ScheduleSign() {
  return (
    <div id="sched" className="o">
      <div className="s-sched">
        <div className="arrowsign">
          <div className="bulbs">
            <div className="in">
              <h2 className="script">Schedule</h2>
            </div>
          </div>
          <span className="tip" aria-hidden="true" />
        </div>

        <div className="board">
          <ul>
            <li>
              <b>Fri 6–8 PM</b>
              <span>Check-in &amp; dinner</span>
            </li>
            <li>
              <b>Fri 9 PM</b>
              <span>Opening &amp; mixer</span>
            </li>
            <li>
              <b>Sat 10 AM–12 PM</b>
              <span>Workshops</span>
            </li>
            <li>
              <b>Sun 11 AM</b>
              <span>Demos &amp; awards</span>
            </li>
          </ul>
        </div>

        <div className="post warm" />
      </div>
    </div>
  );
}

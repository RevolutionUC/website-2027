export default function DriveOverlay() {
  return (
    <>
      <div id="where">
        <button id="prevStop" type="button" aria-label="Previous stop">
          ←
        </button>
        <div className="wt">
          <small>Now passing</small>
          <b id="whereTxt">Downtown Cincinnati</b>
        </div>
        <button id="nextStop" type="button" aria-label="Next stop">
          →
        </button>
      </div>

      <div id="loading">Painting the city…</div>

      <div id="hint">
        <span id="hintTxt">Scroll down to drive</span>
        <span className="dn" aria-hidden="true">
          ▼
        </span>
      </div>
    </>
  );
}

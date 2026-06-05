export default function VideoBand() {
  return (
    <section
      id="anywhere"
      data-section="anywhere"
      className="video-band"
      aria-label="Run your store from anywhere"
    >
      <video
        className="video-band-media"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      >
        <source src="/woman-tablet.mp4" type="video/mp4" />
      </video>
      <div className="video-band-overlay" aria-hidden />

      <div className="video-band-inner">
        <span
          className="eyebrow"
          style={
            {
              color: "rgba(255,255,255,0.82)",
              "--eyebrow-color": "var(--accent)",
            } as any
          }
        >
          Manage on the move
        </span>
        <h2 className="video-band-title">
          Run your entire store
          <br />
          from anywhere.
        </h2>
        <p className="video-band-lede">
          Approve orders on the train. Restock from the warehouse floor. Reply to
          a customer over coffee. E-biz is fast, responsive, and runs wherever
          you do — on any device, in real time.
        </p>
        <div className="video-band-chips">
          {["Real-time orders", "Works on any device", "WhatsApp built-in"].map(
            (c) => (
              <span key={c} className="video-band-chip">
                {c}
              </span>
            )
          )}
        </div>
        <div
          style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}
        >
          <a
            href="#cta"
            className="btn"
            style={{ background: "#fff", color: "#0E0E0C", border: "1px solid #fff" }}
          >
            Book a live demo <span className="arrow">→</span>
          </a>
          <a
            href="#pricing"
            className="btn"
            style={{
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          >
            See pricing
          </a>
        </div>
      </div>
    </section>
  );
}

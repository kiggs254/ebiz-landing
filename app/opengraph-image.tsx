import { ImageResponse } from "next/og";

export const alt = "E-biz: The commerce command center for modern brands";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dynamically generated 1200×630 social card. Applies to every route that
// doesn't define its own opengraph-image, and is reused as the Twitter image.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAFAF7",
          padding: "70px 76px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 18,
              background: "#D6724D",
              color: "#15110F",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            eb
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, color: "#15110F", marginLeft: 20, letterSpacing: -1 }}>
            E-biz
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 66,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: "#15110F",
            }}
          >
            <span style={{ marginRight: 18 }}>The commerce command center</span>
            <span style={{ color: "#B5532E" }}>for modern brands.</span>
          </div>
          <div style={{ fontSize: 30, color: "#5C5B54", marginTop: 28, maxWidth: 960, lineHeight: 1.35 }}>
            Sell online, in-store, and on WhatsApp. M-Pesa, Pesapal, Paystack, cards, and cash built in.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 27, fontWeight: 600, color: "#15110F" }}>e-biz.co.ke</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 52, height: 10, borderRadius: 5, background: "#D6724D", marginRight: 8 }} />
            <div style={{ width: 18, height: 10, borderRadius: 5, background: "#15110F" }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Section } from "@/components/primitives";
import { JsonLd, breadcrumb } from "@/components/JsonLd";
import { MOBILE_APP } from "@/lib/mobile-app";

export const metadata: Metadata = {
  title: "Mobile app",
  description:
    "Run your shop from your phone. Take orders, update stock, track deliveries and get alerted the moment a customer buys. Free with every E-biz plan, for Android.",
  alternates: { canonical: "https://e-biz.co.ke/app" },
};

const FEATURES: Array<{ title: string; body: string; color: string }> = [
  {
    title: "Know the moment you sell",
    body: "A notification the second an order lands, with the total, what was bought, and whether cash is owed at the door. It reaches you whether the order came from your website, WhatsApp, or the counter.",
    color: "var(--accent)",
  },
  {
    title: "Run the day from Today",
    body: "New orders, what is still to pack, what is out for delivery, and how much cash your riders are carrying, on one screen. Revenue and tonight's bookings sit alongside it.",
    color: "var(--good)",
  },
  {
    title: "Fix stock on the shop floor",
    body: "Search the catalogue, change a price, correct a count, mark something out of stock for one branch. No laptop, no waiting until you are back at a desk.",
    color: "var(--blue, #3b6ea5)",
  },
  {
    title: "Deliveries, end to end",
    body: "Assign a rider from inside the order. Riders get their own view: accept, pick up, navigate, deliver, and capture a proof-of-delivery photo, with live location back to dispatch.",
    color: "var(--violet, #7c5cbf)",
  },
];

const STEPS: Array<{ n: string; title: string; body: string }> = [
  {
    n: "1",
    title: "Download and install",
    body: "Android will ask you to allow installing from your browser. That is normal for an app distributed outside the Play Store.",
  },
  {
    n: "2",
    title: "Enter your store address",
    body: "The API address for your store, which your E-biz admin can copy from Settings. One app works for every store you run.",
  },
  {
    n: "3",
    title: "Sign in as normal",
    body: "The same email and password you use for the E-biz dashboard. Your role decides what you can see and do, exactly as on the web.",
  },
];

export default function AppPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Mobile app", path: "/app" },
        ])}
      />
      <Nav />
      <main>
        <Section id="app-top" ariaLabel="E-biz mobile app">
          <div style={{ maxWidth: 760 }}>
            <span className="eyebrow">Mobile app · Android</span>
            <h1
              style={{
                fontFamily: "var(--display)",
                fontWeight: 600,
                fontSize: "clamp(34px, 4.4vw, 58px)",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                margin: "16px 0 0",
                textWrap: "balance",
              }}
            >
              Your shop, <span style={{ color: "var(--accent-ink)" }}>in your pocket.</span>
            </h1>
            <p className="section-lede" style={{ marginTop: 20 }}>
              Orders, stock, deliveries and bookings, on the phone already in
              your hand. Free with every E-biz plan, and it works with whichever
              store you point it at.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <a
                href={MOBILE_APP.apkUrl}
                className="btn btn-primary"
                style={{ fontSize: 16, padding: "14px 26px" }}
              >
                Download for Android
              </a>
              <span style={{ color: "var(--ink-3, var(--ink-2))", fontSize: 14 }}>
                v{MOBILE_APP.version} · Android {MOBILE_APP.minAndroid}+ · ~
                {MOBILE_APP.sizeMb} MB
              </span>
            </div>

            <p
              style={{
                color: "var(--ink-2)",
                fontSize: 14,
                lineHeight: 1.7,
                margin: "18px 0 0",
                maxWidth: 620,
              }}
            >
              Not on the Play Store, and deliberately so: this app is for the
              people who run a store, not for the public. It updates itself in
              the background, so you install it once and it stays current.
            </p>
          </div>
        </Section>

        <Section id="app-features" ariaLabel="What the app does" style={{ background: "var(--bg-2)" }}>
          <span className="eyebrow">What it does</span>
          <h2 className="section-title" style={{ marginBottom: 44 }}>
            Built for the hour you are busiest.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 22,
            }}
          >
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ padding: 26 }}>
                <div
                  aria-hidden
                  style={{
                    width: 34,
                    height: 4,
                    borderRadius: 2,
                    background: f.color,
                    marginBottom: 18,
                  }}
                />
                <h3 style={{ fontSize: 18, margin: "0 0 10px", letterSpacing: "-0.01em" }}>
                  {f.title}
                </h3>
                <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.65, margin: 0 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="app-install" ariaLabel="How to install">
          <span className="eyebrow">Getting started</span>
          <h2 className="section-title" style={{ marginBottom: 44 }}>
            Three steps, about a minute.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 22,
            }}
          >
            {STEPS.map((s) => (
              <div key={s.n}>
                <div
                  aria-hidden
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: 32,
                    color: "var(--accent-ink)",
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {s.n}
                </div>
                <h3 style={{ fontSize: 17, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                  {s.title}
                </h3>
                <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.65, margin: 0 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 24, marginTop: 40, maxWidth: 720 }}>
            <h3 style={{ fontSize: 16, margin: "0 0 10px" }}>What Android will ask you</h3>
            <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.65, margin: "0 0 10px" }}>
              The app is signed with our own release key, and every update is signed with
              the same one. Android still shows two prompts for any app installed outside
              the Play Store, whoever made it:
            </p>
            <ul
              style={{
                color: "var(--ink-2)",
                fontSize: 15,
                lineHeight: 1.65,
                margin: "0 0 10px",
                paddingLeft: 20,
              }}
            >
              <li>
                <strong>“Allow from this source”</strong> — permission for your browser to
                install apps. Turn it on once.
              </li>
              <li>
                <strong>Play Protect: “Unsafe app blocked” or “app not recognised”</strong> —
                Google flags apps it has not seen before. Tap <strong>More details</strong>,
                then <strong>Install anyway</strong>.
              </li>
            </ul>
            <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.65, margin: 0 }}>
              Neither means anything is wrong with the file. Only download it from this page,
              and check that the app is <strong>E-biz (co.ebiz.mobile)</strong> before you
              install.
            </p>
          </div>

          <div className="card" style={{ padding: 24, marginTop: 22, maxWidth: 720 }}>
            <h3 style={{ fontSize: 16, margin: "0 0 8px" }}>Installing on a phone directly</h3>
            <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.65, margin: 0 }}>
              Open{" "}
              <a href={MOBILE_APP.buildPageUrl} style={{ color: "var(--accent-ink)" }}>
                the build page
              </a>{" "}
              on the phone itself, or scan its QR code from a computer. iPhone is
              not supported yet.
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

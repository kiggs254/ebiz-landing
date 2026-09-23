import type { Metadata } from "next";
import Link from "next/link";
import { Logo, Section } from "@/components/primitives";
import { MOBILE_APP } from "@/lib/mobile-app";

/**
 * The page you send to someone who just needs the app on their phone.
 *
 * Deliberately unlisted: nothing links to it, it is not in the sitemap, and
 * search engines are told to skip it. It is a link you hand out, not a part of
 * the site — /app is the page that sells the thing, this one installs it.
 *
 * Written for a shop assistant standing in the shop, not for a developer: every
 * scary-looking Android prompt is named in the words the phone actually uses,
 * with the exact button to press, so nobody stops halfway and assumes the file
 * is broken.
 */

export const metadata: Metadata = {
  title: "Install the E-biz app",
  description: "Step-by-step instructions to put the E-biz app on an Android phone.",
  robots: { index: false, follow: false },
};

const STEPS: Array<{ title: string; body: string; note?: string }> = [
  {
    title: "Tap the button above",
    body: `The download starts straight away. It is about ${MOBILE_APP.sizeMb} MB, so use Wi-Fi if you can. It takes a minute or two.`,
    note: "Chrome may say “This type of file can harm your device”. Tap Download anyway. It says that about every app that does not come from the Play Store.",
  },
  {
    title: "Open the file when it finishes",
    body: "Tap Open in the bar at the bottom of the screen. If it has disappeared, open your Files or Downloads app and tap ebiz.apk.",
  },
  {
    title: "Allow your browser to install apps",
    body: "Android asks once: “Allow from this source”. Turn the switch on, then press the Back arrow to come back to the install screen.",
    note: "You only ever do this once on a phone.",
  },
  {
    title: "If Google warns you, choose More details",
    body: "You may see “Unsafe app blocked” or “App not recognised”. Tap More details, then Install anyway.",
    note: "Google shows this for any app it has not handed out itself. It has not found anything wrong with the app — it simply has not seen it before.",
  },
  {
    title: "Tap Install, then Open",
    body: "The E-biz logo appears in your apps list, so next time you just tap it like any other app.",
  },
  {
    title: "Type in your store address",
    body: "The first screen asks for it. Your manager will give it to you — it looks like api.yourshop.com. Type it once and the app remembers.",
  },
  {
    title: "Sign in and say yes to notifications",
    body: "Use the same email and password as the E-biz dashboard on a computer. When the phone asks about notifications, choose Allow — that is how you hear about a new order.",
  },
];

const TROUBLE: Array<{ q: string; a: string }> = [
  {
    q: "It says “App not installed”",
    a: "Usually an older copy of the app is already on the phone. Uninstall it (hold the E-biz icon, then Uninstall) and tap the download button again.",
  },
  {
    q: "There is no Install button, only Cancel",
    a: "Android is still waiting for the “Allow from this source” permission. Press Back once, turn the switch on, then return.",
  },
  {
    q: "The download stops part way",
    a: "It is a big file. Get onto Wi-Fi, make sure there is at least 500 MB free on the phone, and tap the button again.",
  },
  {
    q: "It will not open after installing",
    a: "The app needs Android 7 or newer. On an older phone it installs but will not run — use the dashboard in the phone's browser instead.",
  },
  {
    q: "I do not know my store address",
    a: "Ask whoever set up your E-biz account. It is in the admin dashboard under Settings, and it is the same for everyone in the shop.",
  },
];

export default function InstallPage() {
  return (
    <>
      <header
        style={{
          borderBottom: "1px solid var(--line-softer)",
          padding: "18px 0",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={24} />
          <span style={{ fontFamily: "var(--display)", fontSize: 18, letterSpacing: "-0.02em" }}>
            E-biz
          </span>
        </div>
      </header>

      <main>
        <Section id="install-top" ariaLabel="Install the E-biz app">
          <div style={{ maxWidth: 680 }}>
            <span className="eyebrow">For Android phones</span>
            <h1
              style={{
                fontFamily: "var(--display)",
                fontWeight: 600,
                fontSize: "clamp(32px, 4.2vw, 52px)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                margin: "16px 0 0",
                textWrap: "balance",
              }}
            >
              Put E-biz on your phone
            </h1>
            <p className="section-lede" style={{ marginTop: 18 }}>
              Seven short steps, about five minutes. You need an Android phone,
              Wi-Fi, and your E-biz email and password.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginTop: 28 }}>
              <a
                href={MOBILE_APP.apkUrl}
                className="btn btn-primary"
                style={{ fontSize: 17, padding: "16px 30px" }}
              >
                Download the app
              </a>
              <span style={{ color: "var(--ink-2)", fontSize: 14 }}>
                Version {MOBILE_APP.version} · Android {MOBILE_APP.minAndroid} and newer · about{" "}
                {MOBILE_APP.sizeMb} MB
              </span>
            </div>

            <div className="card" style={{ padding: 20, marginTop: 26 }}>
              <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.65 }}>
                <strong style={{ color: "var(--ink)" }}>Do this on the phone itself.</strong> If you
                are reading this on a computer, send yourself this page and open it on the phone —
                the file has to be downloaded there.
              </p>
            </div>
          </div>
        </Section>

        <Section id="install-steps" ariaLabel="Step by step" style={{ background: "var(--bg-2)" }}>
          <h2 className="section-title" style={{ marginBottom: 36 }}>
            Step by step
          </h2>

          <ol style={{ listStyle: "none", margin: 0, padding: 0, maxWidth: 720 }}>
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px minmax(0, 1fr)",
                  gap: 18,
                  paddingBottom: i === STEPS.length - 1 ? 0 : 26,
                }}
              >
                <div
                  aria-hidden
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      background: "var(--accent)",
                      color: "#fff",
                      fontFamily: "var(--display)",
                      fontSize: 16,
                      lineHeight: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span style={{ flex: 1, width: 1, background: "var(--line-soft)" }} />
                  )}
                </div>

                <div style={{ paddingTop: 4 }}>
                  <h3 style={{ fontSize: 18, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                    {s.title}
                  </h3>
                  <p style={{ color: "var(--ink-2)", fontSize: 15.5, lineHeight: 1.65, margin: 0 }}>
                    {s.body}
                  </p>
                  {s.note && (
                    <p
                      style={{
                        color: "var(--ink-2)",
                        fontSize: 14,
                        lineHeight: 1.6,
                        margin: "10px 0 0",
                        padding: "10px 14px",
                        borderLeft: "2px solid var(--accent)",
                        background: "var(--bg, transparent)",
                        borderRadius: 4,
                      }}
                    >
                      {s.note}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="install-warnings" ariaLabel="About the warnings">
          <div style={{ maxWidth: 720 }}>
            <h2 className="section-title" style={{ marginBottom: 18 }}>
              Why your phone warns you
            </h2>
            <p style={{ color: "var(--ink-2)", fontSize: 15.5, lineHeight: 1.7, margin: "0 0 14px" }}>
              Android shows a warning for every app that does not come from the Play Store, however
              it was made. E-biz is not on the Play Store on purpose: it is a tool for the people who
              run a shop, not something for the public to download.
            </p>
            <p style={{ color: "var(--ink-2)", fontSize: 15.5, lineHeight: 1.7, margin: 0 }}>
              The app is signed with our own certificate, and every update is signed with the same
              one, so your phone can tell that updates really come from us. Two things are worth
              being strict about: only ever download it from this page, and check the app is called{" "}
              <strong style={{ color: "var(--ink)" }}>E-biz</strong> before you press Install. Never
              install a copy someone forwarded to you on WhatsApp.
            </p>
          </div>
        </Section>

        <Section id="install-trouble" ariaLabel="If something goes wrong" style={{ background: "var(--bg-2)" }}>
          <h2 className="section-title" style={{ marginBottom: 30 }}>
            If something goes wrong
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
              maxWidth: 940,
            }}
          >
            {TROUBLE.map((t) => (
              <div key={t.q} className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15.5, margin: "0 0 7px", letterSpacing: "-0.01em" }}>{t.q}</h3>
                <p style={{ color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.65, margin: 0 }}>
                  {t.a}
                </p>
              </div>
            ))}
          </div>

          <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7, marginTop: 30 }}>
            Still stuck? <Link href="/contact" style={{ color: "var(--accent-ink)" }}>Tell us what the
            phone says</Link> and we will walk you through it.
          </p>
        </Section>

        <Section id="install-after" ariaLabel="After installing">
          <div style={{ maxWidth: 720 }}>
            <h2 className="section-title" style={{ marginBottom: 18 }}>
              Once it is installed
            </h2>
            <p style={{ color: "var(--ink-2)", fontSize: 15.5, lineHeight: 1.7, margin: 0 }}>
              You will not have to do any of this again. The app updates itself quietly in the
              background — when you close and reopen it, it is already the newest version. You will
              only be asked to download a file again if we tell you to.
            </p>
          </div>
        </Section>
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--line-softer)",
          padding: "26px 0",
          marginTop: 10,
        }}
      >
        <div className="container">
          <p style={{ color: "var(--ink-2)", fontSize: 13.5, margin: 0 }}>
            E-biz · <Link href="/" style={{ color: "inherit" }}>e-biz.co.ke</Link>
          </p>
        </div>
      </footer>
    </>
  );
}

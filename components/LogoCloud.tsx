"use client";

import { useEffect, useState } from "react";
import { Section } from "./primitives";

const MANAGER_API = (
  process.env.NEXT_PUBLIC_MANAGER_API || "https://manager.e-biz.co.ke"
).replace(/\/$/, "");

// Bundled fallback — shown until/unless the Manager has logos configured, and
// if the Manager is unreachable. Keeps the carousel populated either way.
const FALLBACK: Logo[] = [
  { name: "Cleanshelf", src: "/clients/cleanshelf.png" },
  { name: "Orca Deco", src: "/clients/orca.png" },
  { name: "Home Chef", src: "/clients/homechef.png" },
  { name: "Mamas Market", src: "/clients/mamas-market.png" },
  { name: "Thyme Pharmacy", src: "/clients/thyme.png" },
  { name: "IoT Systems", src: "/clients/iot-systems.png" },
  { name: "Episode Technologies", src: "/clients/episode.png" },
];

type Logo = { name: string; src: string; link?: string | null };
type ApiLogo = { id: number | string; name: string; url: string; link: string | null };

/** Only ever link out to a real http(s) destination — never javascript:, data:
 *  or a protocol-relative //host, all of which are things an admin-entered
 *  string could otherwise smuggle into an href. */
function safeExternalHref(link: string | null | undefined): string | null {
  if (!link) return null;
  const raw = link.trim();
  if (!raw || raw.startsWith("//")) return null;
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export default function LogoCloud() {
  const [logos, setLogos] = useState<Logo[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${MANAGER_API}/api/public/website/logos`);
        const json = (await res.json()) as { status?: string; data?: ApiLogo[] };
        if (
          !cancelled &&
          json.status === "success" &&
          Array.isArray(json.data) &&
          json.data.length > 0
        ) {
          setLogos(
            json.data.map((d) => ({ name: d.name, src: `${MANAGER_API}${d.url}`, link: d.link }))
          );
        }
      } catch {
        /* keep the bundled fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section
      id="logos"
      ariaLabel="Brands powered by E-biz"
      style={{ paddingTop: 64, paddingBottom: 64 }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11.5,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          Trusted by modern commerce teams
        </span>
      </div>

      <div className="logo-marquee">
        <div className="logo-track">
          {[0, 1, 2].map((rep) =>
            logos.map((c, i) => {
              const href = safeExternalHref(c.link);
              const chip = (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.src}
                    alt={rep === 0 ? c.name : ""}
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: "2px" }}
                  />
                </div>
              );
              // The track is repeated three times to make the marquee loop
              // seamlessly; only the first pass is real content. The copies are
              // hidden from assistive tech and taken out of the tab order so a
              // keyboard user doesn't walk the same seven links three times.
              const duplicate = rep > 0;
              return (
                <div
                  key={`${rep}-${i}-${c.src}`}
                  className="client-chip"
                  title={c.name}
                  aria-hidden={duplicate}
                >
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${c.name} — opens in a new tab`}
                      tabIndex={duplicate ? -1 : undefined}
                      style={{ display: "block", width: "100%", height: "100%" }}
                    >
                      {chip}
                    </a>
                  ) : (
                    chip
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Section>
  );
}

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
type ApiLogo = { id: number; name: string; url: string; link: string | null };

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
            logos.map((c, i) => (
              <div
                key={`${rep}-${i}-${c.src}`}
                className="client-chip"
                title={c.name}
                aria-hidden={rep > 0}
              >
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.src}
                    alt={rep === 0 ? c.name : ""}
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: "2px" }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Section>
  );
}

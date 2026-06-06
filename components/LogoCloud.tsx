import Image from "next/image";
import { Section } from "./primitives";

const clients = [
  { name: "Cleanshelf", file: "cleanshelf.png" },
  { name: "Orca Deco", file: "orca.png" },
  { name: "Home Chef", file: "homechef.png" },
  { name: "Mamas Market", file: "mamas-market.png" },
  { name: "Thyme Pharmacy", file: "thyme.png" },
  { name: "IoT Systems", file: "iot-systems.png" },
  { name: "Episode Technologies", file: "episode.png" },
] as const;

export default function LogoCloud() {
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
            clients.map((c) => (
              <div
                key={`${rep}-${c.file}`}
                className="client-chip"
                title={c.name}
                aria-hidden={rep > 0}
              >
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image
                    src={`/clients/${c.file}`}
                    alt={rep === 0 ? c.name : ""}
                    fill
                    sizes="176px"
                    style={{ objectFit: "contain", padding: "2px" }}
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

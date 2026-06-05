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
      ariaLabel="Merchants powered by E-biz"
      style={{ paddingTop: 56, paddingBottom: 56 }}
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "28px 32px",
        }}
      >
        {clients.map((c) => (
          <div key={c.file} className="client-chip" title={c.name}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src={`/clients/${c.file}`}
                alt={c.name}
                fill
                sizes="176px"
                style={{ objectFit: "contain", padding: "2px" }}
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

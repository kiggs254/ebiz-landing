import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Section } from "@/components/primitives";
import OnboardingWizard from "@/components/Onboarding/OnboardingWizard";
import { JsonLd, breadcrumb } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "Tell us about your business and we'll tailor your E-biz setup — selling online, in-store, and on WhatsApp from one dashboard.",
  alternates: { canonical: "https://e-biz.co.ke/get-started" },
};

export default function GetStartedPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Get started", path: "/get-started" },
        ])}
      />
      <Nav />
      <main>
        <Section id="get-started" ariaLabel="Get started with E-biz">
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span className="eyebrow" style={{ justifyContent: "center" }}>
                Get started
              </span>
              <h2 className="section-title" style={{ margin: "14px auto 0", maxWidth: "none" }}>
                Let&apos;s tailor E-biz <em>to your business.</em>
              </h2>
              <p className="section-lede" style={{ marginTop: 14 }}>
                A few quick questions so we can set you up right. Takes about a minute.
              </p>
            </div>
            <div
              style={{
                border: "1px solid var(--line-soft)",
                borderRadius: 18,
                padding: "28px 28px 24px",
                background: "var(--bg)",
              }}
            >
              <OnboardingWizard />
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

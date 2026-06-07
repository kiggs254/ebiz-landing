"use client";

import { useState } from "react";
import Link from "next/link";
import { submitOnboarding, onboardingAssist } from "@/lib/leads";

const CHANNELS = [
  "Nowhere yet",
  "Instagram / Facebook",
  "WhatsApp",
  "A website (Shopify, Woo, Wix…)",
  "A physical shop",
  "A marketplace (Jumia, Amazon…)",
];
const SELLS = [
  "Fashion & apparel",
  "Electronics",
  "Groceries & food",
  "Health & pharmacy",
  "Beauty & cosmetics",
  "Home & furniture",
  "Something else",
];
const CATALOG = ["Just starting", "Under 100 products", "100–1,000 products", "1,000+ products"];
const ORDERS = ["A few a week", "Tens a month", "Hundreds a month", "Thousands a month"];
const PRIORITIES = [
  "An online store",
  "Selling on WhatsApp",
  "Inventory & branches",
  "Payments (M-Pesa, cards)",
  "Migrating from another platform",
  "Marketing & loyalty",
];

type Step = "channels" | "sells" | "size" | "priorities" | "about" | "followup" | "contact";
const BASE: Step[] = ["channels", "sells", "size", "priorities", "about", "contact"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "inherit",
  fontSize: 16,
  color: "var(--ink)",
  background: "var(--bg)",
  border: "1px solid var(--line-soft)",
  borderRadius: 10,
  padding: "11px 13px",
  outline: "none",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--ink-2)",
  marginBottom: 6,
};

function Chips({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className="wiz-chip"
          aria-pressed={selected.includes(o)}
          onClick={() => onToggle(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function OnboardingWizard() {
  const [step, setStep] = useState<Step>("channels");
  const [channels, setChannels] = useState<string[]>([]);
  const [sells, setSells] = useState("");
  const [catalog, setCatalog] = useState("");
  const [orders, setOrders] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [about, setAbout] = useState("");
  const [followupQ, setFollowupQ] = useState<string | null>(null);
  const [followupA, setFollowupA] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [hp, setHp] = useState("");

  const [assisting, setAssisting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const sizeCombined = () => [catalog, orders].filter(Boolean).join(" · ");

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const valid: Record<Step, boolean> = {
    channels: channels.length > 0,
    sells: !!sells,
    size: !!catalog,
    priorities: priorities.length > 0,
    about: true,
    followup: true,
    contact: name.trim().length > 0 && /.+@.+\..+/.test(email),
  };

  const progress = step === "followup" ? 0.85 : BASE.indexOf(step) / (BASE.length - 1);

  async function assistThenAdvance() {
    setAssisting(true);
    try {
      const { question } = await onboardingAssist({
        selling_channels: channels,
        sells: sells || undefined,
        size: sizeCombined() || undefined,
        priorities,
        about: about || undefined,
        country: country || undefined,
        company: company || undefined,
        hp: hp || undefined,
      });
      if (question) {
        setFollowupQ(question);
        setStep("followup");
      } else {
        setStep("contact");
      }
    } catch {
      setStep("contact");
    } finally {
      setAssisting(false);
    }
  }

  function next() {
    setError("");
    if (step === "channels") setStep("sells");
    else if (step === "sells") setStep("size");
    else if (step === "size") setStep("priorities");
    else if (step === "priorities") setStep("about");
    else if (step === "about") void assistThenAdvance();
    else if (step === "followup") setStep("contact");
  }

  function back() {
    setError("");
    if (step === "sells") setStep("channels");
    else if (step === "size") setStep("sells");
    else if (step === "priorities") setStep("size");
    else if (step === "about") setStep("priorities");
    else if (step === "followup") setStep("about");
    else if (step === "contact") setStep(followupQ ? "followup" : "about");
  }

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const { recommendation } = await submitOnboarding({
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        country: country || undefined,
        selling_channels: channels,
        sells: sells || undefined,
        size: sizeCombined() || undefined,
        priorities,
        about: about || undefined,
        followup_q: followupQ || undefined,
        followup_a: followupA || undefined,
        hp: hp || undefined,
        source: typeof window !== "undefined" ? window.location.href : undefined,
      });
      setRecommendation(recommendation);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="wiz-step" style={{ textAlign: "center" }}>
        <div
          aria-hidden
          style={{
            width: 52,
            height: 52,
            borderRadius: 999,
            margin: "0 auto 16px",
            display: "grid",
            placeItems: "center",
            background: "var(--green-soft)",
            color: "var(--green-ink)",
            fontSize: 26,
          }}
        >
          ✓
        </div>
        <h1
          className="display"
          style={{ fontSize: "clamp(26px, 3.4vw, 38px)", fontWeight: 600, letterSpacing: "-0.025em" }}
        >
          You&apos;re on the list, {name.split(" ")[0] || "there"}.
        </h1>
        <p style={{ color: "var(--ink-3)", marginTop: 10, fontSize: 16, lineHeight: 1.6, maxWidth: "46ch", marginInline: "auto" }}>
          We&apos;ve emailed you a confirmation and our team will reach out shortly to get you set up.
        </p>

        {recommendation && (
          <div
            style={{
              marginTop: 26,
              textAlign: "left",
              border: "1px solid var(--line-soft)",
              borderRadius: 14,
              padding: 22,
              background: "var(--bg)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent-ink)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
              How E-biz fits you
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--ink-2)", whiteSpace: "pre-wrap" }}>
              {recommendation}
            </p>
          </div>
        )}

        <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/features" className="btn btn-primary">
            Explore features <span className="arrow">→</span>
          </Link>
          <Link href="/" className="btn btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const canNext = valid[step];
  const isContact = step === "contact";

  return (
    <div>
      {/* progress */}
      <div style={{ height: 4, borderRadius: 999, background: "var(--bg-3)", overflow: "hidden", marginBottom: 28 }}>
        <div
          style={{
            height: "100%",
            width: `${Math.round(progress * 100)}%`,
            background: "var(--accent)",
            borderRadius: 999,
            transition: "width 0.35s cubic-bezier(0.22,0.61,0.36,1)",
          }}
        />
      </div>

      <div key={step} className="wiz-step">
        {step === "channels" && (
          <Question title="Where do you sell right now?" hint="Pick all that apply.">
            <Chips options={CHANNELS} selected={channels} onToggle={(v) => toggle(channels, setChannels, v)} />
          </Question>
        )}

        {step === "sells" && (
          <Question title="What do you sell?">
            <Chips options={SELLS} selected={sells ? [sells] : []} onToggle={(v) => setSells(v)} />
          </Question>
        )}

        {step === "size" && (
          <Question title="How big is your business?" hint="Roughly — this just helps us tailor your setup.">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <div style={labelStyle}>Catalog size</div>
                <Chips options={CATALOG} selected={catalog ? [catalog] : []} onToggle={(v) => setCatalog(v)} />
              </div>
              <div>
                <div style={labelStyle}>Orders</div>
                <Chips options={ORDERS} selected={orders ? [orders] : []} onToggle={(v) => setOrders(v)} />
              </div>
            </div>
          </Question>
        )}

        {step === "priorities" && (
          <Question title="What matters most right now?" hint="Pick all that apply.">
            <Chips options={PRIORITIES} selected={priorities} onToggle={(v) => toggle(priorities, setPriorities, v)} />
          </Question>
        )}

        {step === "about" && (
          <Question title="Tell us about your business" hint="A sentence or two — our AI uses this to tailor your plan. Optional.">
            <textarea
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
              value={about}
              placeholder="e.g. We run a small pharmacy in Nairobi and want to start selling online and on WhatsApp, and move our products over from WooCommerce."
              onChange={(e) => setAbout(e.target.value)}
            />
          </Question>
        )}

        {step === "followup" && (
          <Question
            title={followupQ || "One more thing…"}
            hint="Tailored to what you shared. Optional."
            badge="AI follow-up"
          >
            <textarea
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              value={followupA}
              onChange={(e) => setFollowupA(e.target.value)}
            />
          </Question>
        )}

        {step === "contact" && (
          <Question title="Where should we reach you?">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="cf-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label htmlFor="ob-name" style={labelStyle}>Name</label>
                  <input id="ob-name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="ob-email" style={labelStyle}>Email</label>
                  <input id="ob-email" type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="cf-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label htmlFor="ob-company" style={labelStyle}>Business name (optional)</label>
                  <input id="ob-company" style={inputStyle} value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="ob-phone" style={labelStyle}>Phone (optional)</label>
                  <input id="ob-phone" style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="ob-country" style={labelStyle}>Country (optional)</label>
                <input id="ob-country" style={inputStyle} value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </div>
          </Question>
        )}
      </div>

      {/* honeypot */}
      <div aria-hidden style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="ob-company-url">Company URL</label>
        <input id="ob-company-url" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>

      {error && (
        <p style={{ color: "var(--accent-ink)", fontSize: 13.5, marginTop: 18 }}>
          {error} You can also email{" "}
          <a href="mailto:hello@e-biz.co.ke" style={{ color: "var(--accent-ink)", textDecoration: "underline" }}>
            hello@e-biz.co.ke
          </a>
          .
        </p>
      )}

      {/* nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 30 }}>
        {step !== "channels" ? (
          <button type="button" className="btn btn-ghost" onClick={back} disabled={assisting || submitting}>
            Back
          </button>
        ) : (
          <Link href="/" className="btn btn-ghost">
            Cancel
          </Link>
        )}
        <div style={{ flex: 1 }} />
        {isContact ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={submit}
            disabled={!canNext || submitting}
            style={{ opacity: !canNext || submitting ? 0.6 : 1 }}
          >
            {submitting ? "Sending…" : "Get my setup plan"} <span className="arrow">→</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={next}
            disabled={!canNext || assisting}
            style={{ opacity: !canNext || assisting ? 0.6 : 1 }}
          >
            {assisting ? "Thinking…" : step === "about" ? "Continue" : "Next"} <span className="arrow">→</span>
          </button>
        )}
      </div>
    </div>
  );
}

function Question({
  title,
  hint,
  badge,
  children,
}: {
  title: string;
  hint?: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {badge && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--violet-ink)",
            marginBottom: 12,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--violet)" }} />
          {badge}
        </span>
      )}
      <h1
        className="display"
        style={{
          fontSize: "clamp(24px, 3.2vw, 34px)",
          fontWeight: 600,
          letterSpacing: "-0.025em",
          lineHeight: 1.15,
          margin: 0,
          textWrap: "balance",
        }}
      >
        {title}
      </h1>
      {hint && <p style={{ color: "var(--ink-3)", marginTop: 8, fontSize: 15, lineHeight: 1.5 }}>{hint}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </div>
  );
}

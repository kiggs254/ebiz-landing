"use client";

import { useState } from "react";
import { submitContact } from "@/lib/leads";

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

type Status = "idle" | "submitting" | "done" | "error";

/**
 * Contact form wired to the E-biz Manager (`/api/public/contact`): stores the
 * message as a lead and emails the sender a confirmation. Falls back to a clear
 * error with a mailto if the request fails.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot — real users never see/fill this
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError("");
    try {
      await submitContact({
        name,
        email,
        company: company || undefined,
        message,
        hp: hp || undefined,
        source: typeof window !== "undefined" ? window.location.href : undefined,
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "done") {
    return (
      <div
        style={{
          border: "1px solid var(--line-soft)",
          borderRadius: 16,
          padding: 28,
          background: "var(--bg)",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            margin: "0 auto 14px",
            display: "grid",
            placeItems: "center",
            background: "var(--green-soft)",
            color: "var(--green-ink)",
            fontSize: 22,
          }}
        >
          ✓
        </div>
        <div className="display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Message sent
        </div>
        <p style={{ color: "var(--ink-3)", marginTop: 8, fontSize: 15, lineHeight: 1.55 }}>
          Thanks for reaching out — we&apos;ve emailed you a confirmation and someone from the team
          will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        border: "1px solid var(--line-soft)",
        borderRadius: 16,
        padding: 24,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div className="cf-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label htmlFor="cf-name" style={labelStyle}>
            Name
          </label>
          <input id="cf-name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="cf-email" style={labelStyle}>
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="cf-company" style={labelStyle}>
          Company (optional)
        </label>
        <input id="cf-company" style={inputStyle} value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>
      <div>
        <label htmlFor="cf-message" style={labelStyle}>
          How can we help?
        </label>
        <textarea
          id="cf-message"
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      {/* Honeypot — visually hidden, off the tab order. Bots fill it; humans don't. */}
      <div aria-hidden style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="cf-company-url">Company URL</label>
        <input
          id="cf-company-url"
          tabIndex={-1}
          autoComplete="off"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p style={{ color: "var(--accent-ink)", fontSize: 13.5, margin: 0 }}>
          {error || "Couldn't send your message."} You can also email us at{" "}
          <a href="mailto:hello@e-biz.co.ke" style={{ color: "var(--accent-ink)", textDecoration: "underline" }}>
            hello@e-biz.co.ke
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        style={{ alignSelf: "flex-start", opacity: status === "submitting" ? 0.7 : 1 }}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send message"} <span className="arrow">→</span>
      </button>
    </form>
  );
}

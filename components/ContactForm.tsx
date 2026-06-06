"use client";

import { useState } from "react";

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

/**
 * No-backend contact form: composes a mailto: link from the fields so it works
 * on a static deploy. Swap for a POST to an API route if/when one exists.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Website enquiry from ${name || "a visitor"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:hello@e-biz.co.ke?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

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
          <label htmlFor="cf-name" style={labelStyle}>Name</label>
          <input id="cf-name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="cf-email" style={labelStyle}>Email</label>
          <input id="cf-email" type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
      </div>
      <div>
        <label htmlFor="cf-company" style={labelStyle}>Company (optional)</label>
        <input id="cf-company" style={inputStyle} value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>
      <div>
        <label htmlFor="cf-message" style={labelStyle}>How can we help?</label>
        <textarea
          id="cf-message"
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
        Send message <span className="arrow">→</span>
      </button>
    </form>
  );
}

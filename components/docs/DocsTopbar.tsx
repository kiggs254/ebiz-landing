"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/primitives";
import { DocsSearch, type SearchEntry } from "./DocsSearch";

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const d = localStorage.getItem("ebiz-theme") === "dark";
    document.documentElement.dataset.theme = d ? "dark" : "light";
    setDark(d);
  }, []);
  const toggle = () => {
    const d = !dark;
    setDark(d);
    document.documentElement.dataset.theme = d ? "dark" : "light";
    localStorage.setItem("ebiz-theme", d ? "dark" : "light");
  };
  return (
    <button
      type="button"
      className="dc-icon-btn"
      onClick={toggle}
      aria-label="Toggle dark mode"
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}

export function DocsTopbar({ index }: { index: SearchEntry[] }) {
  const toggleNav = () =>
    window.dispatchEvent(new CustomEvent("ebiz-docs-nav-toggle"));

  return (
    <header className="dc-topbar">
      <div className="dc-topbar-left">
        <button
          type="button"
          className="dc-hamburger"
          onClick={toggleNav}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
        <Link href="/" className="dc-logo" aria-label="E-biz home">
          <Logo />
        </Link>
        <span className="dc-topbar-tag">API Reference</span>
      </div>
      <div className="dc-topbar-right">
        <DocsSearch index={index} />
        <ThemeToggle />
        <Link href="/" className="dc-topbar-back">
          Back to site
        </Link>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Logo } from "@/components/primitives";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DocsSearch, type SearchEntry } from "./DocsSearch";

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
        <ThemeToggle className="dc-icon-btn" />
        <Link href="/" className="dc-topbar-back">
          Back to site
        </Link>
      </div>
    </header>
  );
}

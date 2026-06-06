"use client";

import { useState } from "react";

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="dc-code">
      <div className="dc-code-bar">
        <span className="dc-code-lang">{lang || "text"}</span>
        <button type="button" className="dc-copy" onClick={copy} aria-label="Copy code">
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

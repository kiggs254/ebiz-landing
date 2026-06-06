import Link from "next/link";
import { DOC_GROUPS } from "./registry";
import { Doc } from "./Markdown";

export function DocsHome({ overview }: { overview: string }) {
  const facts: Array<[string, string]> = [
    ["Base URL", "/api/v1"],
    ["Auth", "HTTP Basic / X-API-Key"],
    ["Format", "JSON · status + data"],
  ];

  return (
    <article className="dc-article dc-home">
      <span className="dc-eyebrow">E-biz API</span>
      <h1>API reference</h1>
      <p className="dc-lead">
        Build on E-biz. The REST API lets you manage products, orders, customers,
        branches, and payments, with API keys, webhooks, and realtime events. If
        you have used WooCommerce&apos;s REST API, this will feel familiar.
      </p>

      <div className="dc-facts">
        {facts.map(([k, v]) => (
          <div key={k} className="dc-fact">
            <div className="dc-fact-k">{k}</div>
            <div className="dc-fact-v">
              <code className="dc-inline">{v}</code>
            </div>
          </div>
        ))}
      </div>

      {overview ? (
        <div className="dc-home-overview">
          <Doc source={overview} />
        </div>
      ) : null}

      <h2 id="explore">Explore the reference</h2>
      <div className="dc-card-grid">
        {DOC_GROUPS.map((g) => (
          <div key={g.label} className="dc-home-card">
            <div className="dc-home-card-label">{g.label}</div>
            <div className="dc-home-card-links">
              {g.items.map((it) => (
                <Link
                  key={it.slug}
                  href={`/docs/${it.slug}`}
                  className="dc-home-card-link"
                >
                  {it.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

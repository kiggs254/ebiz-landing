import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { CodeBlock } from "./CodeBlock";

function toText(node: ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = (node as any)?.props;
  if (props?.children) return toText(props.children);
  return "";
}

const METHOD_RE = /^(GET|POST|PUT|PATCH|DELETE)\s+(\S+)?\s*([\s\S]*)$/;

function EndpointHeading({ children }: { children: ReactNode }) {
  const text = toText(children).trim();
  const m = text.match(METHOD_RE);
  if (!m) return <>{children}</>;
  const [, method, path, rest] = m;
  return (
    <span className="dc-endpoint">
      <span className={`dc-method dc-method-${method.toLowerCase()}`}>{method}</span>
      {path ? <code className="dc-path">{path}</code> : null}
      {rest ? (
        <span className="dc-endpoint-label">{rest.replace(/^[\s–-]+/, "")}</span>
      ) : null}
    </span>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: any = {
  h2: (props: any) => <h2 {...props} />,
  h3: ({ children, ...props }: any) => (
    <h3 {...props}>
      <EndpointHeading>{children}</EndpointHeading>
    </h3>
  ),
  h4: (props: any) => <h4 {...props} />,
  pre: ({ children }: any) => <>{children}</>,
  code: ({ className, children, ...props }: any) => {
    const text = String(children ?? "");
    const isBlock = /language-/.test(className || "") || text.includes("\n");
    if (!isBlock) {
      return (
        <code className="dc-inline" {...props}>
          {children}
        </code>
      );
    }
    const lang = (className || "").replace(/language-/, "") || "text";
    return <CodeBlock code={text.replace(/\n$/, "")} lang={lang} />;
  },
  a: ({ href = "", children, ...props }: any) => {
    if (href.startsWith("#")) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    if (href.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    );
  },
  table: ({ children, ...props }: any) => (
    <div className="dc-table-wrap">
      <table {...props}>{children}</table>
    </div>
  ),
};

export function Doc({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={components}
    >
      {source}
    </ReactMarkdown>
  );
}

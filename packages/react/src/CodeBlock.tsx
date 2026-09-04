import { Highlight, type Language, type PrismTheme } from "prism-react-renderer";

import { cn } from "./lib/cn";

// 디자인 토큰(--syntax-*) 기반 프리즘 테마 — 라이트/다크는 globals.css 가 결정.
const tokenTheme: PrismTheme = {
  plain: { color: "var(--syntax-plain)" },
  styles: [
    { types: ["keyword", "builtin", "important"], style: { color: "var(--syntax-keyword)" } },
    {
      types: ["string", "char", "inserted", "attr-value"],
      style: { color: "var(--syntax-string)" },
    },
    {
      types: ["function", "method", "class-name", "maybe-class-name"],
      style: { color: "var(--syntax-function)" },
    },
    {
      types: ["number", "boolean", "constant", "symbol"],
      style: { color: "var(--syntax-number)" },
    },
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "var(--syntax-comment)", fontStyle: "italic" },
    },
    {
      types: ["punctuation", "operator", "property", "tag", "attr-name"],
      style: { color: "var(--syntax-punctuation)" },
    },
  ],
};

export function CodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language: Language;
  /** pre 에 병합 — 높이/스크롤은 호출처가 결정 */
  className?: string;
}) {
  return (
    <Highlight code={code} language={language} theme={tokenTheme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className={cn("overflow-auto font-mono text-xs leading-5", className)}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, j) => (
                <span key={j} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DevBox Tools — Free Online Developer Tools",
  description: "Free online tools for developers: JSON formatter, YAML validator, SQL formatter, and more. No login required.",
};

const tools = [
  {
    href: "/json-formatter",
    title: "JSON Formatter & Validator",
    description: "Format, validate and minify JSON instantly in the browser.",
    tag: "{ }",
  },
  {
    href: "/yaml-validator",
    title: "YAML Validator & Formatter",
    description: "Validate and format YAML files with detailed error messages.",
    tag: "---",
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-3">Developer Tools, Simplified</h1>
      <p className="text-lg mb-12" style={{ color: "var(--text-muted)" }}>
        Free, fast, and privacy-friendly. Everything runs in your browser — nothing is sent to a server.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-xl p-6 flex flex-col gap-3 transition-colors hover:border-indigo-500"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span
              className="font-mono text-sm font-bold px-2 py-1 rounded w-fit"
              style={{ background: "var(--surface-2)", color: "var(--accent-hover)" }}
            >
              {tool.tag}
            </span>
            <h2 className="font-semibold text-base">{tool.title}</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

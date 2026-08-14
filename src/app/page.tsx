import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DevBox Tools — Free Online Developer Tools",
  description: "Free online tools for developers and everyone: JSON formatter, regex tester, unit converter, BMI calculator, and more.",
};

const groups = [
  {
    category: "Developer",
    tools: [
      { href: "/json-formatter", title: "JSON Formatter", description: "Format and validate JSON with error highlighting.", tag: "{ }" },
      { href: "/yaml-validator", title: "YAML Validator", description: "Validate and format YAML with line/column errors.", tag: "---" },
      { href: "/text-diff", title: "Text Diff", description: "Compare two texts and highlight every change.", tag: "±" },
      { href: "/encoder-decoder", title: "Base64 / URL / JWT", description: "Encode, decode Base64, URL strings, and JWT tokens.", tag: "64" },
      { href: "/regex-tester", title: "Regex Tester", description: "Test regular expressions with real-time match highlighting.", tag: ".*" },
      { href: "/gitignore-generator", title: ".gitignore Generator", description: "Generate .gitignore for any stack with one click.", tag: ".gi" },
      { href: "/timestamp-converter", title: "Timestamp Converter", description: "Convert Unix timestamps to readable dates and back.", tag: "TS" },
      { href: "/password-generator", title: "Password Generator", description: "Generate strong, secure random passwords.", tag: "🔑" },
      { href: "/color-converter", title: "Color Converter", description: "Convert between HEX, RGB, and HSL color formats.", tag: "●" },
      { href: "/cpf-cnpj-generator", title: "CPF / CNPJ", description: "Gere e valide CPF e CNPJ para testes de software.", tag: "BR" },
    ],
  },
  {
    category: "Utilities",
    tools: [
      { href: "/word-counter", title: "Word Counter", description: "Count words, characters, and get estimated reading time.", tag: "W" },
      { href: "/unit-converter", title: "Unit Converter", description: "Convert length, weight, temperature, and volume.", tag: "⇄" },
      { href: "/bmi-calculator", title: "BMI Calculator", description: "Calculate Body Mass Index with metric or imperial units.", tag: "BMI" },
      { href: "/compound-interest", title: "Compound Interest", description: "Calculate investment growth with compound interest.", tag: "$" },
    ],
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-3">Developer Tools, Simplified</h1>
      <p className="text-lg mb-14" style={{ color: "var(--text-muted)" }}>
        Free, fast, and privacy-friendly. Everything runs in your browser — nothing is sent to a server.
      </p>
      {groups.map((group) => (
        <div key={group.category} className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>{group.category}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-xl p-5 flex flex-col gap-3 transition-colors hover:border-indigo-500"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <span className="font-mono text-sm font-bold px-2 py-1 rounded w-fit" style={{ background: "var(--surface-2)", color: "var(--accent-hover)" }}>
                  {tool.tag}
                </span>
                <h3 className="font-semibold text-base">{tool.title}</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

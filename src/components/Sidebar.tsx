"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tools = [
  { category: "Developer", items: [
    { href: "/json-formatter", label: "JSON Formatter" },
    { href: "/yaml-validator", label: "YAML Validator" },
    { href: "/text-diff", label: "Text Diff" },
    { href: "/encoder-decoder", label: "Base64 / URL / JWT" },
    { href: "/regex-tester", label: "Regex Tester" },
    { href: "/gitignore-generator", label: ".gitignore Generator" },
    { href: "/timestamp-converter", label: "Timestamp Converter" },
    { href: "/password-generator", label: "Password Generator" },
    { href: "/color-converter", label: "Color Converter" },
    { href: "/cpf-cnpj-generator", label: "CPF / CNPJ" },
  ]},
  { category: "Utilities", items: [
    { href: "/word-counter", label: "Word Counter" },
    { href: "/unit-converter", label: "Unit Converter" },
    { href: "/bmi-calculator", label: "BMI Calculator" },
    { href: "/compound-interest", label: "Compound Interest" },
  ]},
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
        style={{ color: "var(--text-muted)" }}
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className="fixed top-0 left-0 h-full z-50 flex flex-col overflow-y-auto transition-transform"
        style={{
          width: "260px",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <Link href="/" onClick={() => setOpen(false)} className="font-bold text-base" style={{ color: "var(--accent-hover)" }}>
            DevBox<span style={{ color: "var(--text-muted)" }}>.tools</span>
          </Link>
          <button onClick={() => setOpen(false)} className="cursor-pointer hover:opacity-80" style={{ color: "var(--text-muted)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-3 py-5">
          {tools.map((group) => (
            <div key={group.category}>
              <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: "var(--text-muted)" }}>
                {group.category}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{
                        background: active ? "var(--surface-2)" : "transparent",
                        color: active ? "var(--text)" : "var(--text-muted)",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

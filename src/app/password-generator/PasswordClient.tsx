"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

const CHARS = {
  upper:   "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower:   "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

type StrengthKey = "weak" | "medium" | "strong";

function getStrength(password: string): { key: StrengthKey; color: string; width: string } {
  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { key: "weak",   color: "var(--error)",   width: "33%" };
  if (score <= 4) return { key: "medium", color: "#f59e0b",        width: "66%" };
  return              { key: "strong", color: "var(--success)", width: "100%" };
}

function generate(length: number, opts: Record<string, boolean>): string {
  let pool = "";
  if (opts.upper)   pool += CHARS.upper;
  if (opts.lower)   pool += CHARS.lower;
  if (opts.numbers) pool += CHARS.numbers;
  if (opts.symbols) pool += CHARS.symbols;
  if (!pool) pool = CHARS.lower;
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((n) => pool[n % pool.length]).join("");
}

export default function PasswordClient() {
  const t = useTranslations("passwordGenerator");
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: false });
  const [passwords, setPasswords] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => generate(16, { upper: true, lower: true, numbers: true, symbols: false }))
  );
  const [copied, setCopied] = useState<number | null>(null);

  const handleGenerate = useCallback(() => {
    setPasswords(Array.from({ length: 5 }, () => generate(length, opts)));
  }, [length, opts]);

  const handleCopy = (pw: string, i: number) => {
    navigator.clipboard.writeText(pw);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const OPT_LABELS: Record<keyof typeof opts, string> = {
    upper:   t("uppercase"),
    lower:   t("lowercase"),
    numbers: t("numbers"),
    symbols: t("symbols"),
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl p-5 flex flex-col gap-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">{t("length")}</label>
            <span className="font-mono text-sm font-bold" style={{ color: "var(--accent-hover)" }}>{length}</span>
          </div>
          <input
            type="range" min={8} max={64} value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
            <span>8</span><span>64</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(opts) as (keyof typeof opts)[]).map((key) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox" checked={opts[key]}
                onChange={(e) => setOpts((o) => ({ ...o, [key]: e.target.checked }))}
                className="accent-indigo-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-sm">{OPT_LABELS[key]}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          className="btn-press px-5 py-2.5 rounded-lg font-medium text-sm cursor-pointer w-full"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {t("generatePasswords")}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {passwords.map((pw, i) => {
          const strength = getStrength(pw);
          return (
            <div key={i} className="rounded-xl px-4 py-3 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-sm break-all" style={{ color: "var(--text)" }}>{pw}</span>
                <button
                  onClick={() => handleCopy(pw, i)}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity shrink-0"
                  style={{ background: copied === i ? "var(--success)" : "var(--accent)", color: "#fff" }}
                >
                  {copied === i ? t("copied") : t("copy")}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full" style={{ background: "var(--border)" }}>
                  <div className="h-1 rounded-full transition-all" style={{ width: strength.width, background: strength.color }} />
                </div>
                <span className="text-xs font-medium" style={{ color: strength.color }}>{t(strength.key)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

const EXAMPLES = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "URL",   pattern: "https?:\\/\\/[^\\s]+", flags: "g" },
  { label: "IPv4",  pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}", flags: "g" },
];

export default function RegexClient() {
  const t = useTranslations("regexTester");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Type or paste your text here to test the regex above. Matches will be highlighted in real time.");

  const FLAG_OPTIONS = [
    { flag: "g", label: "g", title: t("flagGlobal") },
    { flag: "i", label: "i", title: t("flagCaseInsensitive") },
    { flag: "m", label: "m", title: t("flagMultiline") },
    { flag: "s", label: "s", title: t("flagDotAll") },
  ];

  const toggleFlag = (f: string) => {
    setFlags((prev) => prev.includes(f) ? prev.replace(f, "") : prev + f);
  };

  const { regex, error, matches } = useMemo(() => {
    if (!pattern) return { regex: null, error: "", matches: [] };
    try {
      const r = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const m = [...text.matchAll(new RegExp(pattern, flags.includes("g") ? flags : flags + "g"))];
      return { regex: r, error: "", matches: m };
    } catch (e) {
      return { regex: null, error: String(e).replace("SyntaxError: ", ""), matches: [] };
    }
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => {
    if (!regex || matches.length === 0) return null;
    const parts: { text: string; match: boolean }[] = [];
    let last = 0;
    for (const m of matches) {
      if (m.index! > last) parts.push({ text: text.slice(last, m.index), match: false });
      parts.push({ text: m[0], match: true });
      last = m.index! + m[0].length;
    }
    if (last < text.length) parts.push({ text: text.slice(last), match: false });
    return parts;
  }, [regex, matches, text]);

  return (
    <div className="flex flex-col gap-5">
      {/* Pattern input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("patternLabel")}</label>
        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `1px solid ${error ? "var(--error)" : "var(--border)"}`, background: "var(--surface)" }}>
          <span className="px-3 text-lg font-mono select-none" style={{ color: "var(--text-muted)" }}>/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="your pattern here"
            className="flex-1 py-3 font-mono text-sm outline-none bg-transparent"
            style={{ color: "var(--text)" }}
            spellCheck={false}
          />
          <span className="px-3 text-lg font-mono select-none" style={{ color: "var(--text-muted)" }}>/{flags}</span>
        </div>
        {error && <p className="text-xs font-mono" style={{ color: "var(--error)" }}>{error}</p>}
      </div>

      {/* Flags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>{t("flagsLabel")}:</span>
        {FLAG_OPTIONS.map((f) => (
          <button key={f.flag} title={f.title} onClick={() => toggleFlag(f.flag)}
            className="px-3 py-1 rounded font-mono text-sm cursor-pointer transition-all"
            style={{ background: flags.includes(f.flag) ? "var(--accent)" : "var(--surface)", color: flags.includes(f.flag) ? "#fff" : "var(--text-muted)", border: `1px solid ${flags.includes(f.flag) ? "var(--accent)" : "var(--border)"}` }}>
            {f.label}
          </button>
        ))}
        <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
          {matches.length > 0
            ? <span style={{ color: "var(--success)" }}>{t("matchCount", { count: matches.length })}</span>
            : pattern && !error
              ? <span style={{ color: "var(--error)" }}>{t("noMatches")}</span>
              : ""}
        </span>
      </div>

      {/* Examples */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t("examples")}:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex.label} onClick={() => { setPattern(ex.pattern); setFlags(ex.flags); }}
            className="text-xs px-3 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            {ex.label}
          </button>
        ))}
      </div>

      {/* Test text */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("testTextLabel")}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-36 rounded-lg p-3 font-mono text-sm resize-y outline-none focus:ring-2 focus:ring-indigo-500"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", minHeight: "120px" }}
          spellCheck={false}
        />
      </div>

      {/* Highlighted output */}
      {highlighted && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("highlightedLabel")}</label>
          <div className="rounded-lg p-3 font-mono text-sm whitespace-pre-wrap break-all" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", minHeight: "80px" }}>
            {highlighted.map((p, i) =>
              p.match
                ? <mark key={i} style={{ background: "#6366f180", color: "var(--accent-hover)", borderRadius: "3px", padding: "1px 2px" }}>{p.text}</mark>
                : <span key={i} style={{ color: "var(--text)" }}>{p.text}</span>
            )}
          </div>
        </div>
      )}

      {/* Match details */}
      {matches.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("detailsLabel")}</label>
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {matches.slice(0, 20).map((m, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-2 text-sm" style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
                <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}>#{i + 1}</span>
                <span className="font-mono" style={{ color: "var(--accent-hover)" }}>{m[0]}</span>
                <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>{t("matchIndex", { index: m.index })}</span>
              </div>
            ))}
            {matches.length > 20 && (
              <div className="px-4 py-2 text-xs" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
                {t("moreMatches", { count: matches.length - 20 })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

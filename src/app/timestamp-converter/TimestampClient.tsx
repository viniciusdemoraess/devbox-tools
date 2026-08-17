"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

type TFunc = ReturnType<typeof useTranslations>;

function toMs(value: string): number | null {
  const n = Number(value.trim());
  if (isNaN(n)) return null;
  return n < 1e12 ? n * 1000 : n;
}

function relativeTime(ms: number, t: TFunc): string {
  const diff = Math.round((ms - Date.now()) / 1000);
  const abs = Math.abs(diff);
  const past = diff < 0;
  if (abs < 60)    return past ? t("secondsAgo", { n: abs })              : t("inSeconds", { n: abs });
  if (abs < 3600)  return past ? t("minutesAgo", { n: Math.floor(abs / 60) })   : t("inMinutes", { n: Math.floor(abs / 60) });
  if (abs < 86400) return past ? t("hoursAgo",   { n: Math.floor(abs / 3600) })  : t("inHours",   { n: Math.floor(abs / 3600) });
  return                  past ? t("daysAgo",    { n: Math.floor(abs / 86400) }) : t("inDays",    { n: Math.floor(abs / 86400) });
}

function ResultRow({ label, value, t }: { label: string; value: string; t: TFunc }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
        <span className="font-mono text-sm" style={{ color: "var(--text)" }}>{value}</span>
      </div>
      <button
        onClick={handleCopy}
        className="text-xs px-3 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity shrink-0 ml-4"
        style={{ background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
      >
        {copied ? t("copied") : t("copy")}
      </button>
    </div>
  );
}

export default function TimestampClient() {
  const t = useTranslations("timestampConverter");
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[] | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  const convert = useCallback((raw: string) => {
    if (!raw.trim()) {
      setResults(null);
      setError("");
      return;
    }

    const ms = toMs(raw);
    if (ms === null) {
      const parsed = new Date(raw);
      if (isNaN(parsed.getTime())) {
        setError(t("inputError"));
        setResults(null);
        return;
      }
      setError("");
      const ts = parsed.getTime();
      setResults([
        { label: t("unixSeconds"), value: String(Math.floor(ts / 1000)) },
        { label: t("unixMillis"),  value: String(ts) },
        { label: t("iso8601"),     value: parsed.toISOString() },
        { label: t("utc"),         value: parsed.toUTCString() },
        { label: t("localTime"),   value: parsed.toLocaleString() },
        { label: t("relative"),    value: relativeTime(ts, t) },
      ]);
      return;
    }

    const date = new Date(ms);
    setError("");
    setResults([
      { label: t("iso8601"),   value: date.toISOString() },
      { label: t("utc"),       value: date.toUTCString() },
      { label: t("localTime"), value: date.toLocaleString() },
      { label: t("dateOnly"),  value: date.toLocaleDateString() },
      { label: t("timeOnly"),  value: date.toLocaleTimeString() },
      { label: t("relative"),  value: relativeTime(ms, t) },
    ]);
  }, [t]);

  const handleInput = (value: string) => {
    setInput(value);
    convert(value);
  };

  const handleNow = () => {
    const ts = String(Math.floor(Date.now() / 1000));
    setInput(ts);
    convert(ts);
  };

  const handleClear = () => {
    setInput("");
    setResults(null);
    setError("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Current timestamp ticker */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-lg"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div>
          <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{t("current")}</p>
          <p className="font-mono text-xl font-bold" style={{ color: "var(--accent-hover)" }}>{now}</p>
        </div>
        <button
          onClick={handleNow}
          className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {t("useNow")}
        </button>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          {t("inputLabel")}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-lg px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ background: "var(--surface)", border: `1px solid ${error ? "var(--error)" : "var(--border)"}`, color: "var(--text)" }}
            placeholder="e.g. 1700000000 or 2024-01-15T10:30:00Z"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            spellCheck={false}
          />
          <button
            onClick={handleClear}
            className="px-4 py-3 rounded-lg text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            {t("clear")}
          </button>
        </div>
        {error && <p className="text-xs" style={{ color: "var(--error)" }}>{error}</p>}
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t("inputHint")}</p>
      </div>

      {/* Results */}
      {results && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("results")}</p>
          {results.map((r) => (
            <ResultRow key={r.label} label={r.label} value={r.value} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

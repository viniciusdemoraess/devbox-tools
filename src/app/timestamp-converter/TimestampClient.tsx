"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

type TFunc = ReturnType<typeof useTranslations>;
type FromFormat = "epoch_s" | "epoch_ms" | "iso" | "utc" | "local";
type ToFormat = FromFormat | "relative";

const FROM_FORMATS: FromFormat[] = ["epoch_s", "epoch_ms", "iso", "utc", "local"];
const TO_FORMATS: ToFormat[] = ["epoch_s", "epoch_ms", "iso", "utc", "local", "relative"];

const PLACEHOLDERS: Record<FromFormat, string> = {
  epoch_s:  "1700000000",
  epoch_ms: "1700000000000",
  iso:      "2024-01-15T10:30:00Z",
  utc:      "Tue, 14 Nov 2023 22:13:20 GMT",
  local:    "2024-01-15",
};

function toDate(value: string, from: FromFormat): Date | null {
  const v = value.trim();
  if (!v) return null;
  if (from === "epoch_s") {
    const n = Number(v);
    return isNaN(n) ? null : new Date(n * 1000);
  }
  if (from === "epoch_ms") {
    const n = Number(v);
    return isNaN(n) ? null : new Date(n);
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function relativeTime(ms: number, t: TFunc): string {
  const diff = Math.round((ms - Date.now()) / 1000);
  const abs = Math.abs(diff);
  const past = diff < 0;
  if (abs < 60)    return past ? t("secondsAgo", { n: abs })                : t("inSeconds",  { n: abs });
  if (abs < 3600)  return past ? t("minutesAgo", { n: Math.floor(abs / 60) })   : t("inMinutes",  { n: Math.floor(abs / 60) });
  if (abs < 86400) return past ? t("hoursAgo",   { n: Math.floor(abs / 3600) })  : t("inHours",    { n: Math.floor(abs / 3600) });
  return                  past ? t("daysAgo",    { n: Math.floor(abs / 86400) }) : t("inDays",     { n: Math.floor(abs / 86400) });
}

function formatDate(date: Date, to: ToFormat, t: TFunc): string {
  const ms = date.getTime();
  switch (to) {
    case "epoch_s":  return String(Math.floor(ms / 1000));
    case "epoch_ms": return String(ms);
    case "iso":      return date.toISOString();
    case "utc":      return date.toUTCString();
    case "local":    return date.toLocaleString();
    case "relative": return relativeTime(ms, t);
  }
}

const FORMAT_KEY: Record<ToFormat, string> = {
  epoch_s:  "unixSeconds",
  epoch_ms: "unixMillis",
  iso:      "iso8601",
  utc:      "utc",
  local:    "localTime",
  relative: "relative",
};

export default function TimestampClient() {
  const t = useTranslations("timestampConverter");
  const [from, setFrom] = useState<FromFormat>("epoch_s");
  const [to, setTo] = useState<ToFormat>("iso");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  const date = toDate(input, from);
  const result = date ? formatDate(date, to, t) : null;
  const hasError = input.trim() !== "" && !date;

  const handleNow = () => {
    setFrom("epoch_s");
    setInput(String(Math.floor(Date.now() / 1000)));
  };

  const handleFromChange = (f: FromFormat) => {
    setFrom(f);
    setInput("");
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Live ticker */}
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

      {/* De / Para */}
      <div
        className="rounded-xl p-5 flex flex-col gap-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* De */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("from")}</label>
            <select
              value={from}
              onChange={(e) => handleFromChange(e.target.value as FromFormat)}
              className="rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {FROM_FORMATS.map((f) => (
                <option key={f} value={f}>{t(FORMAT_KEY[f])}</option>
              ))}
            </select>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDERS[from]}
              className="rounded-lg px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              style={{
                background: "var(--surface-2)",
                border: `1px solid ${hasError ? "var(--error)" : "var(--border)"}`,
                color: "var(--text)",
              }}
              spellCheck={false}
            />
            {hasError && (
              <p className="text-xs" style={{ color: "var(--error)" }}>{t("inputError")}</p>
            )}
          </div>

          {/* Para */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("to")}</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value as ToFormat)}
              className="rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {TO_FORMATS.map((f) => (
                <option key={f} value={f}>{t(FORMAT_KEY[f])}</option>
              ))}
            </select>
            <div
              className="rounded-lg px-4 py-3 font-mono text-sm font-bold flex items-center justify-between gap-3"
              style={{
                background: "var(--surface-2)",
                border: `1px solid ${result ? "var(--success)" : "var(--border)"}`,
                color: result ? "var(--success)" : "var(--text-muted)",
                minHeight: "46px",
              }}
            >
              <span className="truncate">{result ?? "—"}</span>
              {result && (
                <button
                  onClick={handleCopy}
                  className="text-xs px-2 py-1 rounded shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                >
                  {copied ? t("copied") : t("copy")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

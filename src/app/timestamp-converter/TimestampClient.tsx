"use client";

import { useState, useEffect, useCallback } from "react";

function toMs(value: string): number | null {
  const n = Number(value.trim());
  if (isNaN(n)) return null;
  // heuristic: timestamps before year 3000 in seconds have 10 digits
  return n < 1e12 ? n * 1000 : n;
}

function relativeTime(ms: number): string {
  const diff = Math.round((ms - Date.now()) / 1000);
  const abs = Math.abs(diff);
  const past = diff < 0;
  if (abs < 60) return past ? `${abs} seconds ago` : `in ${abs} seconds`;
  if (abs < 3600) return past ? `${Math.floor(abs / 60)} minutes ago` : `in ${Math.floor(abs / 60)} minutes`;
  if (abs < 86400) return past ? `${Math.floor(abs / 3600)} hours ago` : `in ${Math.floor(abs / 3600)} hours`;
  return past ? `${Math.floor(abs / 86400)} days ago` : `in ${Math.floor(abs / 86400)} days`;
}

interface ResultRowProps {
  label: string;
  value: string;
}

function ResultRow({ label, value }: ResultRowProps) {
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
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default function TimestampClient() {
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
      // try parsing as a date string
      const parsed = new Date(raw);
      if (isNaN(parsed.getTime())) {
        setError("Invalid timestamp or date. Enter a Unix timestamp (e.g. 1700000000) or a date (e.g. 2024-01-15).");
        setResults(null);
        return;
      }
      setError("");
      const ts = parsed.getTime();
      setResults([
        { label: "Unix Timestamp (seconds)", value: String(Math.floor(ts / 1000)) },
        { label: "Unix Timestamp (milliseconds)", value: String(ts) },
        { label: "ISO 8601", value: parsed.toISOString() },
        { label: "UTC", value: parsed.toUTCString() },
        { label: "Local Time", value: parsed.toLocaleString() },
        { label: "Relative", value: relativeTime(ts) },
      ]);
      return;
    }

    const date = new Date(ms);
    setError("");
    setResults([
      { label: "ISO 8601", value: date.toISOString() },
      { label: "UTC", value: date.toUTCString() },
      { label: "Local Time", value: date.toLocaleString() },
      { label: "Date only", value: date.toLocaleDateString() },
      { label: "Time only", value: date.toLocaleTimeString() },
      { label: "Relative", value: relativeTime(ms) },
    ]);
  }, []);

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
          <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Current Unix Timestamp</p>
          <p className="font-mono text-xl font-bold" style={{ color: "var(--accent-hover)" }}>{now}</p>
        </div>
        <button
          onClick={handleNow}
          className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Use Now
        </button>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          Timestamp or Date
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
            Clear
          </button>
        </div>
        {error && <p className="text-xs" style={{ color: "var(--error)" }}>{error}</p>}
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Accepts Unix timestamps (seconds or milliseconds) or date strings (ISO 8601, YYYY-MM-DD, etc.)
        </p>
      </div>

      {/* Results */}
      {results && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Results</p>
          {results.map((r) => (
            <ResultRow key={r.label} label={r.label} value={r.value} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function CopyBtn({ text, copyLabel, copiedLabel }: { text: string; copyLabel: string; copiedLabel: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}
      className="text-xs px-2 py-0.5 rounded cursor-pointer hover:opacity-80"
      style={{ background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
      {c ? copiedLabel : copyLabel}
    </button>
  );
}

export default function ColorClient() {
  const t = useTranslations("colorConverter");
  const [hex, setHex] = useState("#6366f1");
  const [error, setError] = useState("");

  const rgb = hexToRgb(hex) ?? [99, 102, 241];
  const hsl = rgbToHsl(...rgb);

  const handleHex = (v: string) => {
    setHex(v);
    setError(hexToRgb(v) ? "" : t("invalidHex"));
  };

  const handleRgb = useCallback((r: string, g: string, b: string) => {
    const rv = Number(r), gv = Number(g), bv = Number(b);
    if ([rv, gv, bv].some((n) => isNaN(n) || n < 0 || n > 255)) { setError(t("invalidRgb")); return; }
    setHex(rgbToHex(rv, gv, bv));
    setError("");
  }, [t]);

  const handleHsl = useCallback((h: string, s: string, l: string) => {
    const hv = Number(h), sv = Number(s), lv = Number(l);
    if (isNaN(hv) || isNaN(sv) || isNaN(lv)) { setError(t("invalidHsl")); return; }
    const [r, g, b] = hslToRgb(hv, sv, lv);
    setHex(rgbToHex(r, g, b));
    setError("");
  }, [t]);

  const hexStr = hex;
  const rgbStr = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  const hslStr = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl overflow-hidden h-28 w-full transition-colors" style={{ background: hex, border: "1px solid var(--border)" }} />

      <div className="flex flex-col gap-4">
        {/* HEX */}
        <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>HEX</span>
            <CopyBtn text={hexStr} copyLabel={t("copy")} copiedLabel={t("copied")} />
          </div>
          <div className="flex items-center gap-3">
            <input type="color" value={hex} onChange={(e) => handleHex(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent" />
            <input type="text" value={hex} onChange={(e) => handleHex(e.target.value)}
              className="flex-1 font-mono text-lg font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </div>
        </div>

        {/* RGB */}
        <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>RGB</span>
            <CopyBtn text={rgbStr} copyLabel={t("copy")} copiedLabel={t("copied")} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["R", "G", "B"].map((ch, i) => (
              <div key={ch} className="flex flex-col gap-1">
                <label className="text-xs" style={{ color: "var(--text-muted)" }}>{ch}</label>
                <input type="number" min={0} max={255} value={rgb[i]}
                  onChange={(e) => { const v = [...rgb] as [number, number, number]; v[i] = Number(e.target.value); handleRgb(String(v[0]), String(v[1]), String(v[2])); }}
                  className="font-mono text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }} />
              </div>
            ))}
          </div>
        </div>

        {/* HSL */}
        <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>HSL</span>
            <CopyBtn text={hslStr} copyLabel={t("copy")} copiedLabel={t("copied")} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[["H", "0–360"], ["S", "0–100"], ["L", "0–100"]].map(([ch, range], i) => (
              <div key={ch} className="flex flex-col gap-1">
                <label className="text-xs" style={{ color: "var(--text-muted)" }}>{ch} <span style={{ color: "var(--text-muted)", fontSize: 10 }}>({range})</span></label>
                <input type="number" value={hsl[i]}
                  onChange={(e) => { const v = [...hsl] as [number, number, number]; v[i] = Number(e.target.value); handleHsl(String(v[0]), String(v[1]), String(v[2])); }}
                  className="font-mono text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {error && <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}

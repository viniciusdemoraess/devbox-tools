"use client";

import { useState } from "react";

type Category = "length" | "weight" | "temperature" | "volume";

interface Unit { label: string; toBase: (v: number) => number; fromBase: (v: number) => number; }

const UNITS: Record<Category, Unit[]> = {
  length: [
    { label: "Meter (m)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Kilometer (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Centimeter (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: "Millimeter (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Mile (mi)", toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
    { label: "Yard (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { label: "Foot (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { label: "Inch (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { label: "Kilogram (kg)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Gram (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Milligram (mg)", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { label: "Pound (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { label: "Ounce (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { label: "Ton (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  ],
  temperature: [
    { label: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Fahrenheit (°F)", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { label: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  volume: [
    { label: "Liter (L)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Milliliter (mL)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Cubic meter (m³)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Gallon (US)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { label: "Fluid ounce (fl oz)", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    { label: "Cup (US)", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    { label: "Tablespoon (tbsp)", toBase: (v) => v * 0.0147868, fromBase: (v) => v / 0.0147868 },
    { label: "Teaspoon (tsp)", toBase: (v) => v * 0.00492892, fromBase: (v) => v / 0.00492892 },
  ],
};

const CATEGORY_LABELS: { id: Category; label: string }[] = [
  { id: "length", label: "Length" },
  { id: "weight", label: "Weight" },
  { id: "temperature", label: "Temperature" },
  { id: "volume", label: "Volume" },
];

export default function UnitClient() {
  const [category, setCategory] = useState<Category>("length");
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(2);
  const [value, setValue] = useState("");

  const units = UNITS[category];
  const result = (() => {
    const v = parseFloat(value);
    if (isNaN(v)) return "";
    const base = units[fromIdx].toBase(v);
    const out = units[toIdx].fromBase(base);
    return parseFloat(out.toPrecision(8)).toString();
  })();

  const handleCategory = (cat: Category) => { setCategory(cat); setFromIdx(0); setToIdx(1); setValue(""); };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORY_LABELS.map((c) => (
          <button key={c.id} onClick={() => handleCategory(c.id)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all"
            style={{ background: category === c.id ? "var(--accent)" : "var(--surface)", color: category === c.id ? "#fff" : "var(--text)", border: `1px solid ${category === c.id ? "var(--accent)" : "var(--border)"}` }}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5 flex flex-col gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>From</label>
            <select value={fromIdx} onChange={(e) => setFromIdx(Number(e.target.value))}
              className="rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}>
              {units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value"
              className="rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>To</label>
            <select value={toIdx} onChange={(e) => setToIdx(Number(e.target.value))}
              className="rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}>
              {units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
            <div className="rounded-lg px-4 py-3 text-sm font-mono font-bold" style={{ background: "var(--surface-2)", border: `1px solid ${result ? "var(--success)" : "var(--border)"}`, color: result ? "var(--success)" : "var(--text-muted)", minHeight: "46px" }}>
              {result || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

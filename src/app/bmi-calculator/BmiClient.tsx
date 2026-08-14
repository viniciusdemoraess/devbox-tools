"use client";

import { useState } from "react";

const categories = [
  { max: 18.5, label: "Underweight", color: "#60a5fa" },
  { max: 25, label: "Normal weight", color: "var(--success)" },
  { max: 30, label: "Overweight", color: "#f59e0b" },
  { max: Infinity, label: "Obese", color: "var(--error)" },
];

function getCategory(bmi: number) {
  return categories.find((c) => bmi < c.max)!;
}

export default function BmiClient() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  let bmi: number | null = null;
  if (unit === "metric") {
    const w = parseFloat(weight), h = parseFloat(height) / 100;
    if (w > 0 && h > 0) bmi = w / (h * h);
  } else {
    const w = parseFloat(weight) * 0.453592;
    const h = ((parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)) * 0.0254;
    if (w > 0 && h > 0) bmi = w / (h * h);
  }

  const cat = bmi ? getCategory(bmi) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex rounded-xl p-1 gap-1 w-fit" style={{ background: "var(--surface)" }}>
        {(["metric", "imperial"] as const).map((u) => (
          <button key={u} onClick={() => setUnit(u)}
            className="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all capitalize"
            style={{ background: unit === u ? "var(--accent)" : "transparent", color: unit === u ? "#fff" : "var(--text-muted)" }}>
            {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/ft)"}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5 flex flex-col gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            Weight ({unit === "metric" ? "kg" : "lb"})
          </label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "metric" ? "70" : "154"}
            className="rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }} />
        </div>

        {unit === "metric" ? (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175"
              className="rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Feet</label>
              <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="5"
                className="rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Inches</label>
              <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="9"
                className="rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
          </div>
        )}
      </div>

      {bmi && cat && (
        <div className="rounded-xl p-6 flex flex-col gap-4" style={{ background: "var(--surface)", border: `1px solid ${cat.color}` }}>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold" style={{ color: cat.color }}>{bmi.toFixed(1)}</span>
            <span className="text-lg font-semibold mb-1" style={{ color: cat.color }}>{cat.label}</span>
          </div>
          <div className="flex flex-col gap-2">
            {categories.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: c.color }} />
                <span style={{ color: c === cat ? "var(--text)" : "var(--text-muted)" }}>
                  {c.label} — {i === 0 ? "< 18.5" : i === 1 ? "18.5 – 24.9" : i === 2 ? "25 – 29.9" : "≥ 30"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

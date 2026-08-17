"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Category = "length" | "weight" | "temperature" | "volume";
type UnitKey = string;

interface UnitDef {
  key: UnitKey;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const UNITS: Record<Category, UnitDef[]> = {
  length: [
    { key: "meter",      toBase: (v) => v,           fromBase: (v) => v },
    { key: "kilometer",  toBase: (v) => v * 1000,     fromBase: (v) => v / 1000 },
    { key: "centimeter", toBase: (v) => v / 100,      fromBase: (v) => v * 100 },
    { key: "millimeter", toBase: (v) => v / 1000,     fromBase: (v) => v * 1000 },
    { key: "mile",       toBase: (v) => v * 1609.34,  fromBase: (v) => v / 1609.34 },
    { key: "yard",       toBase: (v) => v * 0.9144,   fromBase: (v) => v / 0.9144 },
    { key: "foot",       toBase: (v) => v * 0.3048,   fromBase: (v) => v / 0.3048 },
    { key: "inch",       toBase: (v) => v * 0.0254,   fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { key: "kilogram",  toBase: (v) => v,          fromBase: (v) => v },
    { key: "gram",      toBase: (v) => v / 1000,    fromBase: (v) => v * 1000 },
    { key: "milligram", toBase: (v) => v / 1e6,     fromBase: (v) => v * 1e6 },
    { key: "pound",     toBase: (v) => v * 0.453592,  fromBase: (v) => v / 0.453592 },
    { key: "ounce",     toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { key: "ton",       toBase: (v) => v * 1000,    fromBase: (v) => v / 1000 },
  ],
  temperature: [
    { key: "celsius",    toBase: (v) => v,                  fromBase: (v) => v },
    { key: "fahrenheit", toBase: (v) => (v - 32) * 5 / 9,   fromBase: (v) => v * 9 / 5 + 32 },
    { key: "kelvin",     toBase: (v) => v - 273.15,          fromBase: (v) => v + 273.15 },
  ],
  volume: [
    { key: "liter",       toBase: (v) => v,           fromBase: (v) => v },
    { key: "milliliter",  toBase: (v) => v / 1000,    fromBase: (v) => v * 1000 },
    { key: "cubicMeter",  toBase: (v) => v * 1000,    fromBase: (v) => v / 1000 },
    { key: "gallon",      toBase: (v) => v * 3.78541,    fromBase: (v) => v / 3.78541 },
    { key: "fluidOunce",  toBase: (v) => v * 0.0295735,  fromBase: (v) => v / 0.0295735 },
    { key: "cup",         toBase: (v) => v * 0.236588,   fromBase: (v) => v / 0.236588 },
    { key: "tablespoon",  toBase: (v) => v * 0.0147868,  fromBase: (v) => v / 0.0147868 },
    { key: "teaspoon",    toBase: (v) => v * 0.00492892, fromBase: (v) => v / 0.00492892 },
  ],
};

const CATEGORIES: Category[] = ["length", "weight", "temperature", "volume"];

export default function UnitClient() {
  const t = useTranslations("unitConverter");
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

  const handleCategory = (cat: Category) => {
    setCategory(cat);
    setFromIdx(0);
    setToIdx(1);
    setValue("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all"
            style={{
              background: category === cat ? "var(--accent)" : "var(--surface)",
              color: category === cat ? "#fff" : "var(--text)",
              border: `1px solid ${category === cat ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {t(cat)}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5 flex flex-col gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("from")}</label>
            <select
              value={fromIdx}
              onChange={(e) => setFromIdx(Number(e.target.value))}
              className="rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {units.map((u, i) => (
                <option key={u.key} value={i}>{t(u.key)}</option>
              ))}
            </select>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("enterValue")}
              className="rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("to")}</label>
            <select
              value={toIdx}
              onChange={(e) => setToIdx(Number(e.target.value))}
              className="rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {units.map((u, i) => (
                <option key={u.key} value={i}>{t(u.key)}</option>
              ))}
            </select>
            <div
              className="rounded-lg px-4 py-3 text-sm font-mono font-bold"
              style={{
                background: "var(--surface-2)",
                border: `1px solid ${result ? "var(--success)" : "var(--border)"}`,
                color: result ? "var(--success)" : "var(--text-muted)",
                minHeight: "46px",
              }}
            >
              {result || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

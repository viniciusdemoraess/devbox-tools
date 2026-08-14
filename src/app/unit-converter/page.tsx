import type { Metadata } from "next";
import UnitClient from "./UnitClient";

export const metadata: Metadata = {
  title: "Unit Converter Online — Length, Weight, Temperature Free",
  description: "Convert between units of length, weight, temperature, and volume instantly. Free online unit converter tool.",
};

export default function UnitPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Unit Converter</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>Convert between common units of measurement instantly.</p>
      <UnitClient />
    </div>
  );
}

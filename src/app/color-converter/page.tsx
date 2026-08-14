import type { Metadata } from "next";
import ColorClient from "./ColorClient";

export const metadata: Metadata = {
  title: "Color Converter HEX to RGB to HSL Online — Free",
  description: "Convert colors between HEX, RGB, and HSL formats instantly. Pick a color or type any value to see all formats at once.",
};

export default function ColorPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Color Converter</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>Convert between HEX, RGB, and HSL color formats instantly.</p>
      <ColorClient />
    </div>
  );
}

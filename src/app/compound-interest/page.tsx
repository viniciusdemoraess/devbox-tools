import type { Metadata } from "next";
import CompoundClient from "./CompoundClient";

export const metadata: Metadata = {
  title: "Compound Interest Calculator Online — Free",
  description: "Calculate compound interest and investment growth over time. See year-by-year breakdown and total return. Free online calculator.",
};

export default function CompoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Compound Interest Calculator</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>Calculate how your investment grows over time with compound interest.</p>
      <CompoundClient />
    </div>
  );
}

import type { Metadata } from "next";
import BmiClient from "./BmiClient";

export const metadata: Metadata = {
  title: "IMC Calculator Online — BMI Free",
  description: "Calculate your BMI (Body Mass Index) online for free. Supports metric and imperial units. Instant result with classification.",
};

export default function BmiPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">IMC / BMI Calculator</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>Calculate your Body Mass Index (BMI) using metric or imperial units.</p>
      <BmiClient />
    </div>
  );
}

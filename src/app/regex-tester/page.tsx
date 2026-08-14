import type { Metadata } from "next";
import RegexClient from "./RegexClient";

export const metadata: Metadata = {
  title: "Regex Tester Online — Test Regular Expressions Free",
  description: "Test and debug regular expressions online. Highlights all matches in real time with match details. Free online regex tester.",
};

export default function RegexPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Regex Tester</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Test regular expressions in real time. Highlights all matches with details on groups and positions.
      </p>
      <RegexClient />
    </div>
  );
}

import type { Metadata } from "next";
import JsonFormatterClient from "./JsonFormatterClient";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator Online — Free",
  description:
    "Format, validate, and minify JSON online for free. Instant error detection with line numbers. No data is sent to any server.",
};

export default function JsonFormatterPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">JSON Formatter & Validator</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Paste your JSON to format, validate, or minify it instantly. Runs entirely in your browser.
      </p>
      <JsonFormatterClient />
      <section className="mt-12 prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-3">About JSON Formatter</h2>
        <p style={{ color: "var(--text-muted)" }}>
          JSON (JavaScript Object Notation) is a lightweight data-interchange format. This tool helps you{" "}
          <strong>format JSON</strong> with proper indentation, <strong>validate JSON</strong> syntax, and{" "}
          <strong>minify JSON</strong> to reduce file size. Common errors like missing commas, trailing commas, and
          mismatched brackets are caught immediately.
        </p>
      </section>
    </div>
  );
}

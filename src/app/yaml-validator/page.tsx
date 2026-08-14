import type { Metadata } from "next";
import YamlValidatorClient from "./YamlValidatorClient";

export const metadata: Metadata = {
  title: "YAML Validator & Formatter Online — Free",
  description:
    "Validate and format YAML online for free. Get clear error messages with line and column numbers. Runs entirely in your browser.",
};

export default function YamlValidatorPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">YAML Validator & Formatter</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Paste your YAML to validate syntax and get a formatted, readable version. Runs entirely in your browser.
      </p>
      <YamlValidatorClient />
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-3">About YAML Validator</h2>
        <p style={{ color: "var(--text-muted)" }}>
          YAML (YAML Ain&apos;t Markup Language) is commonly used for configuration files (Docker Compose,
          Kubernetes, GitHub Actions, etc). This tool validates your YAML syntax and reports errors with exact line and
          column numbers, making it easy to fix issues in CI/CD pipelines and config files.
        </p>
      </section>
    </div>
  );
}

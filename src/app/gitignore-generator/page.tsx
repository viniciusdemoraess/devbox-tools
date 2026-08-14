import type { Metadata } from "next";
import GitignoreClient from "./GitignoreClient";

export const metadata: Metadata = {
  title: ".gitignore Generator Online — Free",
  description:
    "Generate .gitignore files for any project stack instantly. Select languages, frameworks, and tools to get a ready-to-use .gitignore file.",
};

export default function GitignorePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">.gitignore Generator</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Select your languages, frameworks, and tools to generate a ready-to-use .gitignore file.
      </p>
      <GitignoreClient />
    </div>
  );
}

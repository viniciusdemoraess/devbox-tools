import type { Metadata } from "next";
import TextDiffClient from "./TextDiffClient";

export const metadata: Metadata = {
  title: "Text Diff Online — Compare Two Texts Free",
  description:
    "Compare two texts side by side and highlight the differences instantly. Free online diff tool for code, JSON, and plain text. No data sent to server.",
};

export default function TextDiffPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Text Diff</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Paste two texts to compare them and highlight additions, deletions, and changes line by line.
      </p>
      <TextDiffClient />
    </div>
  );
}

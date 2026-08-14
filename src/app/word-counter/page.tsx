import type { Metadata } from "next";
import WordCounterClient from "./WordCounterClient";

export const metadata: Metadata = {
  title: "Word Counter & Reading Time Online — Free",
  description: "Count words, characters, sentences, and paragraphs. Get estimated reading time instantly. Free online word counter tool.",
};

export default function WordCounterPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Word Counter</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>Paste your text to count words, characters, and get estimated reading time.</p>
      <WordCounterClient />
    </div>
  );
}

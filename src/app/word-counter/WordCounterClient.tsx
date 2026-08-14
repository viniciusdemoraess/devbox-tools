"use client";

import { useState } from "react";

function analyze(text: string) {
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.trim() === "" ? 0 : (text.match(/[^.!?]*[.!?]+/g) ?? []).length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const readingTime = Math.ceil(words / 200);
  return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime };
}

export default function WordCounterClient() {
  const [text, setText] = useState("");
  const stats = analyze(text);

  const statItems = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "Characters (no spaces)", value: stats.charsNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading Time", value: stats.readingTime === 0 ? "—" : `~${stats.readingTime} min` },
  ];

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="w-full h-64 rounded-lg p-4 text-sm resize-y outline-none focus:ring-2 focus:ring-indigo-500"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", minHeight: "200px" }}
        placeholder="Paste or type your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statItems.map((s) => (
          <div key={s.label} className="rounded-xl px-4 py-3 flex flex-col gap-1" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</span>
            <span className="text-2xl font-bold" style={{ color: "var(--accent-hover)" }}>{s.value}</span>
          </div>
        ))}
      </div>
      {text && (
        <button onClick={() => setText("")} className="w-fit px-5 py-2 rounded-lg text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
          style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
          Clear
        </button>
      )}
    </div>
  );
}

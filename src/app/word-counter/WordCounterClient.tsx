"use client";

import { useState, useDeferredValue } from "react";
import { useTranslations } from "next-intl";

const WPM = 238;

function analyze(text: string) {
  if (text.trim() === "") {
    return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingMins: 0 };
  }
  const words = text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[^.!?]*[.!?]+/g) ?? []).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const readingMins = words / WPM;
  return { words, chars, charsNoSpaces, sentences, paragraphs, readingMins };
}

export default function WordCounterClient() {
  const t = useTranslations("wordCounter");
  const [text, setText] = useState("");

  // useDeferredValue keeps the textarea responsive even for large pastes —
  // React defers the expensive analyze() call while the input updates immediately.
  const deferredText = useDeferredValue(text);
  const isStale = text !== deferredText;
  const stats = analyze(deferredText);

  function readingTimeLabel(): string {
    if (stats.readingMins === 0) return "—";
    if (stats.readingMins < 1) return t("readingTimeLessMin");
    return t("readingTimeValue", { min: Math.ceil(stats.readingMins) });
  }

  const statItems = [
    { key: "words",         value: stats.words },
    { key: "characters",    value: stats.chars },
    { key: "charsNoSpaces", value: stats.charsNoSpaces },
    { key: "sentences",     value: stats.sentences },
    { key: "paragraphs",    value: stats.paragraphs },
    { key: "readingTime",   value: readingTimeLabel() },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="w-full h-64 rounded-lg p-4 text-sm resize-y outline-none focus:ring-2 focus:ring-indigo-500"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", minHeight: "200px" }}
        placeholder={t("placeholder")}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 transition-opacity duration-150"
        style={{ opacity: isStale ? 0.5 : 1 }}
      >
        {statItems.map((s) => (
          <div key={s.key} className="rounded-xl px-4 py-3 flex flex-col gap-1" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t(s.key)}</span>
            <span className="text-2xl font-bold" style={{ color: "var(--accent-hover)" }}>{s.value}</span>
          </div>
        ))}
      </div>
      {text && (
        <button
          onClick={() => setText("")}
          className="w-fit px-5 py-2 rounded-lg text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
          style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
        >
          {t("clearBtn")}
        </button>
      )}
    </div>
  );
}

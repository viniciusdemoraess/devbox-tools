"use client";

import { useState, useCallback } from "react";
import { diffLines, Change } from "diff";

function DiffView({ changes }: { changes: Change[] }) {
  let oldLine = 1;
  let newLine = 1;

  return (
    <div className="rounded-lg overflow-hidden font-mono text-sm" style={{ border: "1px solid var(--border)" }}>
      <div className="grid grid-cols-[40px_40px_1fr] overflow-x-auto">
        {changes.map((change, i) => {
          const lines = change.value.replace(/\n$/, "").split("\n");
          return lines.map((line, j) => {
            let bg = "transparent";
            let color = "var(--text)";
            let prefix = " ";
            let ol: number | string = "";
            let nl: number | string = "";

            if (change.added) {
              bg = "#14532d40";
              color = "#86efac";
              prefix = "+";
              nl = newLine++;
            } else if (change.removed) {
              bg = "#450a0a40";
              color = "#fca5a5";
              prefix = "−";
              ol = oldLine++;
            } else {
              ol = oldLine++;
              nl = newLine++;
            }

            return (
              <div key={`${i}-${j}`} className="contents">
                <span
                  className="px-2 py-0.5 text-right select-none"
                  style={{ background: bg, color: "var(--text-muted)", borderRight: "1px solid var(--border)" }}
                >
                  {ol}
                </span>
                <span
                  className="px-2 py-0.5 text-right select-none"
                  style={{ background: bg, color: "var(--text-muted)", borderRight: "1px solid var(--border)" }}
                >
                  {nl}
                </span>
                <span className="px-3 py-0.5 whitespace-pre" style={{ background: bg, color }}>
                  {prefix} {line}
                </span>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}

export default function TextDiffClient() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [changes, setChanges] = useState<Change[] | null>(null);
  const [stats, setStats] = useState({ added: 0, removed: 0 });

  const handleCompare = useCallback(() => {
    const result = diffLines(left, right);
    setChanges(result);
    setStats({
      added: result.filter((c) => c.added).reduce((a, c) => a + c.count!, 0),
      removed: result.filter((c) => c.removed).reduce((a, c) => a + c.count!, 0),
    });
  }, [left, right]);

  const handleClear = useCallback(() => {
    setLeft("");
    setRight("");
    setChanges(null);
    setStats({ added: 0, removed: 0 });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Original</label>
          <textarea
            className="w-full h-64 rounded-lg p-3 font-mono text-sm resize-y outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", minHeight: "200px" }}
            placeholder="Paste original text here..."
            value={left}
            onChange={(e) => { setLeft(e.target.value); setChanges(null); }}
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Modified</label>
          <textarea
            className="w-full h-64 rounded-lg p-3 font-mono text-sm resize-y outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", minHeight: "200px" }}
            placeholder="Paste modified text here..."
            value={right}
            onChange={(e) => { setRight(e.target.value); setChanges(null); }}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleCompare}
          className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Compare
        </button>
        <button
          onClick={handleClear}
          className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity"
          style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          Clear
        </button>
        {changes && (
          <div className="flex gap-3 text-sm ml-2">
            <span className="px-2 py-0.5 rounded" style={{ background: "#14532d40", color: "#86efac" }}>
              +{stats.added} added
            </span>
            <span className="px-2 py-0.5 rounded" style={{ background: "#450a0a40", color: "#fca5a5" }}>
              −{stats.removed} removed
            </span>
          </div>
        )}
      </div>

      {changes && <DiffView changes={changes} />}
    </div>
  );
}

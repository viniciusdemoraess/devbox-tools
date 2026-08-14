"use client";

import { useState, useCallback } from "react";

type Mode = "json" | "yaml";
type Status = "idle" | "valid" | "error";

interface FormatResult {
  output: string;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
}

interface FormatterToolProps {
  mode: Mode;
  format: (input: string) => FormatResult;
  minify?: (input: string) => string;
  placeholder: string;
  example: string;
}

export default function FormatterTool({ mode, format, minify, placeholder, example }: FormatterToolProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [errorLine, setErrorLine] = useState<number | undefined>();
  const [errorColumn, setErrorColumn] = useState<number | undefined>();
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  const resetError = () => {
    setError("");
    setErrorLine(undefined);
    setErrorColumn(undefined);
  };

  const handleFormat = useCallback(() => {
    if (!input.trim()) return;
    const result = format(input);
    if (result.error) {
      setError(result.error);
      setErrorLine(result.errorLine);
      setErrorColumn(result.errorColumn);
      setOutput("");
      setStatus("error");
    } else {
      setOutput(result.output);
      resetError();
      setStatus("valid");
    }
  }, [input, format]);

  const handleMinify = useCallback(() => {
    if (!input.trim() || !minify) return;
    try {
      setOutput(minify(input));
      resetError();
      setStatus("valid");
    } catch (e) {
      setError(String(e));
      setStatus("error");
    }
  }, [input, minify]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    resetError();
    setStatus("idle");
  }, []);

  const handleExample = useCallback(() => {
    setInput(example);
    setOutput("");
    resetError();
    setStatus("idle");
  }, [example]);

  const outputBorder =
    status === "valid" ? "var(--success)" : status === "error" ? "var(--error)" : "var(--border)";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            Input
          </label>
          <textarea
            className="w-full h-[520px] rounded-lg p-3 font-mono text-sm resize-y outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", minHeight: "320px" }}
            placeholder={placeholder}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setStatus("idle");
              setOutput("");
              resetError();
            }}
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between min-h-[24px]">
            <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              Output
            </label>
            {status === "valid" && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Valid
              </span>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2">
                {errorLine && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                    Line {errorLine}{errorColumn ? `:${errorColumn}` : ""}
                  </span>
                )}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                  Invalid
                </span>
              </div>
            )}
          </div>
          <textarea
            className="w-full h-[520px] rounded-lg p-3 font-mono text-sm resize-y outline-none transition-colors"
            style={{
              background: "var(--surface-2)",
              border: `1px solid ${outputBorder}`,
              color: status === "error" ? "var(--error)" : "var(--text)",
              minHeight: "320px",
            }}
            readOnly
            value={status === "error" ? error : output}
            placeholder="Output will appear here..."
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleFormat}
          className="btn-press px-5 py-2 rounded-lg font-medium text-sm cursor-pointer"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Format / Validate
        </button>
        {minify && (
          <button
            onClick={handleMinify}
            className="btn-press px-5 py-2 rounded-lg font-medium text-sm cursor-pointer"
            style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
          >
            Minify
          </button>
        )}
        <button
          onClick={handleCopy}
          className="btn-press px-5 py-2 rounded-lg font-medium text-sm"
          style={{
            background: "var(--surface-2)",
            color: output ? "var(--text)" : "var(--text-muted)",
            border: "1px solid var(--border)",
            cursor: output ? "pointer" : "default",
            opacity: output ? 1 : 0.4,
          }}
          disabled={!output}
        >
          {copied ? "Copied!" : "Copy Output"}
        </button>
        <button
          onClick={handleExample}
          className="btn-press px-5 py-2 rounded-lg font-medium text-sm cursor-pointer"
          style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          Load Example
        </button>
        <button
          onClick={handleClear}
          className="btn-press px-5 py-2 rounded-lg font-medium text-sm cursor-pointer"
          style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

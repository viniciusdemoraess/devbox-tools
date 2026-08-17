"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  generateCpf,
  formatCpf,
  generateNumericCnpj,
  generateAlphanumericCnpj,
  formatCnpj,
  validateCpf,
  validateCnpjFull,
} from "@/lib/cpf-cnpj";

type DocType = "all" | "cpf" | "cnpj_numeric" | "cnpj_alpha";
type Tab = "generate" | "validate";

interface GeneratedDoc {
  label: string;
  formatted: string;
  raw: string;
  isAlpha?: boolean;
}

function ResultCard({ label, formatted, raw, isAlpha, copyText, copyRawText, copiedText }: {
  label: string;
  formatted: string;
  raw: string;
  isAlpha?: boolean;
  copyText: string;
  copyRawText: string;
  copiedText: string;
}) {
  const [copiedFormatted, setCopiedFormatted] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  const copyFormatted = () => {
    navigator.clipboard.writeText(formatted);
    setCopiedFormatted(true);
    setTimeout(() => setCopiedFormatted(false), 2000);
  };

  const copyRaw = () => {
    navigator.clipboard.writeText(raw);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div
      className="rounded-xl px-5 py-4 flex items-center justify-between gap-4"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
          {isAlpha && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              NEW
            </span>
          )}
        </div>
        <span className="font-mono text-lg font-semibold tracking-wider truncate" style={{ color: "var(--text)" }}>
          {formatted}
        </span>
        <button
          onClick={copyRaw}
          className="text-xs text-left cursor-pointer hover:underline w-fit"
          style={{ color: "var(--text-muted)" }}
        >
          {copiedRaw ? copiedText : `${raw} — ${copyRawText}`}
        </button>
      </div>
      <button
        onClick={copyFormatted}
        className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer btn-press shrink-0"
        style={{ background: copiedFormatted ? "var(--success)" : "var(--accent)", color: "#fff" }}
      >
        {copiedFormatted ? copiedText : copyText}
      </button>
    </div>
  );
}

const QUANTITIES = [1, 5, 10];

export default function CpfCnpjClient() {
  const t = useTranslations("cpfCnpj");
  const tc = useTranslations("common");

  const [tab, setTab] = useState<Tab>("generate");
  const [qty, setQty] = useState(1);
  const [docType, setDocType] = useState<DocType>("all");
  const [results, setResults] = useState<GeneratedDoc[]>([]);
  const [validateInput, setValidateInput] = useState("");
  const [validateResult, setValidateResult] = useState<{
    valid: boolean;
    typeLabel: string;
  } | null>(null);

  const handleGenerate = useCallback(() => {
    const items: GeneratedDoc[] = [];
    for (let i = 0; i < qty; i++) {
      if (docType === "all" || docType === "cpf") {
        const raw = generateCpf();
        items.push({ label: t("cpf"), formatted: formatCpf(raw), raw });
      }
      if (docType === "all" || docType === "cnpj_numeric") {
        const raw = generateNumericCnpj();
        items.push({ label: t("cnpjNumeric"), formatted: formatCnpj(raw), raw });
      }
      if (docType === "all" || docType === "cnpj_alpha") {
        const raw = generateAlphanumericCnpj();
        items.push({ label: t("cnpjAlpha"), formatted: formatCnpj(raw), raw, isAlpha: true });
      }
    }
    setResults(items);
  }, [qty, docType, t]);

  const handleValidate = useCallback(() => {
    const clean = validateInput.replace(/[.\-/\s]/g, "").toUpperCase();
    if (clean.length === 11) {
      const valid = validateCpf(clean);
      setValidateResult({ valid, typeLabel: t("cpf") });
    } else if (clean.length === 14) {
      const result = validateCnpjFull(clean);
      const typeLabel = result.type === "alphanumeric" ? t("cnpjAlpha") : t("cnpjNumeric");
      setValidateResult({ valid: result.valid, typeLabel });
    } else {
      setValidateResult(null);
    }
  }, [validateInput, t]);

  const exportJson = () => {
    const data = results.map((r) => ({ type: r.label, formatted: r.formatted, raw: r.raw }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "documents.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const rows = ["type,formatted,raw", ...results.map((r) => `${r.label},${r.formatted},${r.raw}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "documents.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const DOC_TYPES: { value: DocType; label: string }[] = [
    { value: "all", label: t("allTypes") },
    { value: "cpf", label: t("cpf") },
    { value: "cnpj_numeric", label: t("cnpjNumeric") },
    { value: "cnpj_alpha", label: t("cnpjAlpha") },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex rounded-xl p-1 gap-1 w-fit" style={{ background: "var(--surface)" }}>
        {(["generate", "validate"] as Tab[]).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className="px-6 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all"
            style={{
              background: tab === tabKey ? "var(--accent)" : "transparent",
              color: tab === tabKey ? "#fff" : "var(--text-muted)",
            }}
          >
            {tabKey === "generate" ? t("generateTab") : t("validateTab")}
          </button>
        ))}
      </div>

      {/* Generate Tab */}
      {tab === "generate" && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-4">
            {/* Document type selector */}
            <div className="flex flex-col gap-1">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t("typeLabel")}</span>
              <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                {DOC_TYPES.map((dt, idx) => (
                  <button
                    key={dt.value}
                    onClick={() => setDocType(dt.value)}
                    className="px-4 py-2 text-xs font-medium cursor-pointer transition-colors whitespace-nowrap"
                    style={{
                      background: docType === dt.value ? "var(--accent)" : "var(--surface)",
                      color: docType === dt.value ? "#fff" : "var(--text-muted)",
                      borderRight: idx < DOC_TYPES.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    {dt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="flex flex-col gap-1">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t("quantity")}</span>
              <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                {QUANTITIES.map((q, idx) => (
                  <button
                    key={q}
                    onClick={() => setQty(q)}
                    className="px-5 py-2 text-sm font-medium cursor-pointer transition-colors"
                    style={{
                      background: qty === q ? "var(--accent)" : "var(--surface)",
                      color: qty === q ? "#fff" : "var(--text-muted)",
                      borderRight: idx < QUANTITIES.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="px-6 py-2 rounded-lg font-medium text-sm cursor-pointer btn-press self-end"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {t("generateButton")}
            </button>
          </div>

          {results.length > 0 && (
            <>
              <div className="flex flex-col gap-3">
                {results.map((r, i) => (
                  <ResultCard
                    key={i}
                    label={r.label}
                    formatted={r.formatted}
                    raw={r.raw}
                    isAlpha={r.isAlpha}
                    copyText={t("copyFormatted")}
                    copyRawText={t("copyWithoutMask")}
                    copiedText={tc("copied")}
                  />
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={exportJson}
                  className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer btn-press"
                  style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  {t("exportJson")}
                </button>
                <button
                  onClick={exportCsv}
                  className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer btn-press"
                  style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  {t("exportCsv")}
                </button>
              </div>
            </>
          )}

          {results.length === 0 && (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("noResultsHint")}</p>
          )}
        </div>
      )}

      {/* Validate Tab */}
      {tab === "validate" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("pasteHint")}</p>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg px-4 py-3 font-mono text-base outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="000.000.000-00 ou 00.000.000/0001-00"
              value={validateInput}
              onChange={(e) => { setValidateInput(e.target.value); setValidateResult(null); }}
              spellCheck={false}
            />
            <button
              onClick={handleValidate}
              className="px-5 py-3 rounded-lg font-medium text-sm cursor-pointer btn-press"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {tc("validate")}
            </button>
          </div>

          {validateResult && (
            <div
              className="flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-semibold"
              style={{
                background: validateResult.valid ? "var(--success-bg)" : "var(--error-bg)",
                border: `1px solid ${validateResult.valid ? "var(--success)" : "var(--error)"}`,
                color: validateResult.valid ? "var(--success)" : "var(--error)",
              }}
            >
              <span className="text-lg">{validateResult.valid ? "✓" : "✕"}</span>
              <span>
                {validateResult.typeLabel}{" "}
                {validateResult.valid ? t("validResult") : t("invalidResult")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

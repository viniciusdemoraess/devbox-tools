"use client";

import { useState, useCallback } from "react";

// --- CPF ---
function calcCpfDigit(digits: number[], weight: number): number {
  const sum = digits.reduce((acc, d) => acc + d * weight--, 0);
  const rem = sum % 11;
  return rem < 2 ? 0 : 11 - rem;
}

function generateCpf(): string {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const d1 = calcCpfDigit(digits, 10);
  const d2 = calcCpfDigit([...digits, d1], 11);
  return [...digits, d1, d2].join("");
}

function formatCpf(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function validateCpf(raw: string): boolean {
  const cpf = raw.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digits = cpf.split("").map(Number);
  const d1 = calcCpfDigit(digits.slice(0, 9), 10);
  const d2 = calcCpfDigit(digits.slice(0, 10), 11);
  return digits[9] === d1 && digits[10] === d2;
}

// --- CNPJ ---
function calcCnpjDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
  const rem = sum % 11;
  return rem < 2 ? 0 : 11 - rem;
}

function generateCnpj(): string {
  const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  digits[8] = 0; digits[9] = 0; digits[10] = 0; digits[11] = 1;
  const d1 = calcCnpjDigit(digits, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calcCnpjDigit([...digits, d1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return [...digits, d1, d2].join("");
}

function formatCnpj(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

function validateCnpj(raw: string): boolean {
  const cnpj = raw.replace(/\D/g, "");
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  const digits = cnpj.split("").map(Number);
  const d1 = calcCnpjDigit(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calcCnpjDigit(digits.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return digits[12] === d1 && digits[13] === d2;
}

// --- Result Card ---
function ResultCard({ label, formatted, raw }: { label: string; formatted: string; raw: string }) {
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
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
        <span className="font-mono text-lg font-semibold tracking-wider" style={{ color: "var(--text)" }}>
          {formatted}
        </span>
        <button
          onClick={copyRaw}
          className="text-xs text-left cursor-pointer hover:underline w-fit"
          style={{ color: "var(--text-muted)" }}
        >
          {copiedRaw ? "Copiado!" : `${raw} — copiar sem máscara`}
        </button>
      </div>
      <button
        onClick={copyFormatted}
        className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity shrink-0"
        style={{ background: copiedFormatted ? "#14532d" : "var(--accent)", color: "#fff" }}
      >
        {copiedFormatted ? "Copiado!" : "Copiar"}
      </button>
    </div>
  );
}

const QUANTITIES = [1, 5, 10];

type Tab = "gerar" | "validar";

export default function CpfCnpjClient() {
  const [tab, setTab] = useState<Tab>("gerar");
  const [qty, setQty] = useState(1);
  const [results, setResults] = useState<{ label: string; formatted: string; raw: string }[]>([]);
  const [validateInput, setValidateInput] = useState("");
  const [validateResult, setValidateResult] = useState<{ valid: boolean; type: string } | null>(null);

  const handleGenerate = useCallback(() => {
    const items = [];
    for (let i = 0; i < qty; i++) {
      const cpfRaw = generateCpf();
      items.push({ label: "CPF", formatted: formatCpf(cpfRaw), raw: cpfRaw });
      const cnpjRaw = generateCnpj();
      items.push({ label: "CNPJ", formatted: formatCnpj(cnpjRaw), raw: cnpjRaw });
    }
    setResults(items);
  }, [qty]);

  const handleValidate = useCallback(() => {
    const clean = validateInput.replace(/\D/g, "");
    if (clean.length === 11) {
      setValidateResult({ valid: validateCpf(clean), type: "CPF" });
    } else if (clean.length === 14) {
      setValidateResult({ valid: validateCnpj(clean), type: "CNPJ" });
    } else {
      setValidateResult(null);
    }
  }, [validateInput]);

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex rounded-xl p-1 gap-1 w-fit" style={{ background: "var(--surface)" }}>
        {(["gerar", "validar"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-6 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all capitalize"
            style={{
              background: tab === t ? "var(--accent)" : "transparent",
              color: tab === t ? "#fff" : "var(--text-muted)",
            }}
          >
            {t === "gerar" ? "Gerar" : "Validar"}
          </button>
        ))}
      </div>

      {/* Gerar */}
      {tab === "gerar" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Quantidade de cada</span>
              <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                {QUANTITIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQty(q)}
                    className="px-5 py-2 text-sm font-medium cursor-pointer transition-colors"
                    style={{
                      background: qty === q ? "var(--accent)" : "var(--surface)",
                      color: qty === q ? "#fff" : "var(--text-muted)",
                      borderRight: q !== 10 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleGenerate}
              className="px-6 py-2.5 rounded-lg font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity self-end"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Gerar
            </button>
          </div>

          {results.length > 0 && (
            <div className="flex flex-col gap-3">
              {results.map((r, i) => (
                <ResultCard key={i} label={r.label} formatted={r.formatted} raw={r.raw} />
              ))}
            </div>
          )}

          {results.length === 0 && (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Clique em "Gerar" para criar os números.
            </p>
          )}
        </div>
      )}

      {/* Validar */}
      {tab === "validar" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Cole um CPF ou CNPJ abaixo — com ou sem formatação.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg px-4 py-3 font-mono text-base outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="000.000.000-00 ou 00.000.000/0001-00"
              value={validateInput}
              onChange={(e) => { setValidateInput(e.target.value); setValidateResult(null); }}
              spellCheck={false}
            />
            <button
              onClick={handleValidate}
              className="px-5 py-3 rounded-lg font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Validar
            </button>
          </div>

          {validateResult && (
            <div
              className="flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-semibold"
              style={{
                background: validateResult.valid ? "#14532d" : "#450a0a",
                border: `1px solid ${validateResult.valid ? "var(--success)" : "var(--error)"}`,
                color: validateResult.valid ? "var(--success)" : "var(--error)",
              }}
            >
              <span className="text-lg">{validateResult.valid ? "✓" : "✕"}</span>
              <span>
                {validateResult.type} {validateResult.valid ? "válido" : "inválido"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

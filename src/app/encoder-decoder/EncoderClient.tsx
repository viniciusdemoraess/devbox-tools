"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Tab = "base64" | "url" | "jwt";
type TFunc = ReturnType<typeof useTranslations>;

function CopyButton({ text, t }: { text: string; t: TFunc }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
      style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
    >
      {copied ? t("copied") : t("copy")}
    </button>
  );
}

function IOPair({ t, input, setInput, output, onEncode, onDecode, encodeLbl, decodeLbl, error }: {
  t: TFunc; input: string; setInput: (v: string) => void;
  output: string; onEncode: () => void; onDecode: () => void;
  encodeLbl: string; decodeLbl: string; error?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("input")}</label>
        <textarea
          className="w-full h-36 rounded-lg p-3 font-mono text-sm resize-y outline-none focus:ring-2 focus:ring-indigo-500"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false}
        />
      </div>
      <div className="flex gap-3 flex-wrap">
        <button onClick={onEncode} className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "var(--accent)", color: "#fff" }}>{encodeLbl}</button>
        <button onClick={onDecode} className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>{decodeLbl}</button>
        <button onClick={() => setInput("")} className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{t("clear")}</button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("output")}</label>
          {output && <CopyButton text={output} t={t} />}
        </div>
        <textarea
          readOnly
          className="w-full h-36 rounded-lg p-3 font-mono text-sm resize-y outline-none"
          style={{ background: "var(--surface-2)", border: `1px solid ${error ? "var(--error)" : "var(--border)"}`, color: error ? "var(--error)" : "var(--text)" }}
          value={error || output} placeholder={t("outputPlaceholder")} spellCheck={false}
        />
      </div>
    </div>
  );
}

function Base64Tab({ t }: { t: TFunc }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const encode = () => { try { setOutput(btoa(unescape(encodeURIComponent(input)))); setError(""); } catch { setError(t("errorEncoding")); } };
  const decode = () => { try { setOutput(decodeURIComponent(escape(atob(input.trim())))); setError(""); } catch { setError(t("errorBase64")); } };
  return <IOPair t={t} input={input} setInput={(v) => { setInput(v); setOutput(""); setError(""); }} output={output} onEncode={encode} onDecode={decode} encodeLbl={t("encodeBase64")} decodeLbl={t("decodeBase64")} error={error} />;
}

function UrlTab({ t }: { t: TFunc }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const encode = () => { try { setOutput(encodeURIComponent(input)); setError(""); } catch { setError(t("errorEncoding")); } };
  const decode = () => { try { setOutput(decodeURIComponent(input.trim())); setError(""); } catch { setError(t("errorUrl")); } };
  return <IOPair t={t} input={input} setInput={(v) => { setInput(v); setOutput(""); setError(""); }} output={output} onEncode={encode} onDecode={decode} encodeLbl={t("urlEncode")} decodeLbl={t("urlDecode")} error={error} />;
}

function JwtTab({ t }: { t: TFunc }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ header: object; payload: object; sig: string } | null>(null);
  const [error, setError] = useState("");

  const decode = () => {
    try {
      const parts = input.trim().split(".");
      if (parts.length !== 3) throw new Error(t("errorJwt"));
      const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      setResult({ header, payload, sig: parts[2] });
      setError("");
    } catch (e) {
      setError(String(e).replace(/^Error: /, ""));
      setResult(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("jwtToken")}</label>
        <textarea
          className="w-full h-28 rounded-lg p-3 font-mono text-sm resize-y outline-none focus:ring-2 focus:ring-indigo-500"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          placeholder={t("jwtPlaceholder")}
          value={input} onChange={(e) => { setInput(e.target.value); setResult(null); setError(""); }} spellCheck={false}
        />
      </div>
      <div className="flex gap-3">
        <button onClick={decode} className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "var(--accent)", color: "#fff" }}>{t("decodeJwt")}</button>
        <button onClick={() => { setInput(""); setResult(null); setError(""); }} className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{t("clear")}</button>
      </div>
      {error && <p className="text-sm font-mono" style={{ color: "var(--error)" }}>{error}</p>}
      {result && (
        <div className="flex flex-col gap-3">
          {[{ label: t("header"), data: result.header }, { label: t("payload"), data: result.payload }].map(({ label, data }) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
                <CopyButton text={JSON.stringify(data, null, 2)} t={t} />
              </div>
              <pre className="rounded-lg p-3 text-sm overflow-x-auto" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t("signature")}</span>
            <p className="font-mono text-xs break-all px-3 py-2 rounded-lg" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>{result.sig}</p>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>⚠ {t("jwtWarning")}</p>
        </div>
      )}
    </div>
  );
}

export default function EncoderClient() {
  const t = useTranslations("encoderDecoder");
  const [tab, setTab] = useState<Tab>("base64");

  const TABS: { id: Tab; label: string }[] = [
    { id: "base64", label: "Base64" },
    { id: "url",    label: t("urlEncode") },
    { id: "jwt",    label: t("decodeJwt") },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex rounded-xl p-1 gap-1 w-fit" style={{ background: "var(--surface)" }}>
        {TABS.map((tb) => (
          <button key={tb.id} onClick={() => setTab(tb.id)} className="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all"
            style={{ background: tab === tb.id ? "var(--accent)" : "transparent", color: tab === tb.id ? "#fff" : "var(--text-muted)" }}>
            {tb.label}
          </button>
        ))}
      </div>
      {tab === "base64" && <Base64Tab t={t} />}
      {tab === "url"    && <UrlTab t={t} />}
      {tab === "jwt"    && <JwtTab t={t} />}
    </div>
  );
}

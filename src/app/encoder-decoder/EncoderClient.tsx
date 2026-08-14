"use client";

import { useState } from "react";

type Tab = "base64" | "url" | "jwt";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
      style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function IOPair({ input, setInput, output, onEncode, onDecode, encodeLbl = "Encode", decodeLbl = "Decode", error }: {
  input: string; setInput: (v: string) => void;
  output: string; onEncode: () => void; onDecode: () => void;
  encodeLbl?: string; decodeLbl?: string; error?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Input</label>
        <textarea
          className="w-full h-36 rounded-lg p-3 font-mono text-sm resize-y outline-none focus:ring-2 focus:ring-indigo-500"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false}
        />
      </div>
      <div className="flex gap-3 flex-wrap">
        <button onClick={onEncode} className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "var(--accent)", color: "#fff" }}>{encodeLbl}</button>
        <button onClick={onDecode} className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>{decodeLbl}</button>
        <button onClick={() => setInput("")} className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>Clear</button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Output</label>
          {output && <CopyButton text={output} />}
        </div>
        <textarea
          readOnly
          className="w-full h-36 rounded-lg p-3 font-mono text-sm resize-y outline-none"
          style={{ background: "var(--surface-2)", border: `1px solid ${error ? "var(--error)" : "var(--border)"}`, color: error ? "var(--error)" : "var(--text)" }}
          value={error || output} placeholder="Output will appear here..." spellCheck={false}
        />
      </div>
    </div>
  );
}

function Base64Tab() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const encode = () => { try { setOutput(btoa(unescape(encodeURIComponent(input)))); setError(""); } catch { setError("Encoding failed"); } };
  const decode = () => { try { setOutput(decodeURIComponent(escape(atob(input.trim())))); setError(""); } catch { setError("Invalid Base64 string"); } };
  return <IOPair input={input} setInput={(v) => { setInput(v); setOutput(""); setError(""); }} output={output} onEncode={encode} onDecode={decode} encodeLbl="Encode to Base64" decodeLbl="Decode from Base64" error={error} />;
}

function UrlTab() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const encode = () => { try { setOutput(encodeURIComponent(input)); setError(""); } catch { setError("Encoding failed"); } };
  const decode = () => { try { setOutput(decodeURIComponent(input.trim())); setError(""); } catch { setError("Invalid URL-encoded string"); } };
  return <IOPair input={input} setInput={(v) => { setInput(v); setOutput(""); setError(""); }} output={output} onEncode={encode} onDecode={decode} encodeLbl="URL Encode" decodeLbl="URL Decode" error={error} />;
}

function JwtTab() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ header: object; payload: object; sig: string } | null>(null);
  const [error, setError] = useState("");

  const decode = () => {
    try {
      const parts = input.trim().split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT: must have 3 parts separated by dots");
      const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      setResult({ header, payload, sig: parts[2] });
      setError("");
    } catch (e) {
      setError(String(e));
      setResult(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>JWT Token</label>
        <textarea
          className="w-full h-28 rounded-lg p-3 font-mono text-sm resize-y outline-none focus:ring-2 focus:ring-indigo-500"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          placeholder="Paste your JWT token here..."
          value={input} onChange={(e) => { setInput(e.target.value); setResult(null); setError(""); }} spellCheck={false}
        />
      </div>
      <div className="flex gap-3">
        <button onClick={decode} className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "var(--accent)", color: "#fff" }}>Decode JWT</button>
        <button onClick={() => { setInput(""); setResult(null); setError(""); }} className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>Clear</button>
      </div>
      {error && <p className="text-sm font-mono" style={{ color: "var(--error)" }}>{error}</p>}
      {result && (
        <div className="flex flex-col gap-3">
          {[{ label: "Header", data: result.header }, { label: "Payload", data: result.payload }].map(({ label, data }) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
                <CopyButton text={JSON.stringify(data, null, 2)} />
              </div>
              <pre className="rounded-lg p-3 text-sm overflow-x-auto" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Signature</span>
            <p className="font-mono text-xs break-all px-3 py-2 rounded-lg" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>{result.sig}</p>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>⚠ Signature is not verified — this tool only decodes the token, it does not validate it.</p>
        </div>
      )}
    </div>
  );
}

const TABS: { id: Tab; label: string }[] = [
  { id: "base64", label: "Base64" },
  { id: "url", label: "URL Encode" },
  { id: "jwt", label: "JWT Decoder" },
];

export default function EncoderClient() {
  const [tab, setTab] = useState<Tab>("base64");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex rounded-xl p-1 gap-1 w-fit" style={{ background: "var(--surface)" }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all"
            style={{ background: tab === t.id ? "var(--accent)" : "transparent", color: tab === t.id ? "#fff" : "var(--text-muted)" }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "base64" && <Base64Tab />}
      {tab === "url" && <UrlTab />}
      {tab === "jwt" && <JwtTab />}
    </div>
  );
}

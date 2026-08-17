"use client";

import QRCode from "react-qr-code";
import { useState } from "react";

interface PixQRCodeProps {
  value: string;
  copyLabel: string;
  copiedLabel: string;
}

export default function PixQRCode({ value, copyLabel, copiedLabel }: PixQRCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="rounded-2xl p-4"
        style={{ background: "#fff", border: "1px solid var(--border)" }}
      >
        <QRCode value={value} size={180} />
      </div>
      <button
        onClick={handleCopy}
        className="btn-press px-5 py-2 rounded-lg text-sm font-medium cursor-pointer"
        style={{
          background: copied ? "var(--success)" : "var(--accent)",
          color: "#fff",
          transition: "background 0.15s",
        }}
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}

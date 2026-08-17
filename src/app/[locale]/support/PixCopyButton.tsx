"use client";

import { useState } from "react";

export default function PixCopyButton({
  value,
  copyLabel,
  copiedLabel,
}: {
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer btn-press shrink-0"
      style={{ background: copied ? "var(--success)" : "var(--accent)", color: "#fff" }}
    >
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}

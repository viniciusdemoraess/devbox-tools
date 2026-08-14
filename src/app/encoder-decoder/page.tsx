import type { Metadata } from "next";
import EncoderClient from "./EncoderClient";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder, URL Encode, JWT Decoder Online — Free",
  description:
    "Encode and decode Base64, URL-encode strings, and decode JWT tokens online for free. All processing happens in your browser.",
};

export default function EncoderPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Encoder / Decoder</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Base64, URL encode/decode, and JWT decoder — all running in your browser.
      </p>
      <EncoderClient />
    </div>
  );
}

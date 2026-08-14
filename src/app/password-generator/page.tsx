import type { Metadata } from "next";
import PasswordClient from "./PasswordClient";

export const metadata: Metadata = {
  title: "Password Generator Online — Strong & Secure Free",
  description:
    "Generate strong, secure random passwords online. Customize length, symbols, numbers, and more. All generated in your browser — never sent to a server.",
};

export default function PasswordPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        Generate strong, random passwords instantly. Customize length and character types.
      </p>
      <PasswordClient />
    </div>
  );
}

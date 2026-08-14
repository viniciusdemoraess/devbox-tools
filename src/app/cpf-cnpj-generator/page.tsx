import type { Metadata } from "next";
import CpfCnpjClient from "./CpfCnpjClient";

export const metadata: Metadata = {
  title: "Gerador de CPF e CNPJ para Testes — Grátis Online",
  description:
    "Gere CPF e CNPJ válidos para testes de software. Números fictícios com dígitos verificadores corretos. Ideal para QA, desenvolvimento e testes automatizados.",
};

export default function CpfCnpjPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Gerador de CPF e CNPJ para Testes</h1>
      <p className="mb-4" style={{ color: "var(--text-muted)" }}>
        Gere CPF e CNPJ com dígitos verificadores válidos para usar em testes de software, QA e desenvolvimento.
      </p>
      <div
        className="mb-8 flex items-start gap-2 text-sm rounded-lg px-4 py-3"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
      >
        <span style={{ color: "#f59e0b" }}>⚠</span>
        <span>
          Estes números são <strong style={{ color: "var(--text)" }}>fictícios</strong> e gerados apenas para fins de
          teste e desenvolvimento de software. O uso para qualquer outra finalidade é ilegal.
        </span>
      </div>
      <CpfCnpjClient />
    </div>
  );
}

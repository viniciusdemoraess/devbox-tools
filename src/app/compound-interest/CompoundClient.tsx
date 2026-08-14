"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";

export default function CompoundClient() {
  const locale = useLocale();
  const isBR = locale === "pt";
  const fmt = (n: number) =>
    n.toLocaleString(isBR ? "pt-BR" : "en-US", {
      style: "currency",
      currency: isBR ? "BRL" : "USD",
      maximumFractionDigits: 2,
    });
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [monthly, setMonthly] = useState("0");

  const rows = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) / 100 || 0;
    const y = parseInt(years) || 0;
    const m = parseFloat(monthly) || 0;
    const results = [];
    let balance = p;
    for (let i = 1; i <= y; i++) {
      balance = balance * (1 + r) + m * 12;
      results.push({ year: i, balance });
    }
    return results;
  }, [principal, rate, years, monthly]);

  const totalContributions = (parseFloat(principal) || 0) + (parseFloat(monthly) || 0) * 12 * (parseInt(years) || 0);
  const finalBalance = rows[rows.length - 1]?.balance ?? 0;
  const totalInterest = finalBalance - totalContributions;

  const fields = [
    { label: isBR ? "Investimento Inicial (R$)" : "Initial Investment ($)", value: principal, set: setPrincipal, placeholder: "10000" },
    { label: isBR ? "Taxa de Juros Anual (%)" : "Annual Interest Rate (%)", value: rate, set: setRate, placeholder: "8" },
    { label: isBR ? "Período (anos)" : "Time Period (years)", value: years, set: setYears, placeholder: "10" },
    { label: isBR ? "Aporte Mensal (R$)" : "Monthly Contribution ($)", value: monthly, set: setMonthly, placeholder: "0" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{f.label}</label>
            <input type="number" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder}
              className="rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </div>
        ))}
      </div>

      {rows.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: isBR ? "Saldo Final" : "Final Balance", value: fmt(finalBalance), color: "var(--success)" },
              { label: isBR ? "Total Investido" : "Total Contributed", value: fmt(totalContributions), color: "var(--text)" },
              { label: isBR ? "Juros Ganhos" : "Interest Earned", value: fmt(totalInterest), color: "var(--accent-hover)" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl px-4 py-3 flex flex-col gap-1" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                <span className="text-lg font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <div className="grid grid-cols-3 px-4 py-2 text-xs font-semibold uppercase tracking-wide" style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}>
              <span>{isBR ? "Ano" : "Year"}</span><span className="text-right">{isBR ? "Saldo" : "Balance"}</span><span className="text-right">{isBR ? "Juros" : "Interest"}</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {rows.map((r) => {
                const contributed = (parseFloat(principal) || 0) + (parseFloat(monthly) || 0) * 12 * r.year;
                const interest = r.balance - contributed;
                return (
                  <div key={r.year} className="grid grid-cols-3 px-4 py-2 text-sm" style={{ borderTop: "1px solid var(--border)", color: "var(--text)" }}>
                    <span style={{ color: "var(--text-muted)" }}>{isBR ? "Ano" : "Year"} {r.year}</span>
                    <span className="text-right">{fmt(r.balance)}</span>
                    <span className="text-right" style={{ color: "var(--accent-hover)" }}>{fmt(interest)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

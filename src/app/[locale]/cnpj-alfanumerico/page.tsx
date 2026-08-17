import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations("cnpjAlpha");
  return pageMetadata(locale, "cnpj-alfanumerico", t("metaTitle"), t("metaDescription"));
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default async function CnpjAlfanumericoPage() {
  const t = await getTranslations("cnpjAlpha");

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>{t("title")}</h1>
        <p className="text-base" style={{ color: "var(--text-muted)" }}>{t("subtitle")}</p>
      </div>

      {/* Background */}
      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-3"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{t("backgroundTitle")}</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("backgroundText")}</p>
      </section>

      {/* Why */}
      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-3"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{t("whyTitle")}</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("whyText")}</p>
      </section>

      {/* Structure */}
      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{t("structureTitle")}</h2>
        <div
          className="font-mono text-sm text-center py-4 rounded-xl tracking-widest"
          style={{ background: "var(--surface-2)", color: "var(--text)" }}
        >
          00.000.000 / E08G - 12
        </div>
        <div className="flex flex-col gap-3">
          {[
            { label: t("structureRootLabel"), desc: t("structureRootDesc") },
            { label: t("structureBranchLabel"), desc: t("structureBranchDesc") },
            { label: t("structureCheckLabel"), desc: t("structureCheckDesc") },
          ].map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>{row.label}</span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{row.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Algorithm */}
      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{t("algorithmTitle")}</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("algorithmText")}</p>
        <div
          className="font-mono text-sm px-4 py-3 rounded-xl"
          style={{ background: "var(--surface-2)", color: "var(--text)" }}
        >
          {t("algorithmTable")}
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("algorithmWeights")}</p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("algorithmRemainder")}</p>
      </section>

      {/* Example */}
      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{t("exampleTitle")}</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("exampleText")}</p>
        <div
          className="font-mono text-xl font-bold text-center py-4 rounded-xl"
          style={{ background: "var(--surface-2)", color: "var(--accent)" }}
        >
          00.000.000/E08G-12
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("exampleD1")}</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("exampleD2")}</p>
        </div>
        <div
          className="font-mono text-sm text-center py-3 rounded-xl tracking-widest"
          style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
        >
          12.ABC.345/01DE-35
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t("exampleOfficialFull")}</p>
      </section>

      {/* Systems */}
      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{t("systemsTitle")}</h2>
        <ul className="flex flex-col gap-2">
          {[t("systemsMask"), t("systemsRegex"), t("systemsDb"), t("systemsCase")].map((item) => (
            <li key={item} className="flex gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <span style={{ color: "var(--accent)" }}>—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-3"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{t("toolTitle")}</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("toolText")}</p>
        <Link
          href="/cpf-cnpj-generator"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium w-fit"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          CPF / CNPJ →
        </Link>
      </section>
    </div>
  );
}

import { getTranslations } from "next-intl/server";
import CpfCnpjClient from "../../cpf-cnpj-generator/CpfCnpjClient";
import { pageMetadata } from "@/lib/metadata";

type Locale = "en" | "pt";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cpfCnpj" });
  return pageMetadata(locale, "cpf-cnpj-generator", t("metaTitle"), t("metaDescription"));
}

const faqKeys = ["faq1", "faq2", "faq3", "faq4", "faq5"] as const;

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cpfCnpj" });
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>{t("description")}</p>
      <CpfCnpjClient />
      <div className="mt-12 flex flex-col gap-8 max-w-3xl">
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{t("howToUseTitle")}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("howToUse")}</p>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{t("algorithmTitle")}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("algorithmText")}</p>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{t("aboutTitle")}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("aboutText")}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">{t("faqTitle")}</h2>
          <dl className="flex flex-col gap-4">
            {faqKeys.map((n) => (
              <div key={n} className="rounded-xl p-5 flex flex-col gap-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <dt className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t(`${n}Q`)}</dt>
                <dd className="text-sm leading-relaxed m-0" style={{ color: "var(--text-muted)" }}>{t(`${n}A`)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>🔒 {t("privacyNote")}</p>
      </div>
    </div>
  );
}

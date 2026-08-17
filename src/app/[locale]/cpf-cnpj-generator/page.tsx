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

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cpfCnpj" });
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>{t("description")}</p>
      <CpfCnpjClient />
      <div className="mt-12 flex flex-col gap-8 max-w-3xl">
        <section>
          <h2 className="text-xl font-semibold mb-2">{t("howToUseTitle")}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("howToUse")}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">{t("algorithmTitle")}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("algorithmText")}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">{t("aboutTitle")}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("aboutText")}</p>
        </section>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>🔒 {t("privacyNote")}</p>
      </div>
    </div>
  );
}

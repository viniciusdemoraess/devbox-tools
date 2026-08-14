import { getTranslations } from "next-intl/server";
import UnitClient from "../../unit-converter/UnitClient";

type Locale = "en" | "pt";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "unitConverter" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "unitConverter" });
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>{t("description")}</p>
      <UnitClient />
    </div>
  );
}

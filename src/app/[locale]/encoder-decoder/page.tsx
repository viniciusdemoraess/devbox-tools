import { getTranslations } from "next-intl/server";
import EncoderClient from "../../encoder-decoder/EncoderClient";
import { pageMetadata } from "@/lib/metadata";

type Locale = "en" | "pt";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "encoderDecoder" });
  return pageMetadata(locale, "encoder-decoder", t("metaTitle"), t("metaDescription"));
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "encoderDecoder" });
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>{t("description")}</p>
      <EncoderClient />
    </div>
  );
}

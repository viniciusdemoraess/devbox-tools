import { getTranslations, getLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations("terms");
  return pageMetadata(locale, "terms-of-use", t("metaTitle"), t("metaDescription"));
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default async function TermsOfUsePage() {
  const t = await getTranslations("terms");

  const sections = [
    { title: t("useTitle"), body: t("useText") },
    { title: t("testingTitle"), body: t("testingText") },
    { title: t("warrantyTitle"), body: t("warrantyText") },
    { title: t("changesTitle"), body: t("changesText") },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>{t("title")}</h1>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t("lastUpdated")}</p>
      </div>

      {sections.map((s) => (
        <section
          key={s.title}
          className="rounded-2xl p-6 md:p-8 flex flex-col gap-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{s.title}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.body}</p>
        </section>
      ))}
    </div>
  );
}

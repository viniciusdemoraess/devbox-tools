import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("privacy");

  const sections = [
    { title: t("toolsTitle"), body: t("toolsText") },
    { title: t("analyticsTitle"), body: t("analyticsText") },
    { title: t("analyticsEventsTitle"), body: t("analyticsEventsText") },
    { title: t("cookiesTitle"), body: t("cookiesText") },
    { title: t("contactTitle"), body: t("contactText") },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>{t("title")}</h1>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t("lastUpdated")}</p>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("intro")}</p>

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

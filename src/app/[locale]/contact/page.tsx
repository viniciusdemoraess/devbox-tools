import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const hasContact = siteConfig.contactEmail || siteConfig.githubUrl;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6">
      <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>{t("title")}</h1>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("intro")}</p>

      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {!hasContact && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("noContactText")}</p>
        )}

        {siteConfig.contactEmail && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {t("emailLabel")}
            </span>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              {siteConfig.contactEmail}
            </a>
          </div>
        )}

        {siteConfig.githubUrl && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {t("githubLabel")}
            </span>
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              {t("githubText")}
            </a>
          </div>
        )}
      </section>
    </div>
  );
}

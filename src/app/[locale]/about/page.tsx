import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-6">
      <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>{t("title")}</h1>

      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-3"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{t("missionTitle")}</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("missionText")}</p>
      </section>

      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-3"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{t("privacyTitle")}</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("privacyText")}</p>
      </section>

      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col gap-3"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{t("openTitle")}</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("openText")}</p>
        <Link
          href="/support"
          className="text-sm font-medium hover:underline w-fit"
          style={{ color: "var(--accent)" }}
        >
          Support DevBox Tools →
        </Link>
      </section>
    </div>
  );
}

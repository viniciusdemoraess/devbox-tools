import { getTranslations } from "next-intl/server";
import TimestampClient from "../../timestamp-converter/TimestampClient";
import { pageMetadata } from "@/lib/metadata";

type Locale = "en" | "pt";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "timestampConverter" });
  return pageMetadata(locale, "timestamp-converter", t("metaTitle"), t("metaDescription"));
}

const codeLangs = [
  { key: "codeJS",     label: "JavaScript / TypeScript" },
  { key: "codePython", label: "Python" },
  { key: "codeJava",   label: "Java / Kotlin" },
  { key: "codeSQL",    label: "SQL" },
] as const;

const faqKeys = ["faq1", "faq2", "faq3", "faq4", "faq5"] as const;

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "timestampConverter" });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>{t("description")}</p>

      <TimestampClient />

      <div className="mt-14 flex flex-col gap-10 max-w-3xl">

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>{t("aboutTitle")}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("aboutText")}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>{t("secondsVsMillisTitle")}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("secondsVsMillisText")}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>{t("codeTitle")}</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("codeIntro")}</p>
          {codeLangs.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                {label}
              </span>
              <pre
                className="rounded-lg p-4 overflow-x-auto text-xs leading-relaxed"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              >
                <code>{t(key)}</code>
              </pre>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>{t("useCasesTitle")}</h2>
          <ul className="text-sm leading-relaxed flex flex-col gap-2 list-disc list-inside" style={{ color: "var(--text-muted)" }}>
            {(["useCaseApi", "useCaseJwt", "useCaseLog", "useCaseDb", "useCaseScheduler"] as const).map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>{t("howToUseTitle")}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("howToUse")}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>{t("faqTitle")}</h2>
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

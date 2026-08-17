import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/config";
import { pageMetadata } from "@/lib/metadata";

type Locale = "en" | "pt";

const developerTools = [
  "jsonFormatter", "yamlValidator", "textDiff", "encoderDecoder", "regexTester",
  "gitignoreGenerator", "timestampConverter", "passwordGenerator", "colorConverter", "cpfCnpj",
] as const;

const utilityTools = [
  "wordCounter", "unitConverter", "bmiCalculator", "compoundInterest",
] as const;

const toolHrefs: Record<string, string> = {
  jsonFormatter: "/json-formatter",
  yamlValidator: "/yaml-validator",
  textDiff: "/text-diff",
  encoderDecoder: "/encoder-decoder",
  regexTester: "/regex-tester",
  gitignoreGenerator: "/gitignore-generator",
  timestampConverter: "/timestamp-converter",
  passwordGenerator: "/password-generator",
  colorConverter: "/color-converter",
  cpfCnpj: "/cpf-cnpj-generator",
  wordCounter: "/word-counter",
  unitConverter: "/unit-converter",
  bmiCalculator: "/bmi-calculator",
  compoundInterest: "/compound-interest",
};

function ToolIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    jsonFormatter: (
      <>
        <path d="M7 3H5C4.4 3 4 3.4 4 4V8L2 10L4 12V16C4 16.6 4.4 17 5 17H7" />
        <path d="M13 3H15C15.6 3 16 3.4 16 4V8L18 10L16 12V16C16 16.6 15.6 17 15 17H13" />
      </>
    ),
    yamlValidator: (
      <>
        <rect x="3" y="2" width="14" height="16" rx="1" />
        <path d="M7 7H13M7 10H13M7 13H11" />
      </>
    ),
    textDiff: (
      <>
        <path d="M10 3V17" />
        <path d="M6 7L10 3L14 7" />
        <path d="M6 13L10 17L14 13" />
      </>
    ),
    encoderDecoder: (
      <>
        <path d="M3 7H15" />
        <path d="M12 4.5L15 7L12 9.5" />
        <path d="M17 13H5" />
        <path d="M8 10.5L5 13L8 15.5" />
      </>
    ),
    regexTester: (
      <>
        <circle cx="9" cy="9" r="5.5" />
        <path d="M13.5 13.5L17 17" />
        <path d="M7 8V10M9.5 8V10M7 10H9.5" />
      </>
    ),
    gitignoreGenerator: (
      <>
        <path d="M10 2L18 5.5V10C18 14.5 14.5 17.5 10 19C5.5 17.5 2 14.5 2 10V5.5L10 2Z" />
        <path d="M7 10L9 12L13 8" />
      </>
    ),
    timestampConverter: (
      <>
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6V10L13 12" />
      </>
    ),
    passwordGenerator: (
      <>
        <circle cx="7" cy="8" r="4" />
        <path d="M10.5 10.5L17 17" />
        <path d="M14 13.5L16 11.5" />
      </>
    ),
    colorConverter: (
      <>
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C12 22 12 20 14 20C16 20 18 18 18 16C18 14 20 14 20 12C20 6.48 15.52 2 12 2Z" />
        <circle cx="7" cy="9" r="1" fill="currentColor" stroke="none" />
        <circle cx="11" cy="6" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
      </>
    ),
    cpfCnpj: (
      <>
        <rect x="1" y="5" width="18" height="11" rx="2" />
        <circle cx="7" cy="10.5" r="2" />
        <path d="M12 8.5H16M12 10.5H16M12 12.5H15" />
      </>
    ),
    wordCounter: (
      <path d="M3 5H17M3 9H17M3 13H17M3 17H11" />
    ),
    unitConverter: (
      <>
        <path d="M2 8H14" />
        <path d="M11 5.5L14 8L11 10.5" />
        <path d="M18 12H6" />
        <path d="M9 9.5L6 12L9 14.5" />
      </>
    ),
    bmiCalculator: (
      <>
        <circle cx="10" cy="4" r="2.5" />
        <path d="M10 8V14" />
        <path d="M6.5 11H13.5" />
        <path d="M7 17.5L10 14L13 17.5" />
      </>
    ),
    compoundInterest: (
      <>
        <path d="M3 15L8 9L12 12L17 5" />
        <path d="M13 5H17V9" />
      </>
    ),
  };

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] ?? null}
    </svg>
  );
}

function ToolCard({ toolKey, href, title, description }: {
  toolKey: string;
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="tool-card rounded-xl p-5 flex flex-col gap-3"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "var(--surface-2)", color: "var(--accent)" }}
      >
        <ToolIcon name={toolKey} />
      </div>
      <div>
        <h3 className="font-semibold text-base leading-snug">{title}</h3>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
      </div>
    </Link>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return pageMetadata(locale, "", t("metaTitle"), t("subtitle"));
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DevBox Tools",
    "url": siteConfig.url,
    "description": t("subtitle"),
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteConfig.url}/${locale}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-3">{t("title")}</h1>
      <p className="text-lg mb-14" style={{ color: "var(--text-muted)" }}>
        {t("subtitle")}
      </p>

      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
          {t("developer")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {developerTools.map((key) => (
            <ToolCard
              key={key}
              toolKey={key}
              href={toolHrefs[key]}
              title={t(`${key}.title`)}
              description={t(`${key}.description`)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
          {t("utilities")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {utilityTools.map((key) => (
            <ToolCard
              key={key}
              toolKey={key}
              href={toolHrefs[key]}
              title={t(`${key}.title`)}
              description={t(`${key}.description`)}
            />
          ))}
        </div>
      </section>
    </div>
    </>
  );
}

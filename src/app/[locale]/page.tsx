import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Locale = "en" | "pt";

const toolKeys = [
  "jsonFormatter", "yamlValidator", "textDiff", "encoderDecoder", "regexTester",
  "gitignoreGenerator", "timestampConverter", "passwordGenerator", "colorConverter", "cpfCnpj",
] as const;

const utilityKeys = [
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

const toolTags: Record<string, string> = {
  jsonFormatter: "{ }", yamlValidator: "---", textDiff: "±", encoderDecoder: "64",
  regexTester: ".*", gitignoreGenerator: ".gi", timestampConverter: "TS",
  passwordGenerator: "🔑", colorConverter: "●", cpfCnpj: "BR",
  wordCounter: "W", unitConverter: "⇄", bmiCalculator: "IMC", compoundInterest: "$",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return { title: "DevBox Tools", description: t("subtitle") };
}

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-3">{t("title")}</h1>
      <p className="text-lg mb-14" style={{ color: "var(--text-muted)" }}>{t("subtitle")}</p>

      <div className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>{t("developer")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {toolKeys.map((key) => (
            <Link key={key} href={toolHrefs[key]}
              className="rounded-xl p-5 flex flex-col gap-3 transition-colors hover:border-indigo-500"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span className="font-mono text-sm font-bold px-2 py-1 rounded w-fit" style={{ background: "var(--surface-2)", color: "var(--accent-hover)" }}>{toolTags[key]}</span>
              <h3 className="font-semibold text-base">{t(`${key}.title`)}</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t(`${key}.description`)}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>{t("utilities")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {utilityKeys.map((key) => (
            <Link key={key} href={toolHrefs[key]}
              className="rounded-xl p-5 flex flex-col gap-3 transition-colors hover:border-indigo-500"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span className="font-mono text-sm font-bold px-2 py-1 rounded w-fit" style={{ background: "var(--surface-2)", color: "var(--accent-hover)" }}>{toolTags[key]}</span>
              <h3 className="font-semibold text-base">{t(`${key}.title`)}</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t(`${key}.description`)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const toolLinks = [
  { href: "/json-formatter", key: "jsonFormatter" },
  { href: "/yaml-validator", key: "yamlValidator" },
  { href: "/text-diff", key: "textDiff" },
  { href: "/regex-tester", key: "regexTester" },
  { href: "/cpf-cnpj-generator", key: "cpfCnpj" },
  { href: "/password-generator", key: "passwordGenerator" },
  { href: "/timestamp-converter", key: "timestampConverter" },
] as const;

export default async function Footer() {
  const t = await getTranslations("footer");
  const ts = await getTranslations("sidebar");

  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="font-bold text-base" style={{ color: "var(--accent-hover)" }}>
            DevBox<span style={{ color: "var(--text-muted)" }}>.tools</span>
          </Link>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {t("tagline")}
          </p>
        </div>

        {/* Tools */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            {t("tools")}
          </p>
          <nav className="flex flex-col gap-2">
            {toolLinks.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className="text-sm hover:underline"
                style={{ color: "var(--text-muted)" }}
              >
                {ts(key)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            {t("company")}
          </p>
          <nav className="flex flex-col gap-2">
            <Link href="/about" className="text-sm hover:underline" style={{ color: "var(--text-muted)" }}>{t("about")}</Link>
            <Link href="/contact" className="text-sm hover:underline" style={{ color: "var(--text-muted)" }}>{t("contact")}</Link>
            <Link href="/support" className="text-sm hover:underline" style={{ color: "var(--text-muted)" }}>{t("support")}</Link>
            <Link href="/privacy-policy" className="text-sm hover:underline" style={{ color: "var(--text-muted)" }}>{t("privacy")}</Link>
            <Link href="/terms-of-use" className="text-sm hover:underline" style={{ color: "var(--text-muted)" }}>{t("terms")}</Link>
          </nav>
        </div>
      </div>

      <div
        className="text-center text-xs py-4"
        style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
      >
        © {year} {t("copyright")}
      </div>
    </footer>
  );
}

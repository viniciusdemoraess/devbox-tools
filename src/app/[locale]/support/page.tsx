import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import PixCopyButton from "./PixCopyButton";
import PixQRCode from "./PixQRCode";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("support");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default async function SupportPage() {
  const t = await getTranslations("support");
  const { donation } = siteConfig;
  const hasAny = donation.pixKey || donation.githubSponsors || donation.buyMeACoffee || donation.kofi;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col gap-6">
      <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>{t("title")}</h1>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("intro")}</p>

      <div className="flex flex-col gap-4">
        {!hasAny && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("noSupportText")}</p>
        )}

        {/* QR Code Pix */}
        {donation.pixKey && donation.pixCopyPaste && (
          <section
            className="rounded-2xl p-6 flex flex-col items-center gap-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest self-start" style={{ color: "var(--text-muted)" }}>
              {t("pixLabel")} — QR Code
            </span>
            <PixQRCode
              value={donation.pixCopyPaste}
              copyLabel={t("pixCopyCode")}
              copiedLabel={t("pixCopied")}
            />
          </section>
        )}

        {/* Chave Pix em texto */}
        {donation.pixKey && (
          <section
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {t("pixKeyLabel")}
            </span>
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              <span className="font-mono text-sm flex-1 truncate" style={{ color: "var(--text)" }}>
                {donation.pixKey}
              </span>
              <PixCopyButton
                value={donation.pixKey}
                copyLabel={t("pixCopyLabel")}
                copiedLabel={t("pixCopied")}
              />
            </div>
          </section>
        )}

        {/* GitHub Sponsors */}
        {donation.githubSponsors && (
          <section
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {t("githubSponsorsLabel")}
            </span>
            <a
              href={donation.githubSponsors}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium w-fit"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              GitHub Sponsors →
            </a>
          </section>
        )}

        {/* Buy Me a Coffee */}
        {donation.buyMeACoffee && (
          <section
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {t("buyMeACoffeeLabel")}
            </span>
            <a
              href={donation.buyMeACoffee}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium w-fit"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Buy Me a Coffee →
            </a>
          </section>
        )}

        {/* Ko-fi */}
        {donation.kofi && (
          <section
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {t("kofiLabel")}
            </span>
            <a
              href={donation.kofi}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium w-fit"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Ko-fi →
            </a>
          </section>
        )}
      </div>
    </div>
  );
}

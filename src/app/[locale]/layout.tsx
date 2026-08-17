import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/config";
import Sidebar from "@/components/Sidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "DevBox Tools", template: "%s | DevBox Tools" },
  description: "Ferramentas online gratuitas para devs — formatador JSON, validador YAML, testador de regex, gerador de CPF/CNPJ e mais. Tudo roda no navegador.",
  metadataBase: new URL(siteConfig.url),
  verification: { google: "CC28w4J744vKnS9WrFRMTJ76swP3pdwuQvfzXpaRnxI" },
  openGraph: {
    type: "website",
    siteName: "DevBox Tools",
    title: "DevBox Tools — Ferramentas Online para Desenvolvedores e QA",
    description: "Ferramentas gratuitas, rápidas e privadas para devs. JSON, YAML, regex, diff, CPF/CNPJ e muito mais.",
    url: siteConfig.url,
    images: [
      {
        url: `${siteConfig.url.replace(/\/$/, "")}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "DevBox Tools — Ferramentas Online para Desenvolvedores e QA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevBox Tools — Ferramentas Online para Devs",
    description: "Ferramentas gratuitas, rápidas e privadas para desenvolvedores. Tudo roda no navegador.",
    images: [`${siteConfig.url.replace(/\/$/, "")}/og-image.png`],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "pt")) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ background: "var(--background)", color: "var(--text)" }}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-LMD1T4RJYL" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-LMD1T4RJYL');`}
        </Script>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
              <Sidebar />
              <Link href="/" className="font-bold text-lg tracking-tight flex-1 flex items-center gap-2" style={{ color: "var(--accent-hover)" }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <rect width="32" height="32" rx="7" fill="#4f46e5"/>
                  <path d="M5 9L14 16L5 23" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="23" x2="27" y2="23" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
                </svg>
                DevBox<span style={{ color: "var(--text-muted)" }}>.tools</span>
              </Link>
              <LanguageSwitcher />
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

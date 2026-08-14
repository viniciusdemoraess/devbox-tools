import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Sidebar from "@/components/Sidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "DevBox Tools", template: "%s | DevBox Tools" },
  description: "Free online developer tools — JSON formatter, YAML validator, regex tester, and more.",
  metadataBase: new URL("https://devbox-tools-puce.vercel.app"),
  verification: { google: "CC28w4J744vKnS9WrFRMTJ76swP3pdwuQvfzXpaRnxI" },
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
              <Link href="/" className="font-bold text-lg tracking-tight flex-1" style={{ color: "var(--accent-hover)" }}>
                DevBox<span style={{ color: "var(--text-muted)" }}>.tools</span>
              </Link>
              <LanguageSwitcher />
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="text-center text-xs py-4" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
            © {new Date().getFullYear()} DevBox Tools — Free developer utilities
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

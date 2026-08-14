import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "DevBox Tools", template: "%s | DevBox Tools" },
  description: "Free online developer tools — JSON formatter, YAML validator, and more.",
  metadataBase: new URL("https://devbox-tools-puce.vercel.app"),
  verification: {
    google: "CC28w4J744vKnS9WrFRMTJ76swP3pdwuQvfzXpaRnxI",
  },
};

const tools = [
  { href: "/json-formatter", label: "JSON Formatter" },
  { href: "/yaml-validator", label: "YAML Validator" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ background: "var(--background)", color: "var(--text)" }}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LMD1T4RJYL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LMD1T4RJYL');
          `}
        </Script>
        <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-8">
            <Link href="/" className="font-bold text-lg tracking-tight" style={{ color: "var(--accent-hover)" }}>
              DevBox<span style={{ color: "var(--text-muted)" }}>.tools</span>
            </Link>
            <nav className="flex gap-4 text-sm">
              {tools.map((t) => (
                <Link key={t.href} href={t.href} className="hover:underline" style={{ color: "var(--text-muted)" }}>
                  {t.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="text-center text-xs py-4" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
          © {new Date().getFullYear()} DevBox Tools — Free developer utilities
        </footer>
      </body>
    </html>
  );
}

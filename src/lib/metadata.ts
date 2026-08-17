import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export function pageMetadata(
  locale: string,
  slug: string,
  title: string,
  description: string
): Metadata {
  const base = siteConfig.url.replace(/\/$/, "");
  const canonical = slug ? `${base}/${locale}/${slug}` : `${base}/${locale}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: slug ? `${base}/en/${slug}` : `${base}/en`,
        pt: slug ? `${base}/pt/${slug}` : `${base}/pt`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "DevBox Tools",
      title,
      description,
      url: canonical,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      images: [
        {
          url: `${base}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "DevBox Tools — Ferramentas Online para Desenvolvedores e QA",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${base}/og-image.png`],
    },
  };
}

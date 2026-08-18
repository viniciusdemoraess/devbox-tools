import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

const locales = ["en", "pt"] as const;
const base = siteConfig.url.replace(/\/$/, "");

// slug: "" = home page; otherwise the path segment without leading slash.
// lastModified reflects the actual last meaningful content change.
const routes: { slug: string; priority: number; date: string }[] = [
  { slug: "",                    priority: 1,   date: "2026-08-17" },
  { slug: "json-formatter",      priority: 0.9, date: "2026-08-16" },
  { slug: "yaml-validator",      priority: 0.9, date: "2026-08-16" },
  { slug: "text-diff",           priority: 0.9, date: "2026-08-16" },
  { slug: "encoder-decoder",     priority: 0.9, date: "2026-08-16" },
  { slug: "regex-tester",        priority: 0.9, date: "2026-08-16" },
  { slug: "gitignore-generator", priority: 0.9, date: "2026-08-16" },
  { slug: "timestamp-converter", priority: 0.9, date: "2026-08-17" },
  { slug: "password-generator",  priority: 0.9, date: "2026-08-16" },
  { slug: "color-converter",     priority: 0.9, date: "2026-08-16" },
  { slug: "cpf-cnpj-generator",  priority: 0.9, date: "2026-08-17" },
  { slug: "word-counter",        priority: 0.8, date: "2026-08-16" },
  { slug: "unit-converter",      priority: 0.8, date: "2026-08-16" },
  { slug: "bmi-calculator",      priority: 0.8, date: "2026-08-16" },
  { slug: "compound-interest",   priority: 0.8, date: "2026-08-16" },
  { slug: "cnpj-alfanumerico",   priority: 0.9, date: "2026-08-16" },
  { slug: "about",               priority: 0.6, date: "2026-08-16" },
  { slug: "privacy-policy",      priority: 0.5, date: "2026-08-16" },
  { slug: "terms-of-use",        priority: 0.5, date: "2026-08-16" },
  { slug: "contact",             priority: 0.6, date: "2026-08-16" },
  { slug: "support",             priority: 0.6, date: "2026-08-16" },
];

function pageUrl(locale: string, slug: string): string {
  return slug ? `${base}/${locale}/${slug}` : `${base}/${locale}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map(({ slug, priority, date }) => ({
      url: pageUrl(locale, slug),
      lastModified: date,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: {
          "x-default": pageUrl("pt", slug),
          en: pageUrl("en", slug),
          pt: pageUrl("pt", slug),
        },
      },
    }))
  );
}

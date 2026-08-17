import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

const locales = ["en", "pt"];

const routes: { path: string; priority: number; date: string }[] = [
  { path: "/", priority: 1, date: "2026-08-16" },
  { path: "/json-formatter", priority: 0.9, date: "2026-08-16" },
  { path: "/yaml-validator", priority: 0.9, date: "2026-08-16" },
  { path: "/text-diff", priority: 0.9, date: "2026-08-16" },
  { path: "/encoder-decoder", priority: 0.9, date: "2026-08-16" },
  { path: "/regex-tester", priority: 0.9, date: "2026-08-16" },
  { path: "/gitignore-generator", priority: 0.9, date: "2026-08-16" },
  { path: "/timestamp-converter", priority: 0.9, date: "2026-08-16" },
  { path: "/password-generator", priority: 0.9, date: "2026-08-16" },
  { path: "/color-converter", priority: 0.9, date: "2026-08-16" },
  { path: "/cpf-cnpj-generator", priority: 0.9, date: "2026-08-16" },
  { path: "/word-counter", priority: 0.8, date: "2026-08-16" },
  { path: "/unit-converter", priority: 0.8, date: "2026-08-16" },
  { path: "/bmi-calculator", priority: 0.8, date: "2026-08-16" },
  { path: "/compound-interest", priority: 0.8, date: "2026-08-16" },
  { path: "/cnpj-alfanumerico", priority: 0.9, date: "2026-08-16" },
  { path: "/about", priority: 0.6, date: "2026-08-16" },
  { path: "/privacy-policy", priority: 0.5, date: "2026-08-16" },
  { path: "/terms-of-use", priority: 0.5, date: "2026-08-16" },
  { path: "/contact", priority: 0.6, date: "2026-08-16" },
  { path: "/support", priority: 0.6, date: "2026-08-16" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map(({ path, priority, date }) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified: date,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.url}/${l}${path}`])
        ),
      },
    }))
  );
}

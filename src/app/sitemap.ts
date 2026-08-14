import { MetadataRoute } from "next";

const BASE_URL = "https://devbox-tools-puce.vercel.app";
const locales = ["en", "pt"];

const routes = [
  { path: "/", priority: 1 },
  { path: "/json-formatter", priority: 0.9 },
  { path: "/yaml-validator", priority: 0.9 },
  { path: "/text-diff", priority: 0.9 },
  { path: "/encoder-decoder", priority: 0.9 },
  { path: "/regex-tester", priority: 0.9 },
  { path: "/gitignore-generator", priority: 0.9 },
  { path: "/timestamp-converter", priority: 0.9 },
  { path: "/password-generator", priority: 0.9 },
  { path: "/color-converter", priority: 0.9 },
  { path: "/cpf-cnpj-generator", priority: 0.9 },
  { path: "/word-counter", priority: 0.8 },
  { path: "/unit-converter", priority: 0.8 },
  { path: "/bmi-calculator", priority: 0.8 },
  { path: "/compound-interest", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map(({ path, priority }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}${path}`])
        ),
      },
    }))
  );
}

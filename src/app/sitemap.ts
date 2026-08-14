import { MetadataRoute } from "next";

const BASE_URL = "https://devbox-tools-puce.vercel.app";

const pages = [
  { url: "/", priority: 1 },
  { url: "/json-formatter", priority: 0.9 },
  { url: "/yaml-validator", priority: 0.9 },
  { url: "/text-diff", priority: 0.9 },
  { url: "/encoder-decoder", priority: 0.9 },
  { url: "/regex-tester", priority: 0.9 },
  { url: "/gitignore-generator", priority: 0.9 },
  { url: "/timestamp-converter", priority: 0.9 },
  { url: "/password-generator", priority: 0.9 },
  { url: "/color-converter", priority: 0.9 },
  { url: "/cpf-cnpj-generator", priority: 0.9 },
  { url: "/word-counter", priority: 0.8 },
  { url: "/unit-converter", priority: 0.8 },
  { url: "/bmi-calculator", priority: 0.8 },
  { url: "/compound-interest", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ url, priority }) => ({
    url: BASE_URL + url,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));
}

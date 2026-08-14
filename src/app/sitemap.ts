import { MetadataRoute } from "next";

const BASE_URL = "https://devbox.tools";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/json-formatter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/yaml-validator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];
}

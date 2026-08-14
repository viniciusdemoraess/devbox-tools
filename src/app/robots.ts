import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://devbox-tools-puce.vercel.app/sitemap.xml",
  };
}

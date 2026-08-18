import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// All page slugs that exist without locale prefix.
// Each gets a permanent 308 redirect to /pt/<slug>.
// These fire before the middleware, so they never set the NEXT_LOCALE cookie
// and never depend on Accept-Language or any browser preference.
const pageSlugs = [
  "json-formatter",
  "yaml-validator",
  "text-diff",
  "encoder-decoder",
  "regex-tester",
  "gitignore-generator",
  "timestamp-converter",
  "password-generator",
  "color-converter",
  "cpf-cnpj-generator",
  "word-counter",
  "unit-converter",
  "bmi-calculator",
  "compound-interest",
  "cnpj-alfanumerico",
  "about",
  "privacy-policy",
  "terms-of-use",
  "contact",
  "support",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Root path → default locale home
      { source: "/", destination: "/pt", permanent: true },
      // Tool and institutional pages without locale prefix → /pt/<slug>
      ...pageSlugs.map((slug) => ({
        source: `/${slug}`,
        destination: `/pt/${slug}`,
        permanent: true,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);

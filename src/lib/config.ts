export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://devbox-tools-puce.vercel.app",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || null,
  authorName: process.env.NEXT_PUBLIC_AUTHOR_NAME || null,
  donation: {
    pixKey: process.env.NEXT_PUBLIC_DONATION_PIX_KEY || null,
    pixCopyPaste: process.env.NEXT_PUBLIC_DONATION_PIX_COPY_PASTE || null,
    githubSponsors: process.env.NEXT_PUBLIC_GITHUB_SPONSORS_URL || null,
    buyMeACoffee: process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL || null,
    kofi: process.env.NEXT_PUBLIC_KOFI_URL || null,
  },
};

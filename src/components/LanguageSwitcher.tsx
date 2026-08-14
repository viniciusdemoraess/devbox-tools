"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: string) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      className="flex rounded-lg overflow-hidden text-sm font-medium"
      style={{ border: "1px solid var(--border)" }}
    >
      {(["en", "pt"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          disabled={isPending}
          className="px-3 py-1.5 transition-colors uppercase"
          style={{
            background: locale === l ? "var(--accent)" : "var(--surface)",
            color: locale === l ? "#fff" : "var(--text-muted)",
            cursor: locale === l ? "default" : "pointer",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

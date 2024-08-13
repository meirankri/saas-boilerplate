import { createSharedPathnamesNavigation } from "next-intl/navigation";
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const { Link, usePathname, useRouter } = createSharedPathnamesNavigation(
  { locales }
);

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

// i18n.ts
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "./i18n.config";

export default getRequestConfig(async ({ locale }) => {
  // Assurez-vous que la locale est valide
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});

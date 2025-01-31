import { getRequestConfig } from "next-intl/server";

import { routing } from "./routings";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    messages: (await import(`../locales/${locale}.json`)).default,
    locale: locale,
  };
});

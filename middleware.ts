import createMiddleware from "next-intl/middleware";

import { NextRequest, NextResponse } from "next/server";
import { locales } from "./i18n.config";

const defaultLanguage = "en";

function getPreferredLocale(request) {
  const acceptLanguageHeader = request.headers.get("Accept-Language");
  if (!acceptLanguageHeader) return defaultLanguage;

  const userLocales = acceptLanguageHeader
    .split(",")
    .map((lang) => lang.split(";")[0])
    .map((lang) => lang.toLowerCase().trim());

  for (const userLocale of userLocales) {
    const matchedLocale = locales.find(
      (locale) =>
        userLocale === locale.toLowerCase() ||
        userLocale.startsWith(locale.toLowerCase() + "-")
    );
    if (matchedLocale) return matchedLocale;
  }

  return defaultLanguage;
}

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: defaultLanguage,
  localePrefix: "as-needed",
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // for browser language detection uncomment the following lines
  // if (pathnameIsMissingLocale) {
  //   // Si le chemin ne contient pas de locale, redirigez vers la locale préférée
  //   const locale = getPreferredLocale(request);
  //   return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  // }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

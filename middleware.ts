import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "fr"];
const defaultLocale = "en";
const privatePages = ["/dashboard"];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false,
  localePrefix: "as-needed",
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const response = intlMiddleware(request);

  if (response instanceof NextResponse && response.status !== 200) {
    return response;
  }

  const removeLocalePrefix = (path: string) => {
    for (const locale of locales) {
      if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
        return path.slice(locale.length + 1) || "/";
      }
    }
    return path;
  };

  const pathnameWithoutLocale = removeLocalePrefix(pathname);

  const isPrivatePage = privatePages.some((page) =>
    pathnameWithoutLocale.startsWith(page)
  );

  const sessionCookie = request.cookies.get("auth_session");

  if (!sessionCookie && isPrivatePage) {
    const loginUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

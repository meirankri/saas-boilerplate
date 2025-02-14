import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/index.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers as ThemeProvider } from "@/providers/ThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getCurrentUser } from "@/lib/lucia";
import { SessionProvider } from "@/providers/SessionProvider";
import { QuotaProvider } from "@/providers/QuotaProvider";
import SessionUpdater from "@/components/auth/SessionUpdater";
import Script from "next/script";
import env from "@/lib/env";
import { TRPCProvider } from "@/app/_trpc/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function LocaleLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
  }>
) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  const messages = await getMessages({ locale });
  const user = (await getCurrentUser()) || {};

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <TRPCProvider>
              <SessionProvider value={user || {}}>
                <SessionUpdater />
                <QuotaProvider>{children}</QuotaProvider>
                <Toaster />
              </SessionProvider>
            </TRPCProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY}`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}

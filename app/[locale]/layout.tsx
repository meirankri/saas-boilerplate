import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/index.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import { Providers as ThemeProvider } from "@/providers/ThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/lucia";
import { SessionProvider } from "@/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages({ locale });
  const user = (await getCurrentUser()) || {};

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <SessionProvider value={user}>
              <Header />
              {children}
              <Toaster />
              <Footer />
            </SessionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
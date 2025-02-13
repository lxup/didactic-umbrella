import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { site } from "@/constants/site";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getFallbackLanguage } from "@/lib/i18n/fallback";
import deepmerge from "deepmerge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s | ${site.title}`,
  },
  description: site.description,
};

export default async function RootLayout({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale: string;
}>) {
  // NEXT-INTL
  const userMessages = await getMessages({ locale });
  const fallbackMessages = await getMessages({ locale: getFallbackLanguage({ locale }) });
  const messages = deepmerge(fallbackMessages, userMessages);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

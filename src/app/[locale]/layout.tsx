import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/constants/site";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getFallbackLanguage } from "@/lib/i18n/fallback";
import deepmerge from "deepmerge";
import { ThemeProvider } from "next-themes";
import { QuizProvider } from "@/provider/quiz-provider";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from 'nextjs-toploader';

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
	// NEXT-INTL
	const userMessages = await getMessages({ locale });
	const fallbackMessages = await getMessages({ locale: getFallbackLanguage({ locale }) });
	const messages = deepmerge(fallbackMessages, userMessages);
	return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QuizProvider>
            <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange={true}
            >
            <TooltipProvider delayDuration={100}>
              <NextTopLoader
                showSpinner={false}
                easing="ease"
                color="#FFE974"
                height={2}
              />
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
            </TooltipProvider>
            </ThemeProvider>
          </QuizProvider>
        </NextIntlClientProvider>
      </body>
    </html>
	);
}

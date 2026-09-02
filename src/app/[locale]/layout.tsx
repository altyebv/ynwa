import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, locales, localeDirection, type Locale } from '@/i18n/routing';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/ui/SkipLink';
import { Splash } from '@/components/layout/Splash';
import { preflightScript } from '@/lib/theme';
import { fontVariables } from '../fonts';
import '../globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ynwas.com';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F4' },
    { media: '(prefers-color-scheme: dark)', color: '#121316' },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t('defaultTitle'),
      template: t('titleTemplate'),
    },
    description: t('defaultDescription'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        ar: '/ar',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      locale: locale === 'ar' ? 'ar_QA' : 'en_QA',
      url: `${siteUrl}/${locale}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Keeps every localized page statically rendered.
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={localeDirection[locale as Locale]}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* Decides theme and splash before first paint. Without it a visitor
            who chose dark gets a flash of the light palette, and a repeat
            visitor gets a frame of a splash they have already seen. */}
        <script dangerouslySetInnerHTML={{ __html: preflightScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider messages={messages}>
          <Splash />
          <SkipLink />
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

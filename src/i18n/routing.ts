import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};

/** Name of each language, written in that language. Never a flag: a flag is a
 *  country, and Arabic is not a country. */
export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // 'always' keeps English at /en rather than at the root. Symmetric routing is
  // what makes hreflang, the sitemap and the language switcher mechanical
  // instead of special-cased.
  localePrefix: 'always',
});

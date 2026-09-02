'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { locales, localeLabels, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';

/**
 * Swaps locale on the current route rather than sending everyone home, and
 * renders each language in its own script. Never a flag: a flag is a country,
 * and Arabic is not a country.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const active = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations('a11y');

  return (
    <div
      className={cn(
        'flex items-center rounded-xs border border-fg/15 p-0.5',
        className,
      )}
      role="group"
      aria-label={t('changeLanguage')}
    >
      {locales.map((locale) => {
        const isActive = locale === active;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            lang={locale}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'rounded-[1px] px-2.5 py-1 text-[0.8125rem] leading-none transition-colors duration-200',
              isActive
                ? 'bg-fg text-ground'
                : 'text-fg-60 hover:text-fg hover:bg-raised',
            )}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}

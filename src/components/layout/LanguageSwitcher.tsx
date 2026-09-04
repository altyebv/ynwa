'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import {
  locales,
  localeLabels,
  localeShortLabels,
  type Locale,
} from '@/i18n/routing';
import { cn } from '@/lib/cn';

/**
 * Swaps locale on the current route rather than sending everyone home, and
 * renders each language in its own script. Never a flag: a flag is a country,
 * and Arabic is not a country.
 *
 * `compact` swaps the full names for two-to-four character forms. The header
 * on a 360px phone has about 250px to spend on the whole control cluster, and
 * "English" + "العربية" alone is more than half of it.
 */
export function LanguageSwitcher({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
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
              // min-h-6 is not decoration: py-1 on a 13px line is a 21px
              // target, under WCAG 2.2 AA's 24x24 minimum (2.5.8), and these
              // two sit flush against each other so the spacing exception
              // does not apply.
              'flex min-h-6 items-center rounded-[1px] text-[0.8125rem] leading-none transition-colors duration-200',
              compact ? 'px-2' : 'px-2.5',
              isActive
                ? 'bg-fg text-ground'
                : 'text-fg-60 hover:text-fg hover:bg-raised',
            )}
          >
            {compact ? localeShortLabels[locale] : localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}

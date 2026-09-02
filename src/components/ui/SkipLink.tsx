import { useTranslations } from 'next-intl';

/** First focusable element on every page. Visible only when focused. */
export function SkipLink() {
  const t = useTranslations('a11y');

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-[100] focus:rounded-xs focus:bg-fg focus:px-4 focus:py-2 focus:text-ground"
    >
      {t('skipToContent')}
    </a>
  );
}

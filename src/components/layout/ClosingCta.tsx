import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { channel, channelHref } from '@/content/company';

/**
 * The last thing on every page.
 *
 * Extracted from the homepage in phase E so that the eight interior routes end
 * the same way rather than each inventing its own sign-off — and so the phone
 * number beside the button keeps coming from `content/company.ts` in one place.
 *
 * The lattice appears here and in the page hero, and nowhere else. Bookending
 * the document with it is the point.
 */
export function ClosingCta({
  headline,
  lede,
}: {
  /** Overrides the default headline where a page has a more specific ask. */
  headline?: string;
  lede?: string;
}) {
  const t = useTranslations('closingCta');
  const tcta = useTranslations('cta');
  const office = channel('phone');

  return (
    <section className="relative overflow-hidden">
      <div className="lattice" aria-hidden="true" />
      <Container className="relative py-20 text-center md:py-28">
        <p className="type-eyebrow text-detail-text">{t('eyebrow')}</p>
        <h2 className="mx-auto mt-4 max-w-[22ch] type-display-2">
          {headline ?? t('headline')}
        </h2>
        <p className="mx-auto mt-4 max-w-[54ch] type-lede">{lede ?? t('lede')}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/contact" size="lg">
            {tcta('primary')}
          </ButtonLink>
          {office && (
            <a
              href={channelHref(office)}
              dir="ltr"
              className="flex h-12 items-center rounded-xs border border-fg/25 px-6 font-mono text-[0.9375rem] text-fg transition-colors duration-200 hover:border-fg hover:bg-raised"
            >
              {office.display}
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}

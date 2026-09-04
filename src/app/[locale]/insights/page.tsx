import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { ClosingCta } from '@/components/layout/ClosingCta';
import { Breadcrumbs, BreadcrumbSchema } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { absoluteUrl } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

/**
 * Nothing is published yet, and this page says so.
 *
 * The alternative — three invented articles, or a "coming soon" with a
 * mailing-list box nobody reads — is the ynwas.com "Our Happy Clients!"
 * heading over an empty space all over again. An empty section is not honest
 * just because it is empty; it has to say what it is waiting for and give the
 * visitor somewhere useful to go instead. Both of those links are pages that
 * actually answer questions today.
 *
 * RECOMMENDED: take Insights out of the primary nav until the first article
 * exists. A nav item that leads to "nothing here yet" spends trust on every
 * visitor who clicks it, and the footer link is enough to keep the route
 * discoverable. One line in content/navigation.ts.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'insightsPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    // Nothing to index yet, and an empty listing competing for the brand name
    // is worse than no listing.
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/${locale}/insights`,
      languages: { en: '/en/insights', ar: '/ar/insights', 'x-default': '/en/insights' },
    },
  };
}

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Insights locale={locale as Locale} />;
}

function Insights({ locale }: { locale: Locale }) {
  const t = useTranslations('insightsPage');
  const tn = useTranslations('nav');

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: tn('home'), href: '/' }, { label: tn('insights') }]}
          />
        }
        eyebrow={t('eyebrow')}
        title={t('headline')}
        lede={t('lede')}
      />

      <BreadcrumbSchema
        items={[
          { name: tn('home'), url: absoluteUrl(locale) },
          { name: tn('insights'), url: absoluteUrl(locale, '/insights') },
        ]}
      />

      <Section width="prose">
        <div className="border border-dashed border-edge p-8 text-center sm:p-12">
          <p className="type-eyebrow text-fg-40">{t('emptyEyebrow')}</p>
          <p className="mx-auto mt-4 max-w-[34ch] type-display-3">
            {t('emptyTitle')}
          </p>
          <p className="mx-auto mt-4 max-w-[46ch] type-small text-fg-60">
            {t('emptyBody')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/doing-business-in-qatar" variant="secondary">
              {tn('qatar')}
            </ButtonLink>
            <ButtonLink href="/faq" variant="secondary">
              {tn('faq')}
            </ButtonLink>
          </div>
        </div>
        <p className="mt-8 text-center type-small text-fg-40">
          {t('meanwhile')}{' '}
          <Link
            href="/contact"
            className="inline-flex min-h-6 items-center underline underline-offset-4 transition-colors duration-200 hover:text-fg"
          >
            {tn('contact')}
          </Link>
          .
        </p>
      </Section>

      <ClosingCta />
    </>
  );
}

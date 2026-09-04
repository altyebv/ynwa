import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/layout/Section';
import { ClosingCta } from '@/components/layout/ClosingCta';
import { Breadcrumbs, BreadcrumbSchema } from '@/components/ui/Breadcrumbs';
import { FaqList, FaqSchema } from '@/components/ui/FaqList';
import { faqs } from '@/content/faqs';
import { serviceCategories } from '@/content/services';
import { publishableOnly } from '@/content/types';
import { absoluteUrl } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faqPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/faq`,
      languages: { en: '/en/faq', ar: '/ar/faq', 'x-default': '/en/faq' },
    },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Faq locale={locale as Locale} />;
}

function Faq({ locale }: { locale: Locale }) {
  const t = useTranslations('faqPage');
  const tn = useTranslations('nav');

  const all = publishableOnly(faqs);

  // Grouped by the category each question belongs to, in the same Start /
  // Operate / Grow order the rest of the site uses, with the unattached
  // questions first — those are the "before you decide anything" ones.
  const general = all.filter((f) => !f.categoryId);
  const groups = serviceCategories
    .map((category) => ({
      category,
      items: all.filter((f) => f.categoryId === category.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: tn('home'), href: '/' }, { label: tn('faq') }]}
          />
        }
        eyebrow={t('eyebrow')}
        title={t('headline')}
        lede={t('lede')}
      />

      <BreadcrumbSchema
        items={[
          { name: tn('home'), url: absoluteUrl(locale) },
          { name: tn('faq'), url: absoluteUrl(locale, '/faq') },
        ]}
      />

      {general.length > 0 && (
        <Section width="prose">
          <SectionHeading title={t('generalTitle')} />
          <div className="mt-10">
            <FaqList faqs={general} locale={locale} />
          </div>
        </Section>
      )}

      {groups.map(({ category, items }, index) => (
        <Section key={category.id} width="prose" raised={index % 2 === 0}>
          <SectionHeading title={category.title[locale]} />
          <div className="mt-10">
            <FaqList faqs={items} locale={locale} />
          </div>
        </Section>
      ))}

      {/* One FAQPage block for the page, built from the same list that was
          rendered above — see the note in FaqSchema. Emitted once at page
          level rather than per section, because a page is one FAQPage. */}
      <FaqSchema faqs={all} locale={locale} />

      <ClosingCta headline={t('closingHeadline')} lede={t('closingLede')} />
    </>
  );
}

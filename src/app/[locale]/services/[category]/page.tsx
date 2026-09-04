import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/layout/Section';
import { ClosingCta } from '@/components/layout/ClosingCta';
import { Breadcrumbs, BreadcrumbSchema } from '@/components/ui/Breadcrumbs';
import { FaqList, FaqSchema } from '@/components/ui/FaqList';
import { StatusMarker } from '@/components/dev/StatusMarker';
import { serviceCategories } from '@/content/services';
import { faqsForCategory } from '@/content/faqs';
import { publishableOnly } from '@/content/types';
import { absoluteUrl } from '@/lib/site';
import { locales, type Locale } from '@/i18n/routing';
import type { ServiceCategory } from '@/content/services';

/**
 * Three category pages, not twenty service pages.
 *
 * Each of the twenty services is a line item, not a topic — "changing a trade
 * name" does not carry a page of its own, and twenty thin pages competing for
 * the same queries is the classic way a small site loses to a big one. The
 * category is the unit a visitor actually searches for and the unit that has
 * enough to say.
 */

/** Slugs are identical across locales for v1 (see content/navigation.ts), so
 *  one set of params covers both. */
export function generateStaticParams() {
  return serviceCategories.map((c) => ({ category: c.slug.en }));
}

function findCategory(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((c) =>
    locales.some((locale) => c.slug[locale] === slug),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category: slug } = await params;
  const category = findCategory(slug);
  if (!category) return {};

  const l = locale as Locale;
  return {
    title: category.seo.title[l],
    description: category.seo.description[l],
    alternates: {
      canonical: `/${locale}/services/${category.slug[l]}`,
      languages: {
        en: `/en/services/${category.slug.en}`,
        ar: `/ar/services/${category.slug.ar}`,
        'x-default': `/en/services/${category.slug.en}`,
      },
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: slug } = await params;
  setRequestLocale(locale);
  const category = findCategory(slug);
  if (!category) notFound();
  return <CategoryDetail category={category} locale={locale as Locale} />;
}

function CategoryDetail({
  category,
  locale,
}: {
  category: ServiceCategory;
  locale: Locale;
}) {
  const t = useTranslations('categoryPage');
  const tn = useTranslations('nav');
  const ts = useTranslations('stages');
  const tcta = useTranslations('cta');

  const services = publishableOnly(category.services);
  const faqs = publishableOnly(faqsForCategory(category.id));
  const others = serviceCategories.filter((c) => c.id !== category.id);
  const href = `/services/${category.slug[locale]}`;

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: tn('home'), href: '/' },
              { label: tn('services'), href: '/services' },
              { label: category.title[locale] },
            ]}
          />
        }
        eyebrow={ts(category.stage)}
        title={category.title[locale]}
        lede={category.lede[locale]}
      >
        <p className="mt-8 max-w-[46ch] border-s-2 border-detail ps-4 type-small text-fg-60">
          <span className="block type-eyebrow text-detail-text">
            {t('audience')}
          </span>
          <span className="mt-2 block">{category.audience[locale]}</span>
        </p>
      </PageHero>

      <BreadcrumbSchema
        items={[
          { name: tn('home'), url: absoluteUrl(locale) },
          { name: tn('services'), url: absoluteUrl(locale, '/services') },
          { name: category.title[locale], url: absoluteUrl(locale, href) },
        ]}
      />

      {/* Numbered, because a category page's job is to let someone find their
          own case in a list — the number is a handle for "the fourth one down",
          which is how people refer to these on a phone call. */}
      <Section>
        <SectionHeading title={t('whatWeHandle')} />
        <ol className="mt-12 border-t border-edge">
          {services.map((service, i) => (
            <li key={service.id}>
              <StatusMarker record={service}>
                <div className="grid gap-x-6 gap-y-2 border-b border-edge-soft py-6 sm:grid-cols-[3rem_1fr]">
                  <span className="type-eyebrow text-fg-40 sm:pt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="type-display-3">{service.title[locale]}</h3>
                    <p className="mt-2 max-w-[62ch] type-small text-fg-60">
                      {service.summary[locale]}
                    </p>
                  </div>
                </div>
              </StatusMarker>
            </li>
          ))}
        </ol>
      </Section>

      {faqs.length > 0 && (
        <Section raised width="prose">
          <SectionHeading eyebrow={t('questionsEyebrow')} title={t('relatedQuestions')} />
          <div className="mt-10">
            <FaqList faqs={faqs} locale={locale} />
          </div>
          <Link
            href="/faq"
            className="mt-8 inline-flex min-h-6 items-center gap-2 type-eyebrow text-fg-60 transition-colors duration-200 hover:text-fg"
          >
            {t('allQuestions')}
            <span aria-hidden="true" className="rtl:-scale-x-100">
              &rarr;
            </span>
          </Link>
          <FaqSchema faqs={faqs} locale={locale} />
        </Section>
      )}

      <Section>
        <SectionHeading title={t('otherStages')} />
        <div className="mt-10 grid gap-px border border-edge bg-edge md:grid-cols-2">
          {others.map((other) => (
            <Link
              key={other.id}
              href={`/services/${other.slug[locale]}`}
              className="group flex flex-col bg-ground p-8 transition-colors duration-300 hover:bg-raised"
            >
              <span className="type-eyebrow text-accent-text">
                {ts(other.stage)}
              </span>
              <span className="mt-4 type-display-3">{other.title[locale]}</span>
              <span className="mt-3 type-small text-fg-60">
                {other.lede[locale]}
              </span>
              <span className="mt-auto pt-6 type-eyebrow text-fg-40 transition-colors duration-300 group-hover:text-fg">
                {tcta('viewServices')}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}

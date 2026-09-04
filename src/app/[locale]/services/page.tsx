import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { ClosingCta } from '@/components/layout/ClosingCta';
import { Breadcrumbs, BreadcrumbSchema } from '@/components/ui/Breadcrumbs';
import { StatusMarker } from '@/components/dev/StatusMarker';
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
  const t = await getTranslations({ locale, namespace: 'servicesPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/services`,
      languages: { en: '/en/services', ar: '/ar/services', 'x-default': '/en/services' },
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Services locale={locale as Locale} />;
}

function Services({ locale }: { locale: Locale }) {
  const t = useTranslations('servicesPage');
  const tn = useTranslations('nav');
  const ts = useTranslations('stages');
  const tcta = useTranslations('cta');
  const categories = publishableOnly(serviceCategories);

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: tn('home'), href: '/' }, { label: tn('services') }]}
          />
        }
        eyebrow={t('eyebrow')}
        title={t('headline')}
        lede={t('lede')}
      />

      <BreadcrumbSchema
        items={[
          { name: tn('home'), url: absoluteUrl(locale) },
          { name: tn('services'), url: absoluteUrl(locale, '/services') },
        ]}
      />

      {/* One band per category rather than three cards in a row. A category
          here is twenty lines of real service names, and the point of the
          overview is that a visitor can scan those names and recognise their
          own problem in one of them — which a card summarising them cannot
          do. The card version lives on the homepage, where brevity is the
          job. */}
      {categories.map((category, index) => {
        const services = publishableOnly(category.services);
        return (
          <Section key={category.id} raised={index % 2 === 1}>
            <StatusMarker record={category}>
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <p className="type-eyebrow text-accent-text">
                    {ts(category.stage)}
                  </p>
                  <h2 className="mt-4 type-display-2">{category.title[locale]}</h2>
                  <p className="mt-4 type-lede">{category.lede[locale]}</p>
                  <p className="mt-6 max-w-[38ch] type-small text-fg-40">
                    {category.audience[locale]}
                  </p>
                  <Link
                    href={`/services/${category.slug[locale]}`}
                    className="mt-8 inline-flex min-h-6 items-center gap-2 type-eyebrow text-fg transition-colors duration-200 hover:text-accent-text"
                  >
                    {tcta('viewServices')}
                    <span aria-hidden="true" className="rtl:-scale-x-100">
                      &rarr;
                    </span>
                  </Link>
                </div>

                <ul className="lg:col-span-7 lg:col-start-6">
                  {services.map((service) => (
                    <li key={service.id}>
                      <StatusMarker record={service}>
                        <div className="border-t border-edge-soft py-5">
                          <h3 className="type-body font-medium text-fg">
                            {service.title[locale]}
                          </h3>
                          <p className="mt-1.5 type-small text-fg-60">
                            {service.summary[locale]}
                          </p>
                        </div>
                      </StatusMarker>
                    </li>
                  ))}
                </ul>
              </div>
            </StatusMarker>
          </Section>
        );
      })}

      <ClosingCta />
    </>
  );
}

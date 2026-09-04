import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs, BreadcrumbSchema } from '@/components/ui/Breadcrumbs';
import { ContactForm } from './ContactForm';
import { company, formatAddress, channelHref } from '@/content/company';
import { absoluteUrl, siteUrl } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contactPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: '/en/contact', ar: '/ar/contact', 'x-default': '/en/contact' },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Contact locale={locale as Locale} />;
}

/**
 * LocalBusiness, built entirely from content/company.ts.
 *
 * Everything here is something the business has published about itself. There
 * is no `foundingDate` because nobody has given us one, and no
 * `aggregateRating` because there are no reviews — an invented value in either
 * would be a false claim in a machine-readable format, which is the worst
 * place to put one.
 */
function LocalBusinessSchema({ locale }: { locale: Locale }) {
  const a = company.address;
  const phone = company.channels.find((c) => c.kind === 'phone');
  const email = company.channels.find((c) => c.kind === 'email');
  const instagram = company.channels.find((c) => c.kind === 'instagram');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': `${siteUrl}/#organization`,
          name: company.displayName,
          url: absoluteUrl(locale),
          telephone: phone?.value,
          email: email?.value,
          address: {
            '@type': 'PostalAddress',
            streetAddress: `${a.place[locale]}, Building ${a.building}, Street ${a.street}, Zone ${a.zone}`,
            addressLocality: a.city[locale],
            addressCountry: a.countryCode,
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: company.hours.days,
            opens: company.hours.opens,
            closes: company.hours.closes,
          },
          sameAs: instagram ? [instagram.value] : undefined,
        }),
      }}
    />
  );
}

function Contact({ locale }: { locale: Locale }) {
  const t = useTranslations('contactPage');
  const tn = useTranslations('nav');
  const tf = useTranslations('footer');

  const contactable = company.channels.filter((c) => c.kind !== 'instagram');

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: tn('home'), href: '/' }, { label: tn('contact') }]}
          />
        }
        eyebrow={t('eyebrow')}
        title={t('headline')}
        lede={t('lede')}
      />

      <BreadcrumbSchema
        items={[
          { name: tn('home'), url: absoluteUrl(locale) },
          { name: tn('contact'), url: absoluteUrl(locale, '/contact') },
        ]}
      />
      <LocalBusinessSchema locale={locale} />

      <Section bordered={false}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="type-display-2">{t('formTitle')}</h2>
            <p className="mt-4 max-w-[52ch] type-lede">{t('formLede')}</p>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>

          {/* The direct channels sit beside the form, not under it. Plenty of
              people in this market would simply rather call, and burying the
              number below a form is a way of losing them. */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border-t border-edge pt-6">
              <h2 className="type-eyebrow text-fg-40">{tf('contact')}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {contactable.map((c) => (
                  <li key={c.value}>
                    <a
                      href={channelHref(c)}
                      dir={c.kind === 'email' ? undefined : 'ltr'}
                      className="inline-flex min-h-6 flex-col transition-colors duration-200 hover:text-accent-text"
                    >
                      <span className="type-eyebrow text-fg-40">
                        {c.label[locale]}
                      </span>
                      <span className="mt-1 type-body text-fg">{c.display}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-t border-edge pt-6">
              <h2 className="type-eyebrow text-fg-40">{tf('address')}</h2>
              <p className="mt-4 max-w-[30ch] type-small text-fg-60">
                {formatAddress(locale)}
              </p>
            </div>

            <div className="mt-10 border-t border-edge pt-6">
              <h2 className="type-eyebrow text-fg-40">{tf('hours')}</h2>
              <p className="mt-4 type-small text-fg-60">{tf('hoursValue')}</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

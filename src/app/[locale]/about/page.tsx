import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/layout/Section';
import { ClosingCta } from '@/components/layout/ClosingCta';
import { Breadcrumbs, BreadcrumbSchema } from '@/components/ui/Breadcrumbs';
import { StatusMarker } from '@/components/dev/StatusMarker';
import { serviceCategories } from '@/content/services';
import { processSteps } from '@/content/process';
import { company, formatAddress } from '@/content/company';
import { publishableOnly } from '@/content/types';
import { absoluteUrl } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

/**
 * What this page does NOT contain, and why.
 *
 * No founding year, no team size, no client names, no "trusted by" strip, no
 * years-of-experience number. Every one of those is still an open question
 * with the client (`company.founded` and `company.teamSize` are literally
 * `null`), and an About page is exactly where an invented one would look most
 * natural and do most damage.
 *
 * What is left is not thin, because the interesting thing about this business
 * is not how old it is — it is the claim that Start, Operate and Grow are one
 * relationship rather than three transactions. That claim is true of the
 * service list as published, so the page can make it honestly today, and the
 * history slots in above it the moment anyone supplies it.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: '/en/about', ar: '/ar/about', 'x-default': '/en/about' },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <About locale={locale as Locale} />;
}

function About({ locale }: { locale: Locale }) {
  const t = useTranslations('aboutPage');
  const tn = useTranslations('nav');
  const ts = useTranslations('stages');
  const tf = useTranslations('footer');
  const tcta = useTranslations('cta');
  const steps = publishableOnly(processSteps);

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: tn('home'), href: '/' }, { label: tn('about') }]}
          />
        }
        eyebrow={t('eyebrow')}
        title={t('headline')}
        lede={t('lede')}
      />

      <BreadcrumbSchema
        items={[
          { name: tn('home'), url: absoluteUrl(locale) },
          { name: tn('about'), url: absoluteUrl(locale, '/about') },
        ]}
      />

      <Section raised>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <SectionHeading
            className="lg:col-span-5"
            eyebrow={t('thesisEyebrow')}
            title={t('thesisTitle')}
          />
          <div className="max-w-[62ch] lg:col-span-6 lg:col-start-7">
            <p className="type-lede">{t('thesisBody')}</p>
            <p className="mt-6 type-body text-fg-60">{t('thesisBody2')}</p>
          </div>
        </div>

        <ol className="mt-14 grid gap-px border border-edge bg-edge md:grid-cols-3">
          {serviceCategories.map((category) => (
            <li key={category.id} className="flex flex-col bg-paper p-6 sm:p-8">
              <span className="type-eyebrow text-accent-text">
                {ts(category.stage)}
              </span>
              <h3 className="mt-4 type-display-3">{category.title[locale]}</h3>
              <p className="mt-3 type-small text-fg-60">{category.lede[locale]}</p>
              <Link
                href={`/services/${category.slug[locale]}`}
                className="mt-auto inline-flex min-h-6 items-center pt-6 type-eyebrow text-fg-40 transition-colors duration-200 hover:text-fg"
              >
                {tcta('viewServices')}
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      {steps.length > 0 && (
        <Section>
          <SectionHeading eyebrow={t('workEyebrow')} title={t('workTitle')} />
          <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step.id}>
                <StatusMarker record={step}>
                  <div className="border-t border-detail pt-5">
                    <span className="type-eyebrow text-accent-text">
                      0{step.index}
                    </span>
                    <h3 className="mt-3 type-display-3">{step.title[locale]}</h3>
                    <p className="mt-2 type-small text-fg-60">
                      {step.description[locale]}
                    </p>
                  </div>
                </StatusMarker>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* The old site sold "expert legal services" and called the team "legal
          experts". Saying the boundary out loud is not a disclaimer bolted on
          at the bottom — for a firm that deals with ministries on a client's
          behalf, knowing exactly where its authority stops is the thing that
          makes it trustworthy. So it gets a section, not a footnote. */}
      <Section raised>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <SectionHeading
            className="lg:col-span-5"
            eyebrow={t('scopeEyebrow')}
            title={t('scopeTitle')}
          />
          <div className="max-w-[62ch] lg:col-span-6 lg:col-start-7">
            <p className="type-body text-fg-60">{t('scopeBody')}</p>
            <p className="mt-6 border-s-2 border-detail ps-4 type-small text-fg-60">
              {tf('disclaimer')}
            </p>
          </div>
        </div>
      </Section>

      <Section bordered={false}>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border-t border-edge pt-6">
            <h2 className="type-eyebrow text-fg-40">{t('whereTitle')}</h2>
            <p className="mt-4 max-w-[30ch] type-small text-fg-60">
              {formatAddress(locale)}
            </p>
          </div>
          <div className="border-t border-edge pt-6">
            <h2 className="type-eyebrow text-fg-40">{tf('hours')}</h2>
            <p className="mt-4 type-small text-fg-60">{tf('hoursValue')}</p>
          </div>
          <div className="border-t border-edge pt-6">
            <h2 className="type-eyebrow text-fg-40">{t('nameTitle')}</h2>
            <p className="mt-4 max-w-[34ch] type-small text-fg-60">
              {t('nameBody', { name: company.displayName })}
            </p>
          </div>
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}

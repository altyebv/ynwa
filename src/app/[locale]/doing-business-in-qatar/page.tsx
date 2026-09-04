import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/layout/Section';
import { ClosingCta } from '@/components/layout/ClosingCta';
import { Breadcrumbs, BreadcrumbSchema } from '@/components/ui/Breadcrumbs';
import { StatusMarker } from '@/components/dev/StatusMarker';
import {
  qatarFacts,
  licensingRoutes,
  investQatarStages,
  investQatarStagesSource,
} from '@/content/qatar';
import { publishableOnly } from '@/content/types';
import { absoluteUrl } from '@/lib/site';
import type { Source } from '@/content/types';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'qatarPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/doing-business-in-qatar`,
      languages: {
        en: '/en/doing-business-in-qatar',
        ar: '/ar/doing-business-in-qatar',
        'x-default': '/en/doing-business-in-qatar',
      },
    },
  };
}

export default async function QatarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Qatar locale={locale as Locale} />;
}

/** Host and path of a source URL, for telling same-named sources apart. */
function sourcePath(url: string): string {
  try {
    const u = new URL(url);
    return u.host.replace(/^www\./, '') + (u.pathname === '/' ? '' : u.pathname);
  } catch {
    return url;
  }
}

/** Every citation on the page, de-duplicated by URL, for the sources list. */
function collectSources(): Source[] {
  const seen = new Map<string, Source>();
  for (const source of [
    ...qatarFacts.flatMap((f) => f.sources ?? []),
    ...licensingRoutes.flatMap((r) => r.sources),
    investQatarStagesSource,
  ]) {
    if (!seen.has(source.url)) seen.set(source.url, source);
  }
  return [...seen.values()];
}

function Qatar({ locale }: { locale: Locale }) {
  const t = useTranslations('qatarPage');
  const tn = useTranslations('nav');

  const facts = publishableOnly(qatarFacts);
  const routes = publishableOnly(licensingRoutes);
  const sources = collectSources();

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: tn('home'), href: '/' }, { label: tn('qatar') }]}
          />
        }
        eyebrow={t('eyebrow')}
        title={t('headline')}
        lede={t('lede')}
      />

      <BreadcrumbSchema
        items={[
          { name: tn('home'), url: absoluteUrl(locale) },
          { name: tn('qatar'), url: absoluteUrl(locale, '/doing-business-in-qatar') },
        ]}
      />

      <Section raised>
        <SectionHeading eyebrow={t('factsEyebrow')} title={t('factsTitle')} />
        <dl className="hairline-grid mt-12">
          {facts.map((fact) => (
            <StatusMarker key={fact.id} record={fact}>
              <div className="flex h-full flex-col bg-paper p-5 sm:p-6">
                <dt className="type-eyebrow text-fg-40">{fact.label[locale]}</dt>
                <dd className="mt-auto pt-3 type-stat">{fact.value[locale]}</dd>
              </div>
            </StatusMarker>
          ))}
        </dl>
        <p className="mt-6 type-small text-fg-40">{t('factsNote')}</p>
      </Section>

      {/* The reason this page exists.
          "Which platform do I register on" is the first real decision anyone
          entering this market faces, the four routes are genuinely different
          legal environments rather than four prices, and almost nobody sets
          them out plainly. Every route below is cited, and the one YNWA has
          not confirmed it works with says so rather than being quietly
          implied. */}
      <Section>
        <SectionHeading
          eyebrow={t('routesEyebrow')}
          title={t('routesTitle')}
          lede={t('routesLede')}
        />
        <ol className="mt-12 grid gap-px border border-edge bg-edge md:grid-cols-2">
          {routes.map((route, i) => (
            <li key={route.id} className="flex flex-col bg-ground p-6 sm:p-8">
              <StatusMarker record={route}>
                <p className="type-eyebrow text-fg-40">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 type-display-3">{route.name[locale]}</h3>
                <p className="mt-3 type-small text-fg-60">{route.summary[locale]}</p>
                {/* mt-auto: the summaries are different lengths and these
                    tags are the thing a reader scans down the column for. */}
                <p
                  className={
                    route.ynwaHandles === 'yes'
                      ? 'mt-auto pt-6 type-eyebrow text-accent-text'
                      : 'mt-auto pt-6 type-eyebrow text-fg-40'
                  }
                >
                  {route.ynwaHandles === 'yes'
                    ? t('routeHandled')
                    : t('routeAskUs')}
                </p>
              </StatusMarker>
            </li>
          ))}
        </ol>
      </Section>

      {/* Attributed to Invest Qatar, and labelled as theirs. It is a useful
          spine and it is not ours to present as our own method — the four-step
          account of how YNWA works lives on the homepage. */}
      <Section raised>
        <SectionHeading
          eyebrow={t('stagesEyebrow')}
          title={t('stagesTitle')}
          lede={t('stagesLede')}
        />
        <ol className="mt-12 grid gap-px border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-5">
          {investQatarStages.map((stage, i) => (
            <li key={stage.id} className="flex h-full flex-col bg-paper p-5 sm:p-6">
              <span className="type-eyebrow text-accent-text">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="mt-auto pt-4 type-body font-medium text-fg">
                {stage.label[locale]}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-6 type-small text-fg-40">{t('stagesNote')}</p>
      </Section>

      {/* A claim about another country's law with no source attached is an
          opinion. Every figure above is listed here with the date it was last
          checked, so a reader can go and disagree with the primary source
          rather than with us. */}
      <Section bordered={false} width="prose">
        <SectionHeading title={t('sourcesTitle')} lede={t('sourcesLede')} />
        <ul className="mt-10 border-t border-edge">
          {sources.map((source) => (
            <li
              key={source.url}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-edge-soft py-4"
            >
              {/* The label alone is not enough: three of these are Invest
                  Qatar, and a list of three identical names reads as a
                  mistake. The path is what tells them apart. */}
              <a
                href={source.url}
                rel="noreferrer noopener nofollow"
                target="_blank"
                className="group inline-flex min-h-6 flex-col gap-0.5 type-small text-fg-60 transition-colors duration-200 hover:text-fg"
              >
                <span className="underline decoration-edge underline-offset-4 group-hover:decoration-fg-40">
                  {source.label}
                </span>
                <span dir="ltr" className="font-mono text-[0.6875rem] text-fg-40">
                  {sourcePath(source.url)}
                </span>
              </a>
              <span dir="ltr" className="font-mono text-[0.75rem] text-fg-40">
                {t('checkedOn', { date: source.checked })}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <ClosingCta />
    </>
  );
}

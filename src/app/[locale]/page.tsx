import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Chevron } from '@/components/ui/Chevron';
import { StatusMarker } from '@/components/dev/StatusMarker';
import { ClosingCta } from '@/components/layout/ClosingCta';
import { serviceCategories } from '@/content/navigation';
import { Link } from '@/i18n/navigation';
import { publishableOnly } from '@/content/types';
import { processSteps } from '@/content/process';
import { qatarFacts } from '@/content/qatar';
import { featuredFaqs } from '@/content/faqs';
import type { Locale } from '@/i18n/routing';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Home locale={locale as Locale} />;
}

function Home({ locale }: { locale: Locale }) {
  const t = useTranslations('hero');
  const tcta = useTranslations('cta');
  const ts = useTranslations('stages');
  const tc = useTranslations('categories');
  const tp = useTranslations('process');
  const tq = useTranslations('qatarFacts');
  const tf = useTranslations('faq');

  const steps = publishableOnly(processSteps);
  const facts = publishableOnly(qatarFacts);
  const faqItems = publishableOnly(featuredFaqs);
  // Structured data must match what a visitor can actually read on this page
  // — not the whole bank in content/faqs.ts, and not an item that is only
  // publishable() in development. Filtering the already-rendered list keeps
  // that true by construction rather than by remembering to keep two lists
  // in sync.
  const faqSchema = faqItems.filter((faq) => faq.schemaEligible);

  return (
    <>
      {/* ---- hero ------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-edge">
        <div className="lattice" aria-hidden="true" />
        <Container className="relative py-24 md:py-32 lg:py-40">
          <p className="type-eyebrow text-detail-text">{t('eyebrow')}</p>
          <h1 className="mt-6 max-w-[18ch] type-display-1">{t('headline')}</h1>
          <p className="mt-7 max-w-[54ch] type-lede">{t('lede')}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact" size="lg">
              {tcta('primary')}
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              {tcta('secondary')}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* ---- start / operate / grow ------------------------------------- */}
      <section className="border-b border-edge">
        <Container className="py-20 md:py-28">
          <div className="grid gap-px border border-edge bg-edge md:grid-cols-3">
            {serviceCategories.map((category) => (
              <Link
                key={category.key}
                href={category.href}
                className="group flex flex-col bg-ground p-8 transition-colors duration-300 hover:bg-raised"
              >
                <span className="type-eyebrow text-accent-text">
                  {ts(category.stage)}
                </span>
                <span className="mt-4 type-display-3">{tc(category.key)}</span>
                <span className="mt-3 type-small text-fg-60">
                  {tc(`${category.key}Summary`)}
                </span>
                {/* mt-auto, not mt-6: the summaries are different lengths, so
                    a fixed top margin leaves this sitting at a different height
                    in each card. */}
                <span className="mt-auto pt-6 type-eyebrow text-fg-40 transition-colors duration-300 group-hover:text-fg">
                  {tcta('viewServices')}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- how it works --------------------------------------------------
          All four steps are `placeholder` (content/process.ts) — this
          describes how a competent firm of this kind works, not yet how YNWA
          specifically works. publishableOnly() renders the section in
          development, with a marker on each step, and removes it from
          production until the client replaces it with their own account.
          Same mechanism the phase-A scaffold used; this time the shape
          underneath is the real design, ready to go live the moment the
          content is. ------------------------------------------------------ */}
      {steps.length > 0 && (
        <section className="border-b border-edge">
          <Container className="py-20 md:py-28">
            <div className="max-w-[46ch]">
              <p className="type-eyebrow text-detail-text">{tp('eyebrow')}</p>
              <h2 className="mt-4 type-display-2">{tp('headline')}</h2>
            </div>
            <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
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
          </Container>
        </section>
      )}

      {/* ---- doing business in Qatar ----------------------------------------
          Every figure is cited to Invest Qatar in content/qatar.ts — public,
          attributed facts, never presented as YNWA's own advice or claim. */}
      {facts.length > 0 && (
        <section className="border-b border-edge bg-raised">
          <Container className="py-20 md:py-28">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[46ch]">
                <p className="type-eyebrow text-detail-text">{tq('eyebrow')}</p>
                <h2 className="mt-4 type-display-2">{tq('headline')}</h2>
              </div>
              <ButtonLink
                href="/doing-business-in-qatar"
                variant="secondary"
                className="self-start md:self-auto"
              >
                {tq('cta')}
              </ButtonLink>
            </div>
            {/* `hairline-grid` (globals.css) owns the columns, the 1px rules
                and — the part that matters here — stretching the last tile
                across the remainder of its row. Five facts in two columns
                would otherwise leave half a cell of bare rule colour on every
                phone. The value is `type-stat`, not `type-display-3`: these
                tiles get down to about 95px of content on a small phone, which
                display-3's 24px floor overruns. */}
            <dl className="hairline-grid mt-14">
              {facts.map((fact) => (
                <StatusMarker key={fact.id} record={fact}>
                  <div className="flex h-full flex-col bg-paper p-5 sm:p-6">
                    <dt className="type-eyebrow text-fg-40">{fact.label[locale]}</dt>
                    {/* A one-line label and a two-line label otherwise put their
                        figures on different baselines across the row. */}
                    <dd className="mt-auto pt-3 type-stat">{fact.value[locale]}</dd>
                  </div>
                </StatusMarker>
              ))}
            </dl>
            <p className="mt-6 type-small text-fg-40">{tq('sourceNote')}</p>
          </Container>
        </section>
      )}

      {/* ---- FAQ -------------------------------------------------------------
          The FAQPage script below covers exactly the items rendered here,
          filtered again to `schemaEligible` — Google's structured-data
          guidance requires the markup to match what a visitor can read on the
          page, so it is built from the same list rather than the full bank in
          content/faqs.ts. ---------------------------------------------------- */}
      {faqItems.length > 0 && (
        <section className="border-b border-edge">
          <Container width="prose" className="py-20 md:py-28">
            <p className="type-eyebrow text-detail-text">{tf('eyebrow')}</p>
            <h2 className="mt-4 type-display-2">{tf('headline')}</h2>
            <div className="mt-12 border-t border-edge">
              {faqItems.map((faq) => (
                <StatusMarker key={faq.id} record={faq}>
                  <details className="group border-b border-edge-soft py-2">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
                      <span className="type-body font-medium text-fg">
                        {faq.question[locale]}
                      </span>
                      <Chevron className="text-fg-40 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <p className="pb-4 type-small text-fg-60">{faq.answer[locale]}</p>
                  </details>
                </StatusMarker>
              ))}
            </div>
            {/* -ms-4 cancels the quiet variant's own inline padding so the
                label sits on the text column's edge, not 16px inside it. */}
            <ButtonLink href="/faq" variant="quiet" className="mt-8 -ms-4">
              {tf('viewAll')}
            </ButtonLink>
          </Container>

          {faqSchema.length > 0 && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faqSchema.map((faq) => ({
                    '@type': 'Question',
                    name: faq.question[locale],
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: faq.answer[locale],
                    },
                  })),
                }),
              }}
            />
          )}
        </section>
      )}

      <ClosingCta />
    </>
  );
}

import { Chevron } from '@/components/ui/Chevron';
import { StatusMarker } from '@/components/dev/StatusMarker';
import type { Faq } from '@/content/faqs';
import type { Locale } from '@/i18n/routing';

/**
 * A list of questions as native `<details>` disclosures.
 *
 * Native rather than a JS accordion on purpose: it opens with no hydration, it
 * is keyboard-operable and announced correctly for free, and the browser's own
 * find-in-page can open a closed answer to show a match. There is nothing a
 * custom implementation would add here except a dependency and a bug.
 */
export function FaqList({
  faqs,
  locale,
}: {
  faqs: Faq[];
  locale: Locale;
}) {
  return (
    <div className="border-t border-edge">
      {faqs.map((faq) => (
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
  );
}

/**
 * FAQPage structured data for a list of questions.
 *
 * Two filters, and both matter. `schemaEligible` is the content layer's own
 * judgement about whether an answer is sourced or client-confirmed; passing
 * the ALREADY-RENDERED list in is what guarantees the markup describes what a
 * visitor can actually read on the page, which is what Google's guidance
 * requires. Build this from a wider list and the two drift the first time
 * someone changes what the page shows.
 */
export function FaqSchema({ faqs, locale }: { faqs: Faq[]; locale: Locale }) {
  const eligible = faqs.filter((f) => f.schemaEligible);
  if (eligible.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: eligible.map((faq) => ({
            '@type': 'Question',
            name: faq.question[locale],
            acceptedAnswer: { '@type': 'Answer', text: faq.answer[locale] },
          })),
        }),
      }}
    />
  );
}

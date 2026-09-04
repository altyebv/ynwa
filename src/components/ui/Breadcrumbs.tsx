import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Trail above a page title, for routes more than one level deep.
 *
 * The separator is a slash in a `span` rather than a CSS `::before`, so it is
 * part of the text a screen reader can skip over as punctuation, and it
 * mirrors correctly because the whole list is laid out with logical
 * properties. The final crumb is the current page and is not a link.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const ta = useTranslations('a11y');

  return (
    <nav aria-label={ta('breadcrumb')} className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 type-eyebrow text-fg-40">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-x-2">
            {item.href ? (
              <Link
                href={item.href}
                // An 11px eyebrow line is a 15px-tall target. min-h-6 brings it
                // to the 24px WCAG 2.2 AA minimum (2.5.8) without changing how
                // the trail looks.
                className="inline-flex min-h-6 items-center transition-colors duration-200 hover:text-fg"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className="inline-flex min-h-6 items-center text-fg-60"
              >
                {item.label}
              </span>
            )}
            {i < items.length - 1 && (
              <span aria-hidden="true" className="text-fg-20">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * BreadcrumbList structured data. Takes absolute URLs, because Google reads
 * this out of context and a relative path there means nothing.
 */
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: item.url,
          })),
        }),
      }}
    />
  );
}

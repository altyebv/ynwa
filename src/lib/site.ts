import type { Locale } from '@/i18n/routing';

const DEFAULT_SITE_URL = 'https://ynwas.com';

/**
 * Accepts what people actually put in an env file — with or without a scheme,
 * with or without a trailing path — and returns a bare origin, or the default
 * if the value cannot be parsed at all. A malformed NEXT_PUBLIC_SITE_URL
 * should not be able to take the build down or, worse, quietly emit canonical
 * URLs pointing at nothing.
 */
function resolveSiteUrl(value: string | undefined): string {
  if (!value) return DEFAULT_SITE_URL;
  try {
    return new URL(value).origin;
  } catch {
    try {
      return new URL(`https://${value}`).origin;
    } catch {
      return DEFAULT_SITE_URL;
    }
  }
}

/** Origin of the deployed site. */
export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL?.trim());

/**
 * Absolute, locale-prefixed URL for a route.
 *
 * Structured data is read out of the page's context, so `item` in a
 * BreadcrumbList or `url` in a LocalBusiness has to be absolute — a relative
 * path there is silently meaningless. Pass the same `href` used with the
 * locale-aware `Link` and this adds the origin and the locale prefix.
 */
export function absoluteUrl(locale: Locale, path = '/'): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}/${locale}${clean}`;
}

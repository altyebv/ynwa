import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Locale negotiation. Next 16 renamed the `middleware` file convention to
 * `proxy`; the handler itself is unchanged.
 */
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};

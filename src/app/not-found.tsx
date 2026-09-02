import { routing } from '@/i18n/routing';

/**
 * Reached only for paths the locale middleware could not resolve at all.
 * It sits outside [locale], so it owns its own document.
 */
export default function RootNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          background: '#faf8f4',
          color: '#16181c',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.11em' }}>
            404
          </p>
          <p style={{ margin: '0.75rem 0 1.5rem', fontSize: '1.25rem' }}>
            Page not found
          </p>
          <a href={`/${routing.defaultLocale}`} style={{ color: '#8a1538' }}>
            Back to home
          </a>
        </div>
      </body>
    </html>
  );
}

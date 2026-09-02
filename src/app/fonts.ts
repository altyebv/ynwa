import localFont from 'next/font/local';

/**
 * Four families across two scripts, vendored into src/fonts as woff2 and
 * loaded with next/font/local.
 *
 * Vendored rather than pulled from Google at build time on purpose: the build
 * needs no network, the exact bytes are pinned in the repo, and each file is
 * already subset to the one script that uses it. Latin pages never download
 * the Arabic faces and Arabic pages never download the Latin ones, because the
 * family only resolves through the CSS variables swapped in globals.css.
 *
 * Display  Newsreader / Noto Naskh Arabic
 *   Both are moderate-contrast editorial faces with a newspaper rather than a
 *   fashion voice. They sit at similar weight and colour on the page, which is
 *   what makes a bilingual headline look like one design instead of two.
 *
 * Text     IBM Plex Sans / IBM Plex Sans Arabic
 *   One superfamily, drawn together. Deliberately sidesteps Cairo and Tajawal,
 *   which are common enough in Gulf marketing to read as a default.
 *
 * Data     IBM Plex Mono (Latin only)
 *   Reference numbers, phone numbers, entity codes, table labels.
 *
 * Sources: fontsource (SIL Open Font License 1.1 for all four families).
 */

export const newsreader = localFont({
  src: [
    {
      path: '../fonts/newsreader-latin-wght-normal.woff2',
      weight: '200 800',
      style: 'normal',
    },
  ],
  variable: '--font-newsreader',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const naskh = localFont({
  src: [
    {
      path: '../fonts/noto-naskh-arabic-arabic-wght-normal.woff2',
      weight: '400 700',
      style: 'normal',
    },
  ],
  variable: '--font-naskh',
  display: 'swap',
  fallback: ['Segoe UI', 'Tahoma', 'serif'],
});

export const plexSans = localFont({
  src: [
    { path: '../fonts/ibm-plex-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/ibm-plex-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/ibm-plex-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-plex-sans',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const plexArabic = localFont({
  src: [
    { path: '../fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-plex-arabic',
  display: 'swap',
  fallback: ['Segoe UI', 'Tahoma', 'sans-serif'],
});

export const plexMono = localFont({
  src: [
    { path: '../fonts/ibm-plex-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/ibm-plex-mono-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-plex-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

export const fontVariables = [
  newsreader.variable,
  naskh.variable,
  plexSans.variable,
  plexArabic.variable,
  plexMono.variable,
].join(' ');

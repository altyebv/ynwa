import { cn } from '@/lib/cn';

/**
 * YNWA identity.
 *
 * The mark is three concentric figures on the mashrabiya diamond — the same
 * geometry as the lattice motif in globals.css, so the logo and the site's
 * texture are demonstrably one system rather than two decisions.
 *
 * It reads as a seal or an aperture, and the three figures are the three
 * stages of the proposition:
 *
 *   outer diamond   Start     the market, entered from outside
 *   inner diamond   Operate   the company inside it
 *   solid square    Grow      the settled, registered form — the only
 *                             axis-aligned figure in the mark, because
 *                             squared-away is the whole point of the service
 *
 * Monochrome by default (`currentColor`) so it works in ink, in the accent, on
 * a dark ground, in a fax, and at 16px. The `accent` variant tints only the
 * innermost square, which is the one element that survives at favicon size.
 */
export function Mark({
  className,
  accent = false,
}: {
  className?: string;
  accent?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="presentation"
      aria-hidden="true"
      className={cn('h-8 w-8', className)}
      fill="none"
    >
      <path
        d="M16 1.6 30.4 16 16 30.4 1.6 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
      <path
        d="M16 7 25 16 16 25 7 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
      <rect
        x="12.5"
        y="12.5"
        width="7"
        height="7"
        fill={accent ? 'var(--color-accent)' : 'currentColor'}
      />
    </svg>
  );
}

/**
 * Set, not drawn. Newsreader at 500 with wide tracking reads as an institution
 * rather than a startup, and keeping it as live text means it stays crisp at
 * every size and inherits the theme without a second asset.
 *
 * `font-wordmark`, not `font-display`: the display face swaps to Noto Naskh on
 * Arabic pages, and Naskh has Latin glyphs of its own, so the wordmark would
 * silently be set in a different serif on /ar. A wordmark is a fixed object.
 *
 * Latin in both locales on purpose: the mark is the mark. If the client has an
 * established Arabic name, an Arabic lockup sits beside this rather than
 * replacing it — transliterating "YNWA" into Arabic script would read as a
 * foreign company badly localised, which is the opposite of the goal.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-wordmark text-[1.375rem] leading-none font-medium tracking-[0.16em] text-fg',
        className,
      )}
      dir="ltr"
    >
      YNWA
    </span>
  );
}

/** Mark and wordmark locked up. Always ltr — a logo does not mirror. */
export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)} dir="ltr">
      <Mark className={cn('h-7 w-7 text-accent', markClassName)} />
      <Wordmark />
    </span>
  );
}

import { cn } from '@/lib/cn';

/**
 * Provisional wordmark.
 *
 * Set rather than drawn, because the canonical name is still open — ynwas.com
 * uses "Ynwa", "YNWA" and "Ynwas", and the Instagram handle is
 * @yanwaservices. Once the client settles it, this becomes an SVG and nothing
 * else in the codebase changes.
 *
 * Latin in both locales on purpose: the mark is the mark. Arabic pages will
 * carry an Arabic lockup alongside it if the client has one.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-display text-[1.375rem] leading-none font-medium tracking-[0.14em] text-ink',
        className,
      )}
      dir="ltr"
    >
      YNWA
    </span>
  );
}

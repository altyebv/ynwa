import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';

/**
 * The opening block of every page that is not the homepage.
 *
 * It carries the lattice, which is otherwise reserved for the homepage hero
 * and the closing call to action — the motif marks the start and end of a
 * document, so an interior page gets it once, at the top, and once more from
 * `ClosingCta` at the bottom. Nowhere in between.
 *
 * `eyebrow` is where the page says what kind of thing it is, `lede` is one
 * sentence of what it covers. Both are optional, but a page with neither is
 * usually a page that has not decided what it is for.
 */
export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  lede,
  children,
}: {
  /** The trail. Rendered above everything — it is where the reader is, and
   *  that belongs before what they are reading, not after it. */
  breadcrumbs?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  /** Anything below the lede: an audience note, actions, a source line. */
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-edge">
      <div className="lattice" aria-hidden="true" />
      <Container className="relative py-14 md:py-20 lg:py-24">
        {breadcrumbs}
        {eyebrow && <p className="type-eyebrow text-detail-text">{eyebrow}</p>}
        <h1 className="mt-5 max-w-[20ch] type-display-1">{title}</h1>
        {lede && <p className="mt-6 max-w-[58ch] type-lede">{lede}</p>}
        {children}
      </Container>
    </section>
  );
}

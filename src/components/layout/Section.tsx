import type { ElementType, ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';

/**
 * A band of the page: full-bleed background, hairline underneath, contained
 * content, consistent vertical rhythm.
 *
 * Every page section on the site is one of these, so the spacing between bands
 * is decided once here rather than re-typed as `py-20 md:py-28` in a dozen
 * files that will eventually disagree with each other.
 */
export function Section({
  children,
  raised = false,
  bordered = true,
  width,
  className,
  as: Tag = 'section',
  id,
}: {
  children: ReactNode;
  /** Sits the band on the raised surface, for alternating bands. */
  raised?: boolean;
  bordered?: boolean;
  width?: 'content' | 'prose' | 'shell';
  className?: string;
  as?: ElementType;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn(bordered && 'border-b border-edge', raised && 'bg-raised')}
    >
      <Container width={width} className={cn('py-16 md:py-24', className)}>
        {children}
      </Container>
    </Tag>
  );
}

/**
 * The heading pair that opens a section — eyebrow above, display heading
 * below. Constrained to a readable measure by default; `wide` opts out for the
 * cases where the heading sits beside something else.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('max-w-[46ch]', className)}>
      {eyebrow && <p className="type-eyebrow text-detail-text">{eyebrow}</p>}
      <h2 className={cn('type-display-2', eyebrow ? 'mt-4' : undefined)}>{title}</h2>
      {lede && <p className="mt-4 type-lede">{lede}</p>}
    </div>
  );
}

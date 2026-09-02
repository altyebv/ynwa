import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'quiet';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xs font-medium ' +
  'transition-[background-color,color,border-color] duration-200 ' +
  'ease-[var(--ease-institutional)] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-text ' +
  'disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  // The accent appears here and on active states. Nowhere large.
  primary: 'bg-accent text-on-accent hover:bg-accent-strong',
  secondary:
    'border border-fg/25 text-fg hover:border-fg hover:bg-raised',
  quiet: 'text-fg-60 hover:text-fg hover:bg-raised',
};

const sizes: Record<Size, string> = {
  md: 'h-10 px-4 text-[0.9375rem]',
  lg: 'h-12 px-6 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps &
  Omit<ComponentProps<'button'>, 'className' | 'children'>;

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps &
  Omit<ComponentProps<typeof Link>, 'className' | 'children'>;

/** Same surface as Button, routed through the locale-aware Link. */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}

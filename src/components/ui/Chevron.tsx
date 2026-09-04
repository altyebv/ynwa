import { cn } from '@/lib/cn';

/**
 * Small directional indicator for disclosure controls — the services
 * dropdown, the FAQ accordion. Pure presentation, no state of its own: the
 * parent rotates it with a `group-open:` / conditional class.
 */
export function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={cn('h-3 w-3 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 4.5 6 7.5 9 4.5" />
    </svg>
  );
}

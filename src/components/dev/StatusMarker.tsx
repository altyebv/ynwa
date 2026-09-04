import type { ReactNode } from 'react';
import type { Verifiable } from '@/content/types';
import { needsMarker } from '@/content/types';

/**
 * Development-only visibility for a `placeholder` or `blocked` content
 * record — the "dotted outline + status tag" the content model promises in
 * `src/content/types.ts`.
 *
 * `needsMarker()` is NODE_ENV-gated, so this is a plain passthrough in a
 * production build: no extra markup, no extra CSS reaching a visitor. What
 * actually keeps a `blocked` record off a live page is `publishable()` /
 * `publishableOnly()` upstream, filtering it out of the list before it ever
 * gets here — this component only ever has to decide whether to *label*
 * something that already made it through that gate, never whether to hide
 * it. Wrap one rendered record at a time; it is not a list wrapper.
 */
export function StatusMarker({
  record,
  children,
}: {
  record: Verifiable;
  children: ReactNode;
}) {
  if (!needsMarker(record)) return <>{children}</>;

  return (
    <div className="relative outline-dashed outline-1 outline-offset-4 outline-detail/50">
      <span
        className="absolute -top-2.5 start-3 bg-ground px-1.5 font-mono text-[0.5625rem] tracking-[0.08em] text-detail-text uppercase"
        title={record.note}
      >
        {record.status}
      </span>
      {children}
    </div>
  );
}

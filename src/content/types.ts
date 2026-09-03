import type { Locale } from '@/i18n/routing';

/** Every user-facing string exists in both languages or it does not exist. */
export type L<T = string> = Record<Locale, T>;

/**
 * Verification status, carried by every content record.
 *
 * The brief forbids inventing business facts — clients, testimonials,
 * certifications, years of experience, timelines, pricing, guarantees. This
 * field is how that becomes a property of the build rather than a habit
 * someone has to remember.
 *
 *   confirmed    the client verified it, or it is cited to a primary source.
 *                Safe to publish.
 *   derived      taken verbatim from the existing ynwas.com. Publishable, but
 *                worth a second look before launch — the old site has its own
 *                errors, and repeating them is not the same as verifying them.
 *   placeholder  written by us to hold a shape. Renders in development with a
 *                visible marker, disappears in production.
 *   blocked      needs a fact nobody has given us. Never renders, and the
 *                production build fails if a live route can reach it.
 */
export type Status = 'confirmed' | 'derived' | 'placeholder' | 'blocked';

export interface Verifiable {
  status: Status;
  /** Why this status, or what specifically is still needed. */
  note?: string;
}

/** A primary source. Anything asserted about Qatar carries one. */
export interface Source {
  label: string;
  url: string;
  /** When the claim was last checked against the source. */
  checked: string;
}

/** True when a record may appear on a production page. */
export function publishable(record: Verifiable): boolean {
  if (record.status === 'blocked') return false;
  if (record.status === 'placeholder') {
    return process.env.NODE_ENV !== 'production';
  }
  return true;
}

/** Narrows a list to what may be rendered, preserving order. */
export function publishableOnly<T extends Verifiable>(records: readonly T[]): T[] {
  return records.filter(publishable);
}

/** True when the record should render with a visible development marker. */
export function needsMarker(record: Verifiable): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    (record.status === 'placeholder' || record.status === 'blocked')
  );
}

export type JourneyStage = 'start' | 'operate' | 'grow';

export type ServiceCategoryId =
  | 'company-formation'
  | 'pro-services'
  | 'corporate-services';

export interface ContactChannel {
  kind: 'phone' | 'mobile' | 'email' | 'whatsapp' | 'instagram';
  /** Exactly as it should be dialled, mailed or linked. */
  value: string;
  /** As it should be displayed. */
  display: string;
  label: L;
}

import type { L, Verifiable } from './types';

/**
 * Social proof.
 *
 * This file ships empty, and that is the point.
 *
 * The brief forbids inventing clients, testimonials, logos, awards and success
 * rates, and the old site already shows what happens when a proof section
 * exists without proof: ynwas.com renders the heading "Our Happy Clients!"
 * above nothing at all. An empty boast is worse than silence — it tells a
 * serious visitor that nobody finished the page.
 *
 * So the components are built and the arrays are empty, and every consumer of
 * this file must return `null` on an empty array rather than render a heading.
 * `hasProof()` exists to make that check impossible to forget.
 *
 * One real testimonial with a name and a company outperforms twenty invented
 * ones, and is the only kind that will ever go in here.
 */

export interface Testimonial extends Verifiable {
  id: string;
  quote: L;
  /** Real name. No initials, no "a client in Doha". */
  author: string;
  role: L;
  company: string;
  /** Written permission to publish, on file. */
  consent: boolean;
}

export interface ClientLogo extends Verifiable {
  id: string;
  name: string;
  src: string;
  consent: boolean;
}

export interface Stat extends Verifiable {
  id: string;
  value: L;
  label: L;
  /** How the number is arrived at. A statistic without a definition is a claim. */
  basis: string;
}

export const testimonials: Testimonial[] = [];
export const clientLogos: ClientLogo[] = [];

/**
 * Deliberately empty. Candidate figures once the client provides them: years in
 * operation, companies formed, registrations renewed, team size. Each needs a
 * `basis` before it can be published — "500+ clients" with no definition of
 * client is the kind of number that erodes the trust it was meant to build.
 */
export const stats: Stat[] = [];

export function hasProof(): boolean {
  return testimonials.length > 0 || clientLogos.length > 0 || stats.length > 0;
}

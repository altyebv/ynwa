import type { JourneyStage } from './types';

/**
 * Route structure. Labels live in messages/{en,ar}.json under `nav` and
 * `categories`, so this file stays language-free and the two never drift.
 *
 * Arabic uses the same Latin slugs for v1. Arabic-script URLs percent-encode
 * into unreadable strings when shared in WhatsApp, which is how this market
 * shares links. The content model carries a per-locale slug field, so
 * switching later is data rather than a refactor.
 */

export interface NavChild {
  /** Key under `categories` in the message files. */
  key: string;
  href: string;
  stage: JourneyStage;
}

export interface NavItem {
  /** Key under `nav` in the message files. */
  key: string;
  href: string;
  children?: NavChild[];
}

export const serviceCategories: NavChild[] = [
  { key: 'companyFormation', href: '/services/company-formation', stage: 'start' },
  { key: 'proServices', href: '/services/pro-services', stage: 'operate' },
  { key: 'corporateServices', href: '/services/corporate-services', stage: 'grow' },
];

export const primaryNav: NavItem[] = [
  { key: 'services', href: '/services', children: serviceCategories },
  { key: 'qatar', href: '/doing-business-in-qatar' },
  { key: 'about', href: '/about' },
  { key: 'insights', href: '/insights' },
  { key: 'contact', href: '/contact' },
];

export const footerNav: NavItem[] = [
  { key: 'services', href: '/services' },
  { key: 'qatar', href: '/doing-business-in-qatar' },
  { key: 'about', href: '/about' },
  { key: 'faq', href: '/faq' },
  { key: 'insights', href: '/insights' },
  { key: 'contact', href: '/contact' },
];

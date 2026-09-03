import type { L, Status, ContactChannel } from './types';

/**
 * One source of truth for who and where YNWA is.
 *
 * The footer, the contact page, the closing call to action and the
 * LocalBusiness structured data all read from here, so the schema Google sees
 * cannot drift from what the page says.
 *
 * Every value below is taken verbatim from the existing ynwas.com and is
 * marked accordingly. Anything the client has not given us is absent rather
 * than guessed.
 */

interface CompanyRecord {
  /** Settled: YNWA. See the note on the record. */
  legalName: { value: string; status: Status; note: string };
  displayName: string;
  domain: string;
  address: {
    zone: string;
    street: string;
    building: string;
    place: L;
    city: L;
    country: L;
    countryCode: string;
    status: Status;
  };
  hours: { opens: string; closes: string; days: string[]; status: Status };
  channels: ContactChannel[];
  founded: { year: number | null; status: Status; note: string };
  teamSize: { value: number | null; status: Status; note: string };
  registrations: { label: L; value: string }[];
}

export const company: CompanyRecord = {
  legalName: {
    value: 'YNWA',
    status: 'confirmed',
    note: 'Settled 2026-09-02. ynwas.com used Ynwa / YNWA / Ynwas interchangeably; YNWA is the canonical form and the wordmark. ynwas.com remains the domain, @yanwaservices remains the Instagram handle. Still open: whether the acronym should be expanded anywhere in copy.',
  },
  displayName: 'YNWA',
  domain: 'ynwas.com',

  address: {
    zone: '39',
    street: '840',
    building: '78',
    place: { en: 'HUB Business Center', ar: 'مركز هَب للأعمال' },
    city: { en: 'Doha', ar: 'الدوحة' },
    country: { en: 'Qatar', ar: 'قطر' },
    countryCode: 'QA',
    status: 'derived',
  },

  hours: {
    opens: '09:00',
    closes: '17:00',
    // Derived from "Open today 09:00 am – 05:00 pm" on ynwas.com. The working
    // week is assumed Sunday–Thursday, which is standard in Qatar; confirm.
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    status: 'derived',
  },

  channels: [
    {
      kind: 'phone',
      value: '+97441448471',
      display: '+974 4144 8471',
      label: { en: 'Office', ar: 'المكتب' },
    },
    {
      kind: 'mobile',
      value: '+97455991069',
      display: '+974 5599 1069',
      label: { en: 'Mobile', ar: 'الجوال' },
    },
    {
      kind: 'email',
      value: 'info@ynwas.com',
      display: 'info@ynwas.com',
      label: { en: 'General enquiries', ar: 'الاستفسارات العامة' },
    },
    {
      kind: 'email',
      value: 'abashar@ynwas.com',
      display: 'abashar@ynwas.com',
      label: { en: 'Direct', ar: 'تواصل مباشر' },
    },
    {
      kind: 'instagram',
      value: 'https://www.instagram.com/yanwaservices',
      display: '@yanwaservices',
      label: { en: 'Instagram', ar: 'إنستغرام' },
    },
  ],

  founded: {
    year: null,
    status: 'blocked',
    note: 'Founding year not provided. Blocks the About page and any "since" line.',
  },

  teamSize: {
    value: null,
    status: 'blocked',
    note: 'Team size not provided. Blocks the team section.',
  },

  // Qatar Chamber membership, CR number, any accreditation. Footer and
  // LocalBusiness schema both want these.
  registrations: [],
};

/** Address on one line, in the reading order of the given language. */
export function formatAddress(locale: 'en' | 'ar'): string {
  const a = company.address;
  return locale === 'ar'
    ? `${a.place.ar}، مبنى ${a.building}، شارع ${a.street}، منطقة ${a.zone}، ${a.city.ar}، ${a.country.ar}`
    : `${a.place.en}, Building ${a.building}, Street ${a.street}, Zone ${a.zone}, ${a.city.en}, ${a.country.en}`;
}

export function channel(kind: ContactChannel['kind']): ContactChannel | undefined {
  return company.channels.find((c) => c.kind === kind);
}

export function channelHref(c: ContactChannel): string {
  switch (c.kind) {
    case 'phone':
    case 'mobile':
      return `tel:${c.value}`;
    case 'email':
      return `mailto:${c.value}`;
    default:
      return c.value;
  }
}

import type { L, Source, Verifiable } from './types';

/**
 * Facts about doing business in Qatar.
 *
 * Everything in this file is quoted or closely paraphrased from a primary
 * source, and every record names that source with the date it was checked.
 * Nothing here is written from memory.
 *
 * Two standing rules for this file:
 *
 *  1. If you cannot cite it, it does not go in. The brief forbids regulatory
 *     claims we cannot substantiate, and a business-services firm asserting
 *     something wrong about Qatari law does more damage than saying nothing.
 *  2. These figures move. Tax rates, ownership rules and credit ratings all
 *     change, and a stale number on a trust-driven site is worse than no
 *     number. Re-check every `checked` date before launch and at least
 *     annually after.
 *
 * The site should present these as what they are — publicly stated facts about
 * Qatar, attributed — and never as YNWA's own advice. Nothing here tells a
 * reader what to do.
 */

const investQatar = (path: string, checked: string): Source => ({
  label: 'Invest Qatar',
  url: `https://www.invest.qa/en/${path}`,
  checked,
});

export interface QatarFact extends Verifiable {
  id: string;
  /** The headline figure or phrase, as short as it can honestly be. */
  value: L;
  label: L;
  /** Context that keeps the figure from being misread. */
  detail?: L;
  sources: Source[];
}

export const qatarFacts: QatarFact[] = [
  {
    id: 'foreign-ownership',
    value: { en: 'Up to 100%', ar: 'حتى 100%' },
    label: { en: 'Foreign ownership', ar: 'التملّك الأجنبي' },
    detail: {
      en: 'Invest Qatar states that up to 100% foreign ownership is available in all sectors. What applies to a specific activity depends on the licensing route and the activity itself.',
      ar: 'تذكر «استثمر في قطر» أن التملّك الأجنبي متاح حتى 100% في جميع القطاعات. أما ما ينطبق على نشاط بعينه فيتوقّف على مسار الترخيص وعلى النشاط نفسه.',
    },
    sources: [investQatar('why-Qatar/supporting-environment', '2026-09-03')],
    status: 'confirmed',
  },
  {
    id: 'corporate-tax',
    value: { en: '10%', ar: '10%' },
    label: { en: 'Corporate tax rate', ar: 'ضريبة الشركات' },
    detail: {
      en: 'Invest Qatar states a 10% corporate tax rate and zero tax on personal income.',
      ar: 'تذكر «استثمر في قطر» أن ضريبة الشركات 10%، ولا توجد ضريبة على الدخل الشخصي.',
    },
    sources: [investQatar('why-Qatar/supporting-environment', '2026-09-03')],
    status: 'confirmed',
  },
  {
    id: 'repatriation',
    value: { en: 'No restrictions', ar: 'دون قيود' },
    label: { en: 'Profit repatriation', ar: 'تحويل الأرباح' },
    sources: [investQatar('why-Qatar/supporting-environment', '2026-09-03')],
    status: 'confirmed',
  },
  {
    id: 'dta',
    value: { en: '80+ countries', ar: 'أكثر من 80 دولة' },
    label: { en: 'Double taxation agreements', ar: 'اتفاقيات تجنّب الازدواج الضريبي' },
    sources: [investQatar('why-Qatar/supporting-environment', '2026-09-03')],
    status: 'confirmed',
  },
  {
    id: 'credit-rating',
    value: { en: 'AA / Aa2', ar: 'AA / Aa2' },
    label: { en: 'Sovereign credit rating', ar: 'التصنيف الائتماني السيادي' },
    detail: {
      en: 'AA from S&P and Fitch, Aa2 from Moody’s, as stated by Invest Qatar.',
      ar: 'تصنيف AA من ستاندرد آند بورز وفيتش، وAa2 من موديز، وفق ما تذكره «استثمر في قطر».',
    },
    sources: [investQatar('why-Qatar/doing-business-in-qatar', '2026-09-02')],
    status: 'confirmed',
    note: 'Ratings are revised regularly. Re-check before launch.',
  },
];

/* ===========================================================================
   Licensing routes
   =========================================================================== */

export interface LicensingRoute extends Verifiable {
  id: string;
  name: L;
  summary: L;
  sources: Source[];
  /** Whether ynwas.com says YNWA works with this route. */
  ynwaHandles: 'yes' | 'unknown';
}

/**
 * The routes into the Qatari market. This is the single most useful thing the
 * site can explain, because "which platform do I register on" is the first
 * real decision an entrant faces and almost nobody explains it plainly.
 */
export const licensingRoutes: LicensingRoute[] = [
  {
    id: 'moci',
    name: { en: 'Ministry of Commerce and Industry', ar: 'وزارة التجارة والصناعة' },
    summary: {
      en: 'The mainland route. A company registered here holds a Commercial Registration and a municipality licence and trades in the domestic market.',
      ar: 'مسار البرّ الرئيسي. الشركة المسجّلة هنا تحمل سجلاً تجاريًا ورخصة بلدية وتزاول نشاطها في السوق المحلي.',
    },
    sources: [investQatar('why-Qatar/establish-business-in-qatar', '2026-09-03')],
    ynwaHandles: 'yes',
    status: 'confirmed',
  },
  {
    id: 'qfc',
    name: { en: 'Qatar Financial Centre', ar: 'مركز قطر للمال' },
    summary: {
      en: 'An onshore platform with its own legal and regulatory framework based on common law, and its own courts. The QFC states 100% foreign ownership, 100% repatriation of profits and a 10% corporate tax rate.',
      ar: 'منصّة داخل الدولة لها إطار قانوني وتنظيمي مستقل قائم على القانون العام، ومحاكم خاصة بها. ويذكر المركز التملّك الأجنبي الكامل، وتحويل الأرباح بالكامل، وضريبة شركات بنسبة 10%.',
    },
    sources: [
      investQatar('why-Qatar/establish-business-in-qatar', '2026-09-03'),
      { label: 'Qatar Financial Centre', url: 'https://www.qfc.qa/en', checked: '2026-09-02' },
    ],
    ynwaHandles: 'yes',
    status: 'confirmed',
  },
  {
    id: 'qfz',
    name: { en: 'Qatar Free Zones', ar: 'المناطق الحرة القطرية' },
    summary: {
      en: 'An independent authority created in 2018, hosting defined sectors — including logistics and trading, emerging technologies, and industrial and consumer businesses — in zones next to Qatar’s air and sea ports.',
      ar: 'هيئة مستقلة أُنشئت عام 2018، تستضيف قطاعات محدّدة — منها الخدمات اللوجستية والتجارة والتقنيات الناشئة والصناعات والسلع الاستهلاكية — في مناطق مجاورة لموانئ قطر الجوية والبحرية.',
    },
    sources: [
      investQatar('why-Qatar/establish-business-in-qatar', '2026-09-03'),
      { label: 'Qatar Free Zones Authority', url: 'https://www.qfz.gov.qa/', checked: '2026-09-03' },
    ],
    ynwaHandles: 'yes',
    status: 'confirmed',
  },
  {
    id: 'media-city',
    name: { en: 'Media City Qatar', ar: 'مدينة قطر للإعلام' },
    summary: {
      en: 'A licensing platform for media and creative businesses.',
      ar: 'منصّة ترخيص للأعمال الإعلامية والإبداعية.',
    },
    sources: [investQatar('why-Qatar/establish-business-in-qatar', '2026-09-03')],
    ynwaHandles: 'unknown',
    status: 'confirmed',
    note: 'Listed by Invest Qatar as a licensing platform. ynwas.com does not mention it — confirm whether YNWA works with this route before showing it as something they handle.',
  },
];

/** The five stages Invest Qatar publishes for setting up. Useful as an honest,
 *  attributable spine for the Qatar context page — and notably close to the
 *  Start / Operate / Grow structure the site is built on. */
export const investQatarStages: { id: string; label: L }[] = [
  { id: 'contact', label: { en: 'Contact Invest Qatar', ar: 'التواصل مع «استثمر في قطر»' } },
  { id: 'case', label: { en: 'Build your case', ar: 'إعداد دراسة المشروع' } },
  { id: 'register', label: { en: 'Register your company', ar: 'تسجيل الشركة' } },
  { id: 'operate', label: { en: 'Start your operations', ar: 'بدء التشغيل' } },
  { id: 'grow', label: { en: 'Grow your business', ar: 'تنمية الأعمال' } },
];

export const investQatarStagesSource: Source = investQatar(
  'why-Qatar/establish-business-in-qatar',
  '2026-09-03',
);

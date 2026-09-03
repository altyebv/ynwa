import type { L, Verifiable } from './types';

/**
 * How it works.
 *
 * Four steps, numbered — and numbered honestly, because this genuinely is a
 * sequence rather than four features arranged for symmetry. Step three cannot
 * happen before step two.
 *
 * The whole section is `placeholder`. It describes how a competent firm of this
 * kind works, not how YNWA works, because nobody has told us how YNWA works.
 * It renders in development with a marker and disappears from production until
 * the client replaces it with their own account. That is the point of the
 * status system: the shape of the section can be designed and reviewed now
 * without any invented claim reaching a live page.
 *
 * When it is confirmed, the thing that will make it good is specificity —
 * who the client talks to, what happens in the first conversation, what YNWA
 * needs from them and when. "We handle the process" is what every competitor
 * says. What actually happens on Tuesday is what nobody says.
 */

export interface ProcessStep extends Verifiable {
  id: string;
  /** 1-based. The order is the content, not decoration. */
  index: number;
  title: L;
  description: L;
}

export const processSteps: ProcessStep[] = [
  {
    id: 'understand',
    index: 1,
    title: { en: 'Understand', ar: 'الفهم' },
    description: {
      en: 'You tell us what you are trying to do — start something, change something, or keep something running. Not which forms you think you need.',
      ar: 'تخبرنا بما تريد إنجازه — تأسيس شيء، أو تغيير شيء، أو الحفاظ على استمرار شيء قائم. لا بالمعاملات التي تظنّ أنك تحتاجها.',
    },
    status: 'placeholder',
  },
  {
    id: 'plan',
    index: 2,
    title: { en: 'Plan', ar: 'التخطيط' },
    description: {
      en: 'We identify the licensing route, the structure and the approvals that actually apply, and tell you what the process involves before it starts.',
      ar: 'نحدّد مسار الترخيص والشكل القانوني والموافقات التي تنطبق فعلاً، ونوضّح لك ما يتضمّنه الإجراء قبل بدئه.',
    },
    status: 'placeholder',
  },
  {
    id: 'handle',
    index: 3,
    title: { en: 'Handle', ar: 'التنفيذ' },
    description: {
      en: 'We deal with the departments, the submissions and the follow-up. You are told where things stand, not asked to chase them.',
      ar: 'نتولّى التعامل مع الجهات وتقديم المعاملات ومتابعتها. ونُطلعك على الموقف أولاً بأول بدل أن تلاحقه بنفسك.',
    },
    status: 'placeholder',
  },
  {
    id: 'continue',
    index: 4,
    title: { en: 'Continue', ar: 'الاستمرار' },
    description: {
      en: 'Renewals, amendments and filings keep coming after you are set up. We keep track of them so a lapsed licence is never how you find out.',
      ar: 'التجديدات والتعديلات والمعاملات لا تتوقّف بعد التأسيس. نتابعها نيابةً عنك حتى لا يكون انتهاء رخصة هو ما يُعلمك بها.',
    },
    status: 'placeholder',
  },
];

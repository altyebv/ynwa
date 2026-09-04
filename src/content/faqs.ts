import type { L, Source, ServiceCategoryId, Verifiable } from './types';

/**
 * The FAQ bank.
 *
 * Two rules govern this file, and they are why several obvious questions are
 * answered less specifically than a competitor would answer them.
 *
 *  1. `schemaEligible` gates the FAQPage structured data. It is true only when
 *     the answer is either cited to a primary source or confirmed by the
 *     client. Emitting rich-result markup for an answer we invented would be
 *     putting an unverified claim about Qatari law into Google's index under
 *     YNWA's name.
 *
 *  2. No answer states a timeline, a fee, or a document list. Those are the
 *     three things visitors most want and the three things nobody has given
 *     us. The honest version — "it depends on the route, and here is what the
 *     route depends on" — is more useful than a made-up number and is the
 *     answer a competent adviser would actually give. Once the client confirms
 *     real figures, they slot in here and the `status` flips.
 */

export interface Faq extends Verifiable {
  id: string;
  question: L;
  answer: L;
  /** Shown on this category's page as well as the FAQ page. */
  categoryId?: ServiceCategoryId;
  sources?: Source[];
  /** Only true where the answer is sourced or client-confirmed. */
  schemaEligible: boolean;
  /** Surfaced on the homepage FAQ block. */
  featured?: boolean;
}

const investQatarSupport: Source = {
  label: 'Invest Qatar — supporting environment',
  url: 'https://www.invest.qa/en/why-Qatar/supporting-environment',
  checked: '2026-09-03',
};

const investQatarEstablish: Source = {
  label: 'Invest Qatar — establish a business in Qatar',
  url: 'https://www.invest.qa/en/why-Qatar/establish-business-in-qatar',
  checked: '2026-09-03',
};

export const faqs: Faq[] = [
  {
    id: 'how-to-start',
    question: {
      en: 'How do I start a business in Qatar?',
      ar: 'كيف أبدأ نشاطًا تجاريًا في قطر؟',
    },
    answer: {
      en: 'The first decision is not paperwork, it is route. Qatar has several licensing platforms — the Ministry of Commerce and Industry for the mainland, the Qatar Financial Centre, Qatar Free Zones, and Media City Qatar — and each has its own legal framework, its own permitted activities and its own registration process. Once the route is settled, the structure of the company and the registrations it needs follow from it. Invest Qatar describes the overall path in five stages: assess the opportunity, build the case, register the company, start operations, and grow.',
      ar: 'القرار الأول ليس المعاملات بل المسار. في قطر عدّة منصّات ترخيص — وزارة التجارة والصناعة للبرّ الرئيسي، ومركز قطر للمال، والمناطق الحرة القطرية، ومدينة قطر للإعلام — ولكلٍّ منها إطارها القانوني وأنشطتها المسموح بها وإجراءات تسجيلها. وبعد تحديد المسار يتبعه شكل الشركة والتسجيلات اللازمة لها. وتصف «استثمر في قطر» الطريق في خمس مراحل: تقييم الفرصة، وإعداد دراسة المشروع، وتسجيل الشركة، وبدء التشغيل، ثم النمو.',
    },
    categoryId: 'company-formation',
    sources: [investQatarEstablish],
    schemaEligible: true,
    featured: true,
    status: 'confirmed',
  },
  {
    id: 'foreign-investors',
    question: {
      en: 'Can foreign investors establish a business in Qatar?',
      ar: 'هل يمكن للمستثمرين الأجانب تأسيس أعمال في قطر؟',
    },
    answer: {
      en: 'Yes. Invest Qatar states that up to 100% foreign ownership is available in all sectors, with no restrictions on repatriating profits. What applies to a particular business still depends on the activity and the licensing route, which is the part worth getting right before anything is filed.',
      ar: 'نعم. تذكر «استثمر في قطر» أن التملّك الأجنبي متاح حتى 100% في جميع القطاعات، دون قيود على تحويل الأرباح. أما ما ينطبق على نشاط بعينه فيظل مرتبطًا بطبيعة النشاط ومسار الترخيص، وهو ما يجدر ضبطه قبل تقديم أي معاملة.',
    },
    categoryId: 'company-formation',
    sources: [investQatarSupport],
    schemaEligible: true,
    featured: true,
    status: 'confirmed',
  },
  {
    id: 'what-structure',
    question: {
      en: 'What business structure should I choose?',
      ar: 'أي شكل قانوني أختار لشركتي؟',
    },
    answer: {
      en: 'It follows from three things: the activity you intend to carry out, the licensing route that activity fits, and how ownership needs to be arranged between the people involved. A company trading in the domestic market, a regulated financial firm, and a logistics operation next to the port are not choosing between the same structures at all. This is the conversation to have before filing anything, because changing structure afterwards is far more work than choosing it correctly.',
      ar: 'يتحدّد بثلاثة أمور: النشاط الذي تنوي مزاولته، ومسار الترخيص الذي يناسب هذا النشاط، وكيفية توزيع الملكية بين الأطراف. فالشركة التي تعمل في السوق المحلي، والمؤسسة المالية الخاضعة للتنظيم، والنشاط اللوجستي المجاور للميناء لا تختار بين الأشكال نفسها أصلاً. وهذا هو الحديث الذي يسبق تقديم أي معاملة، لأن تغيير الشكل لاحقًا أشقّ بكثير من اختياره صحيحًا من البداية.',
    },
    categoryId: 'company-formation',
    schemaEligible: false,
    featured: true,
    status: 'placeholder',
    note: 'Deliberately general. A real structure-selection guide needs YNWA to confirm which entities they actually form — see openQuestions in services.ts.',
  },
  {
    id: 'how-long',
    question: {
      en: 'How long does company formation take?',
      ar: 'كم تستغرق عملية تأسيس الشركة؟',
    },
    answer: {
      en: 'It depends on the licensing route, the activity, and whether any approvals from other authorities are required for that activity. We would rather tell you accurately once we know what you are setting up than quote a number that turns out not to apply to you.',
      ar: 'يتوقّف ذلك على مسار الترخيص وطبيعة النشاط وما إذا كان النشاط يحتاج موافقات من جهات أخرى. ونفضّل أن نخبرك بدقّة بعد معرفة ما تنوي تأسيسه، بدلاً من ذكر مدّة قد لا تنطبق على حالتك.',
    },
    categoryId: 'company-formation',
    schemaEligible: false,
    featured: true,
    status: 'placeholder',
    note: 'The answer above invents nothing — it is true, and it is what a competent adviser says before knowing the case. But it is not the answer the visitor came for. Competitors publish concrete timelines and win on that specificity. Unblocked from `blocked` to `placeholder` on 2026-09-04 so the question is at least answered on the page; it stays out of FAQPage markup, and it stays at the top of the client copy review until YNWA gives a real range per route.',
  },
  {
    id: 'what-documents',
    question: {
      en: 'What documents are required?',
      ar: 'ما المستندات المطلوبة؟',
    },
    answer: {
      en: 'The set differs by route and by activity, and some documents issued outside Qatar need attestation before they can be used here. Tell us what you are establishing and we will send the list that applies to you.',
      ar: 'تختلف المستندات باختلاف المسار والنشاط، وبعض المستندات الصادرة خارج قطر يلزم تصديقها قبل استخدامها هنا. أخبرنا بما تنوي تأسيسه ونرسل لك القائمة التي تخصّك.',
    },
    categoryId: 'company-formation',
    schemaEligible: false,
    status: 'placeholder',
    note: 'Same as how-long: the answer is honest but generic. Unblocked to `placeholder` on 2026-09-04 so the question appears; not schema-eligible. A published, accurate document checklist per route would still be the single strongest piece of content on this site and the best organic-search asset YNWA could own.',
  },
  {
    id: 'what-is-pro',
    question: {
      en: 'What are PRO services?',
      ar: 'ما المقصود بخدمات العلاقات الحكومية؟',
    },
    answer: {
      en: 'A Public Relations Officer handles a company’s dealings with government departments — submitting and collecting paperwork, renewing registrations and licences before they lapse, and processing labour and immigration files for staff. Outsourcing it means the work still gets done on time without someone in the business spending their week in queues.',
      ar: 'مندوب العلاقات الحكومية هو من يتولّى تعاملات الشركة مع الجهات الحكومية — تقديم المعاملات واستلامها، وتجديد السجلات والتراخيص قبل انتهائها، وإنجاز معاملات العمل والهجرة للموظفين. وإسناد هذه المهمّة إلى جهة خارجية يعني إنجاز العمل في وقته دون أن يقضي أحد من الشركة أسبوعه في المراجعات.',
    },
    categoryId: 'pro-services',
    schemaEligible: false,
    featured: true,
    status: 'placeholder',
    note: 'A general description of what PRO work is, not a claim about YNWA. Safe to publish, but replace with YNWA’s own account of how they run it.',
  },
  {
    id: 'existing-company',
    question: {
      en: 'Can YNWA support a company that already exists?',
      ar: 'هل تدعم YNWA الشركات القائمة بالفعل؟',
    },
    answer: {
      en: 'Yes — most of what YNWA does is for companies that are already trading: renewing Commercial Registrations and municipality licences, adding or cancelling activities, recording changes of partners, processing labour and immigration files, and attesting documents.',
      ar: 'نعم — معظم ما تقوم به YNWA يخصّ شركات قائمة بالفعل: تجديد السجلات التجارية والرخص البلدية، وإضافة الأنشطة أو إلغاؤها، وتسجيل تغيير الشركاء، وإنجاز معاملات العمل والهجرة، وتصديق المستندات.',
    },
    categoryId: 'pro-services',
    schemaEligible: true,
    featured: true,
    status: 'derived',
    note: 'Every service named here appears on ynwas.com, so the claim is substantiated by their own published list.',
  },
  {
    id: 'why-qatar',
    question: {
      en: 'Why set up in Qatar?',
      ar: 'لماذا التأسيس في قطر؟',
    },
    answer: {
      en: 'Invest Qatar states up to 100% foreign ownership across all sectors, a 10% corporate tax rate, no personal income tax, no restrictions on repatriating profits, and double taxation agreements with more than 80 countries. Those are the published headline terms; how they apply to a specific business depends on its activity and licensing route.',
      ar: 'تذكر «استثمر في قطر» تملّكًا أجنبيًا يصل إلى 100% في جميع القطاعات، وضريبة شركات بنسبة 10%، وعدم وجود ضريبة على الدخل الشخصي، ودون قيود على تحويل الأرباح، واتفاقيات لتجنّب الازدواج الضريبي مع أكثر من 80 دولة. هذه هي الشروط المعلنة عمومًا؛ أما انطباقها على نشاط بعينه فيتوقّف على طبيعته ومسار ترخيصه.',
    },
    sources: [investQatarSupport],
    schemaEligible: true,
    status: 'confirmed',
  },
];

export const featuredFaqs = faqs.filter((f) => f.featured);

export function faqsForCategory(categoryId: ServiceCategoryId): Faq[] {
  return faqs.filter((f) => f.categoryId === categoryId);
}

/** Only these may be emitted as FAQPage structured data. */
export function schemaFaqs(): Faq[] {
  return faqs.filter((f) => f.schemaEligible && f.status !== 'blocked');
}

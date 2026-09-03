import type {
  L,
  Verifiable,
  JourneyStage,
  ServiceCategoryId,
} from './types';

/**
 * YNWA's services, structured.
 *
 * Every line item here comes from the existing ynwas.com. Nothing has been
 * added, and the three groups the old site used —
 *   "Company Formation Services", "Document Attestation",
 *   "Commercial & Licensing Services"
 * — have been re-sorted into the Start / Operate / Grow journey, because that
 * is the customer's sequence rather than the filing cabinet's. Attestation, for
 * instance, is not a category of its own; it is something an operating company
 * needs, so it sits under Operate.
 *
 * `title` is the service as the old site names it. `summary` explains what it
 * is in plain language and is marked `placeholder` wherever it describes how
 * YNWA specifically handles something, because we have not been told that.
 *
 * Two things are conspicuously ABSENT from the old site and are therefore
 * absent here. See the notes on `openQuestions` at the bottom — they are worth
 * raising with the client before the services pages ship.
 */

export interface Service extends Verifiable {
  id: string;
  slug: L;
  title: L;
  summary: L;
  categoryId: ServiceCategoryId;
  /** Documents or preconditions. Empty until the client confirms them. */
  requirements?: L<string[]>;
  /** Deliberately absent everywhere: no timeline has been confirmed. */
  typicalDuration?: L;
  relatedIds?: string[];
}

export interface ServiceCategory extends Verifiable {
  id: ServiceCategoryId;
  stage: JourneyStage;
  slug: L;
  title: L;
  lede: L;
  /** Who the page is for, in their own terms. */
  audience: L;
  seo: { title: L; description: L };
  services: Service[];
}

/* ===========================================================================
   Start — Company formation
   =========================================================================== */

const formation: Service[] = [
  {
    id: 'general-partnership',
    categoryId: 'company-formation',
    slug: { en: 'general-partnership-company', ar: 'general-partnership-company' },
    title: { en: 'General partnership company', ar: 'شركة التضامن' },
    summary: {
      en: 'Two or more partners trading under a joint name, each liable for the obligations of the company.',
      ar: 'شريكان أو أكثر يعملون تحت اسم مشترك، ويتحمّل كل منهم التزامات الشركة.',
    },
    status: 'derived',
  },
  {
    id: 'joint-partnership',
    categoryId: 'company-formation',
    slug: { en: 'joint-partnership-company', ar: 'joint-partnership-company' },
    title: { en: 'Joint partnership company', ar: 'شركة التوصية البسيطة' },
    summary: {
      en: 'A partnership combining partners who manage the business with partners whose liability is limited to their contribution.',
      ar: 'شركة تجمع بين شركاء متضامنين يديرون العمل وشركاء موصين تقتصر مسؤوليتهم على حصصهم.',
    },
    status: 'derived',
    note: 'The English name on ynwas.com is ambiguous. Confirm which Commercial Companies Law entity is meant before the Arabic term is published.',
  },
  {
    id: 'limited-share-company',
    categoryId: 'company-formation',
    slug: { en: 'limited-share-company', ar: 'limited-share-company' },
    title: { en: 'Limited share company', ar: 'شركة التوصية بالأسهم' },
    summary: {
      en: 'A company whose capital is divided into shares, with a class of partners bearing unlimited liability.',
      ar: 'شركة ينقسم رأس مالها إلى أسهم، مع فئة من الشركاء تتحمّل مسؤولية غير محدودة.',
    },
    status: 'derived',
    note: 'Ambiguous on ynwas.com — could be a partnership limited by shares or a private shareholding company. Confirm before publishing.',
  },
  {
    id: 'joint-venture',
    categoryId: 'company-formation',
    slug: { en: 'joint-venture', ar: 'joint-venture' },
    title: { en: 'Joint venture', ar: 'شركة المحاصة' },
    summary: {
      en: 'An arrangement between partners for a defined venture, without a separate public identity of its own.',
      ar: 'اتفاق بين شركاء لمشروع محدّد، دون أن يكون له كيان مستقل معلن.',
    },
    status: 'derived',
  },
  {
    id: 'holding-company',
    categoryId: 'company-formation',
    slug: { en: 'holding-company', ar: 'holding-company' },
    title: { en: 'Holding company', ar: 'الشركة القابضة' },
    summary: {
      en: 'A parent company formed to hold and control subsidiaries rather than to trade directly.',
      ar: 'شركة أمّ تُنشأ لتملّك الشركات التابعة والسيطرة عليها بدلاً من مزاولة النشاط مباشرة.',
    },
    status: 'derived',
    relatedIds: ['corporate-structuring'],
  },
  {
    id: 'qfc-registration',
    categoryId: 'company-formation',
    slug: { en: 'qfc-company-registration', ar: 'qfc-company-registration' },
    title: { en: 'QFC company registration', ar: 'التسجيل في مركز قطر للمال' },
    summary: {
      en: 'Registration on the Qatar Financial Centre platform, which operates its own legal and regulatory regime based on common law.',
      ar: 'التسجيل عبر منصّة مركز قطر للمال، التي تعمل بنظام قانوني وتنظيمي مستقل قائم على القانون العام.',
    },
    status: 'derived',
  },
  {
    id: 'free-zone-registration',
    categoryId: 'company-formation',
    slug: { en: 'free-zone-company-registration', ar: 'free-zone-company-registration' },
    title: { en: 'Free zone company registration', ar: 'التسجيل في المناطق الحرة' },
    summary: {
      en: 'Registration through Qatar Free Zones, which host defined sectors under their own authority.',
      ar: 'التسجيل عبر المناطق الحرة القطرية، التي تستضيف قطاعات محدّدة تحت إشرافها الخاص.',
    },
    status: 'derived',
  },
  {
    id: 'foreign-branch',
    categoryId: 'company-formation',
    slug: { en: 'branch-of-a-foreign-company', ar: 'branch-of-a-foreign-company' },
    title: { en: 'Branch of a foreign company', ar: 'فرع شركة أجنبية' },
    summary: {
      en: 'Establishing a Qatari branch of an existing company incorporated elsewhere.',
      ar: 'تأسيس فرع في قطر لشركة قائمة مسجّلة خارجها.',
    },
    status: 'derived',
  },
];

/* ===========================================================================
   Operate — PRO & government services
   =========================================================================== */

const pro: Service[] = [
  {
    id: 'commercial-registration',
    categoryId: 'pro-services',
    slug: { en: 'commercial-registration', ar: 'commercial-registration' },
    title: { en: 'Commercial Registration', ar: 'السجل التجاري' },
    summary: {
      en: 'Issuance, amendment and renewal of the Commercial Registration that a company trades under.',
      ar: 'إصدار السجل التجاري الذي تعمل الشركة بموجبه، وتعديله وتجديده.',
    },
    status: 'derived',
    relatedIds: ['municipality-licence', 'trade-name', 'commercial-activities'],
  },
  {
    id: 'municipality-licence',
    categoryId: 'pro-services',
    slug: { en: 'municipality-licence', ar: 'municipality-licence' },
    title: { en: 'Municipality licence', ar: 'رخصة البلدية' },
    summary: {
      en: 'Issuance, amendment and renewal of the municipal licence covering the premises a business operates from.',
      ar: 'إصدار الرخصة البلدية الخاصة بمقرّ العمل، وتعديلها وتجديدها.',
    },
    status: 'derived',
    relatedIds: ['commercial-registration'],
  },
  {
    id: 'wll-licence',
    categoryId: 'pro-services',
    slug: { en: 'wll-licence', ar: 'wll-licence' },
    title: { en: 'WLL licence', ar: 'رخصة الشركة ذات المسؤولية المحدودة' },
    summary: {
      en: 'Issuance and renewal of the licence for a company with limited liability.',
      ar: 'إصدار وتجديد رخصة الشركة ذات المسؤولية المحدودة.',
    },
    status: 'derived',
    note: 'ynwas.com lists WLL licensing but does not list WLL formation. Confirm whether YNWA forms WLL companies — it is the most common Qatari entity, and its absence from the formation list is more likely an omission than a fact.',
  },
  {
    id: 'commercial-activities',
    categoryId: 'pro-services',
    slug: { en: 'commercial-activities', ar: 'commercial-activities' },
    title: { en: 'Adding or cancelling activities', ar: 'إضافة الأنشطة التجارية أو إلغاؤها' },
    summary: {
      en: 'Changing the commercial activities a company is registered to carry out.',
      ar: 'تعديل الأنشطة التجارية المسجّلة التي يحقّ للشركة مزاولتها.',
    },
    status: 'derived',
  },
  {
    id: 'partner-changes',
    categoryId: 'pro-services',
    slug: { en: 'partner-changes', ar: 'partner-changes' },
    title: { en: 'Adding or removing partners', ar: 'إضافة الشركاء أو إخراجهم' },
    summary: {
      en: 'Recording a change of partners on the Commercial Registration.',
      ar: 'تسجيل تغيير الشركاء في السجل التجاري.',
    },
    status: 'derived',
  },
  {
    id: 'trade-name',
    categoryId: 'pro-services',
    slug: { en: 'trade-name-change', ar: 'trade-name-change' },
    title: { en: 'Changing a trade name', ar: 'تغيير الاسم التجاري' },
    summary: {
      en: 'Changing the registered name a business trades under.',
      ar: 'تغيير الاسم التجاري المسجّل الذي تعمل به الشركة.',
    },
    status: 'derived',
    relatedIds: ['trademark-registration'],
  },
  {
    id: 'government-processing',
    categoryId: 'pro-services',
    slug: { en: 'government-processing', ar: 'government-processing' },
    title: {
      en: 'Labour, immigration and ministry processing',
      ar: 'معاملات العمل والهجرة والجهات الحكومية',
    },
    summary: {
      en: 'Processing documents with the Ministry of Labour, immigration authorities, the Ministry of Commerce and Industry and other government departments.',
      ar: 'إنجاز المعاملات لدى وزارة العمل وجهات الهجرة ووزارة التجارة والصناعة وغيرها من الجهات الحكومية.',
    },
    status: 'derived',
    note: 'ynwas.com wording is "Processing documents in Labor / Immigration / Economic and other government departments". Confirm the current ministry names before publishing.',
  },
  {
    id: 'attestation',
    categoryId: 'pro-services',
    slug: { en: 'document-attestation', ar: 'document-attestation' },
    title: { en: 'Document attestation', ar: 'تصديق المستندات' },
    summary: {
      en: 'Attestation of personal and educational documents required for employment, residency and family procedures — degree, marriage, divorce and death certificates.',
      ar: 'تصديق المستندات الشخصية والدراسية اللازمة لإجراءات العمل والإقامة وشؤون الأسرة — شهادات التخرج وعقود الزواج ووثائق الطلاق وشهادات الوفاة.',
    },
    status: 'derived',
    note: 'The old site ends this list with "etc..." — the four named certificates are all that can be published until the full list is confirmed.',
  },
];

/* ===========================================================================
   Grow — Corporate services
   =========================================================================== */

const corporate: Service[] = [
  {
    id: 'corporate-structuring',
    categoryId: 'corporate-services',
    slug: { en: 'corporate-structuring', ar: 'corporate-structuring' },
    title: { en: 'Corporate structuring', ar: 'الهيكلة المؤسسية' },
    summary: {
      en: 'Arranging how a group of companies is owned and held as it grows or takes on new partners.',
      ar: 'تنظيم ملكية مجموعة الشركات وهيكل تملّكها مع نموّها أو دخول شركاء جدد.',
    },
    status: 'derived',
    relatedIds: ['holding-company'],
  },
  {
    id: 'trademark-registration',
    categoryId: 'corporate-services',
    slug: { en: 'trademark-registration', ar: 'trademark-registration' },
    title: { en: 'Trademark registration', ar: 'تسجيل العلامات التجارية' },
    summary: {
      en: 'Assistance registering a trademark so the name a business trades under is protected as well as recorded.',
      ar: 'المساعدة في تسجيل العلامة التجارية بحيث يكون الاسم الذي تعمل به الشركة محميًا لا مسجّلاً فحسب.',
    },
    status: 'derived',
    relatedIds: ['trade-name'],
  },
  {
    id: 'ongoing-compliance',
    categoryId: 'corporate-services',
    slug: { en: 'ongoing-compliance', ar: 'ongoing-compliance' },
    title: { en: 'Ongoing compliance', ar: 'الامتثال المستمر' },
    summary: {
      en: 'Keeping registrations, licences and filings current so nothing lapses while the business is busy running.',
      ar: 'إبقاء السجلات والتراخيص والإقرارات سارية حتى لا ينقضي شيء منها بينما تنشغل الشركة بعملها.',
    },
    status: 'derived',
  },
  {
    id: 'strategic-assistance',
    categoryId: 'corporate-services',
    slug: { en: 'strategic-assistance', ar: 'strategic-assistance' },
    title: { en: 'Strategic assistance', ar: 'المساندة الاستراتيجية' },
    summary: {
      en: 'Ongoing advice on the administrative side of expanding, restructuring or changing what a company does.',
      ar: 'مشورة مستمرة في الجانب الإداري للتوسّع أو إعادة الهيكلة أو تغيير نشاط الشركة.',
    },
    status: 'placeholder',
    note: 'ynwas.com names "strategic assistance" but never says what it consists of. This summary is our best reading and must be replaced with the client\'s own description.',
  },
];

/* ===========================================================================
   Categories
   =========================================================================== */

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'company-formation',
    stage: 'start',
    slug: { en: 'company-formation', ar: 'company-formation' },
    title: { en: 'Company formation', ar: 'تأسيس الشركات' },
    lede: {
      en: 'Choosing a structure, choosing a licensing route, and getting registered to trade in Qatar.',
      ar: 'اختيار الكيان القانوني، واختيار مسار الترخيص، والتسجيل لمزاولة العمل في قطر.',
    },
    audience: {
      en: 'For entrepreneurs and investors establishing in Qatar for the first time.',
      ar: 'لروّاد الأعمال والمستثمرين الذين يؤسّسون في قطر للمرة الأولى.',
    },
    seo: {
      title: {
        en: 'Company formation in Qatar',
        ar: 'تأسيس الشركات في قطر',
      },
      description: {
        en: 'Company formation in Qatar: entity types, QFC and free zone routes, foreign branches, and the registrations each one needs.',
        ar: 'تأسيس الشركات في قطر: أنواع الكيانات، ومسارات مركز قطر للمال والمناطق الحرة، وفروع الشركات الأجنبية، والتسجيلات اللازمة لكل منها.',
      },
    },
    services: formation,
    status: 'derived',
  },
  {
    id: 'pro-services',
    stage: 'operate',
    slug: { en: 'pro-services', ar: 'pro-services' },
    title: { en: 'PRO & government services', ar: 'خدمات العلاقات الحكومية' },
    lede: {
      en: 'The renewals, amendments and government processing that keep a registered company operating.',
      ar: 'التجديدات والتعديلات والمعاملات الحكومية التي تُبقي الشركة المسجّلة قادرة على العمل.',
    },
    audience: {
      en: 'For companies already registered in Qatar with administration to keep on top of.',
      ar: 'للشركات المسجّلة في قطر التي عليها متابعة إجراءاتها الإدارية.',
    },
    seo: {
      title: { en: 'PRO services in Qatar', ar: 'خدمات العلاقات الحكومية في قطر' },
      description: {
        en: 'PRO and government services in Qatar: Commercial Registration and municipality licence renewals, labour and immigration processing, and document attestation.',
        ar: 'خدمات العلاقات الحكومية في قطر: تجديد السجل التجاري والرخصة البلدية، ومعاملات العمل والهجرة، وتصديق المستندات.',
      },
    },
    services: pro,
    status: 'derived',
  },
  {
    id: 'corporate-services',
    stage: 'grow',
    slug: { en: 'corporate-services', ar: 'corporate-services' },
    title: { en: 'Corporate services', ar: 'الخدمات المؤسسية' },
    lede: {
      en: 'Structuring, protecting and keeping compliant what has already been built.',
      ar: 'هيكلة ما تم بناؤه وحمايته وإبقاؤه ملتزمًا.',
    },
    audience: {
      en: 'For established companies expanding, restructuring or taking on partners.',
      ar: 'للشركات القائمة التي تتوسّع أو تعيد هيكلتها أو تستقبل شركاء جدد.',
    },
    seo: {
      title: { en: 'Corporate services in Qatar', ar: 'الخدمات المؤسسية في قطر' },
      description: {
        en: 'Corporate services in Qatar: corporate structuring, holding companies, trademark registration and ongoing compliance.',
        ar: 'الخدمات المؤسسية في قطر: الهيكلة المؤسسية، والشركات القابضة، وتسجيل العلامات التجارية، والامتثال المستمر.',
      },
    },
    services: corporate,
    status: 'derived',
  },
];

/* ===========================================================================
   Lookups
   =========================================================================== */

export const allServices: Service[] = serviceCategories.flatMap((c) => c.services);

export function categoryById(id: ServiceCategoryId): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.id === id);
}

export function categoryByStage(stage: JourneyStage): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.stage === stage);
}

export function serviceById(id: string): Service | undefined {
  return allServices.find((s) => s.id === id);
}

/**
 * Gaps in the source material, surfaced rather than papered over.
 *
 * These are not TODOs about the code. They are observations about YNWA's
 * existing published services that are worth putting in front of the client,
 * because each one is either a missing service or a missing sentence that the
 * site would otherwise quietly invent.
 */
export const openQuestions: { id: string; question: string }[] = [
  {
    id: 'wll-formation',
    question:
      'ynwas.com lists WLL licence issuance and renewal, but not WLL company formation. The LLC/WLL is the most common Qatari entity — is its absence from the formation list an omission?',
  },
  {
    id: 'grow-is-thin',
    question:
      'Only four services fall under Grow, and three of them are named in a marketing paragraph rather than the service list. Operate and Grow are where recurring revenue lives, so this is the thinnest part of the offer as published — is there more that simply is not on the old site?',
  },
  {
    id: 'entity-names',
    question:
      '"Joint partnership company" and "Limited Share Company" do not map cleanly onto Commercial Companies Law entity names. Which entities are actually meant?',
  },
  {
    id: 'attestation-scope',
    question:
      'The attestation list ends with "etc..." — what else does YNWA attest? Commercial documents, powers of attorney, police clearances?',
  },
  {
    id: 'licensing-routes',
    question:
      'Invest Qatar names four licensing platforms: MOCI, Qatar Free Zones, QFC and Media City Qatar (QSTP appears elsewhere on their site). ynwas.com covers MOCI, QFC and free zones. Does YNWA work with Media City or QSTP?',
  },
];

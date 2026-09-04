import { useTranslations } from 'next-intl';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

/**
 * The shared shape of the privacy and terms pages.
 *
 * Both are a title, a last-updated date and a run of numbered sections, and
 * both are read by someone looking for one specific paragraph — so the
 * sections are headed, anchored and set at prose width rather than laid out.
 * Sections come from the message files as `s1title` / `s1body` pairs, which
 * keeps the two languages side by side in one file and makes it obvious when
 * one of them is missing a clause the other has.
 */
export function LegalPage({
  namespace,
  crumbLabel,
  sectionCount,
}: {
  namespace: 'privacyPage' | 'termsPage';
  crumbLabel: string;
  sectionCount: number;
}) {
  const t = useTranslations(namespace);
  const tn = useTranslations('nav');
  const sections = Array.from({ length: sectionCount }, (_, i) => i + 1);

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: tn('home'), href: '/' }, { label: crumbLabel }]}
          />
        }
        eyebrow={t('eyebrow')}
        title={t('headline')}
        lede={t('lede')}
      />

      <Section width="prose" bordered={false}>
        <p className="type-eyebrow text-fg-40">{t('updated')}</p>

        <div className="mt-10 flex flex-col gap-10">
          {sections.map((n) => (
            <section key={n} id={`s${n}`} className="border-t border-edge pt-6">
              <h2 className="type-display-3">{t(`s${n}title`)}</h2>
              <p className="mt-3 type-body text-fg-60">{t(`s${n}body`)}</p>
            </section>
          ))}
        </div>

        <p className="mt-12 border-s-2 border-detail ps-4 type-small text-fg-40">
          {t('reviewNote')}
        </p>
      </Section>
    </>
  );
}

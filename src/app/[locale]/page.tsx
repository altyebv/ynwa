import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { serviceCategories } from '@/content/navigation';
import { Link } from '@/i18n/navigation';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Home />;
}

function Home() {
  const t = useTranslations('hero');
  const tcta = useTranslations('cta');
  const ts = useTranslations('stages');
  const tc = useTranslations('categories');
  const tsc = useTranslations('scaffold');

  return (
    <>
      {/* ---- hero ------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-edge">
        <div className="lattice" aria-hidden="true" />
        <Container className="relative py-24 md:py-32 lg:py-40">
          <p className="type-eyebrow text-detail-text">{t('eyebrow')}</p>
          <h1 className="mt-6 max-w-[18ch] type-display-1">{t('headline')}</h1>
          <p className="mt-7 max-w-[54ch] type-lede">{t('lede')}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact" size="lg">
              {tcta('primary')}
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              {tcta('secondary')}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* ---- start / operate / grow ------------------------------------- */}
      <section className="border-b border-edge">
        <Container className="py-20 md:py-28">
          <div className="grid gap-px border border-edge bg-edge md:grid-cols-3">
            {serviceCategories.map((category) => (
              <Link
                key={category.key}
                href={category.href}
                className="group flex flex-col bg-ground p-8 transition-colors duration-300 hover:bg-raised"
              >
                <span className="type-eyebrow text-accent-text">
                  {ts(category.stage)}
                </span>
                <span className="mt-4 type-display-3">{tc(category.key)}</span>
                <span className="mt-3 type-small text-fg-60">
                  {tc(`${category.key}Summary`)}
                </span>
                <span className="mt-6 type-eyebrow text-fg-40 transition-colors duration-300 group-hover:text-fg">
                  {tcta('viewServices')}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- scaffold marker: removed in phase C ------------------------ */}
      <section>
        <Container className="py-20 md:py-28">
          <div className="border-s-2 border-detail bg-detail-wash px-6 py-5">
            <p className="type-eyebrow text-detail-text">{tsc('notice')}</p>
            <p className="mt-2 max-w-[60ch] type-small text-fg-60">
              {tsc('body')}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

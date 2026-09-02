import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';

export default function LocaleNotFound() {
  const t = useTranslations('notFound');

  return (
    <Container className="py-32 md:py-40">
      <p className="type-eyebrow text-detail-text">404</p>
      <h1 className="mt-5 type-display-2">{t('title')}</h1>
      <p className="mt-4 max-w-[46ch] type-lede">{t('body')}</p>
      <ButtonLink href="/" size="lg" className="mt-9">
        {t('action')}
      </ButtonLink>
    </Container>
  );
}

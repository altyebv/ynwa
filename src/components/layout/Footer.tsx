import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { footerNav } from '@/content/navigation';
import { company, formatAddress, channelHref } from '@/content/company';
import type { Locale } from '@/i18n/routing';

/** Reads entirely from content/company.ts, so the footer, the contact page and
 *  the LocalBusiness structured data can never disagree with each other. */
export function Footer() {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const ta = useTranslations('a11y');
  const locale = useLocale() as Locale;

  const contactable = company.channels.filter((c) => c.kind !== 'instagram');
  const instagram = company.channels.find((c) => c.kind === 'instagram');

  return (
    <footer className="mt-auto border-t border-edge bg-raised">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-[30ch] type-small text-fg-60">
              {formatAddress(locale)}
            </p>
            {instagram && (
              <a
                href={instagram.value}
                rel="noreferrer noopener"
                target="_blank"
                className="mt-4 inline-block type-small text-fg-60 transition-colors duration-200 hover:text-fg"
              >
                {instagram.display}
              </a>
            )}
          </div>

          <div className="md:col-span-3">
            <h2 className="type-eyebrow text-fg-40">{t('contact')}</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {contactable.map((c) => (
                <li key={c.value}>
                  <a
                    href={channelHref(c)}
                    dir={c.kind === 'email' ? undefined : 'ltr'}
                    className="type-small text-fg-60 transition-colors duration-200 hover:text-fg"
                  >
                    {c.display}
                  </a>
                </li>
              ))}
            </ul>
            <h2 className="mt-8 type-eyebrow text-fg-40">{t('hours')}</h2>
            <p className="mt-3 type-small text-fg-60">{t('hoursValue')}</p>
          </div>

          <nav
            aria-label={ta('footerNavigation')}
            className="md:col-span-3 md:col-start-9"
          >
            <h2 className="type-eyebrow text-fg-40">{t('explore')}</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {footerNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="type-small text-fg-60 transition-colors duration-200 hover:text-fg"
                  >
                    {tn(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* The old site sold "expert legal services" and described the team as
            "legal experts". The work is government, licensing and administrative
            process, not legal practice — so the site says that, and says the
            boundary out loud rather than leaving it implied. */}
        <p className="mt-12 max-w-[62ch] type-small text-fg-40">
          {t('disclaimer')}
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-edge pt-6 md:flex-row md:items-center md:justify-between">
          <p className="type-small text-fg-40">
            © {new Date().getFullYear()} {company.displayName}. {t('rights')}
          </p>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/legal/privacy"
                className="type-small text-fg-40 transition-colors duration-200 hover:text-fg"
              >
                {t('privacy')}
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms"
                className="type-small text-fg-40 transition-colors duration-200 hover:text-fg"
              >
                {t('terms')}
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}

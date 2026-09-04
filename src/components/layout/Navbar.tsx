'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { primaryNav, serviceCategories } from '@/content/navigation';
import { channel, channelHref } from '@/content/company';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Chevron } from '@/components/ui/Chevron';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/cn';

/** Points along the reading direction: right in English, left in Arabic. */
function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-hidden="true"
      className={cn('h-3.5 w-3.5 shrink-0 rtl:-scale-x-100', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

export function Navbar() {
  const t = useTranslations('nav');
  const tc = useTranslations('categories');
  const tcta = useTranslations('cta');
  const ta = useTranslations('a11y');
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const office = channel('phone');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Any navigation closes everything. Done as a render-phase reset rather than
  // an effect: React's documented pattern for state that must follow a prop,
  // and it avoids a frame where the drawer is still open on the new route.
  const [openOnPath, setOpenOnPath] = useState(pathname);
  if (openOnPath !== pathname) {
    setOpenOnPath(pathname);
    setServicesOpen(false);
    setDrawerOpen(false);
  }

  // Scroll lock goes on <html>, not <body>.
  //
  // `body { overflow: hidden }` only stops the page scrolling while the root
  // element's own overflow is `visible`, because that is the condition under
  // which the body's overflow is the thing propagated to the viewport.
  // globals.css sets `overflow-x: hidden` on <html> as an overflow guard, so
  // the root is no longer visible and it is the root that now owns viewport
  // scrolling — a body-level lock silently stopped doing anything. Setting it
  // here, and clearing the inline style afterwards so the stylesheet's
  // `overflow-x: hidden` comes back. `scrollbar-gutter: stable` in globals.css
  // is what keeps this from shifting the layout when the scrollbar goes.
  useEffect(() => {
    const root = document.documentElement;
    if (drawerOpen) root.style.overflow = 'hidden';
    else root.style.removeProperty('overflow');
    return () => {
      root.style.removeProperty('overflow');
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setServicesOpen(false);
      setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [servicesOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
        'sticky top-0 z-50 border-b bg-ground/92 backdrop-blur-sm transition-shadow duration-300',
        scrolled ? 'border-edge shadow-header' : 'border-transparent',
      )}
    >
      <Container className="flex h-18 items-center gap-2 sm:gap-3 xl:gap-6">
        <Link
          href="/"
          aria-label={ta('homeLink')}
          className="shrink-0 rounded-xs py-2"
        >
          <Logo />
        </Link>

        {/* ---- desktop navigation ---- */}
        <nav
          aria-label={ta('mainNavigation')}
          className="hidden min-w-0 flex-1 items-center gap-1 xl:flex"
        >
          {primaryNav.map((item) =>
            item.children ? (
              <div key={item.key} ref={servicesRef} className="relative">
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  onClick={() => setServicesOpen((v) => !v)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-xs px-3 py-2 type-small transition-colors duration-200',
                    isActive(item.href) || servicesOpen
                      ? 'text-fg'
                      : 'text-fg-60 hover:text-fg',
                  )}
                >
                  {t(item.key)}
                  <Chevron
                    className={cn(
                      'transition-transform duration-200',
                      servicesOpen && 'rotate-180',
                    )}
                  />
                </button>

                {servicesOpen && (
                  <div className="absolute top-full start-0 z-50 mt-2 w-[26rem] border border-edge bg-paper p-2 shadow-header">
                    {serviceCategories.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        className="group block rounded-xs p-3 transition-colors duration-200 hover:bg-raised"
                      >
                        <span className="flex items-center gap-2">
                          <span className="type-eyebrow text-accent-text">
                            {child.stage}
                          </span>
                        </span>
                        <span className="mt-1 block font-medium text-fg">
                          {tc(child.key)}
                        </span>
                        <span className="mt-1 block type-small text-fg-60">
                          {tc(`${child.key}Summary`)}
                        </span>
                      </Link>
                    ))}
                    <Link
                      href="/services"
                      className="mt-1 flex items-center gap-2 border-t border-edge-soft px-3 py-3 type-small text-fg-60 transition-colors duration-200 hover:text-fg"
                    >
                      {t('servicesOverview')}
                      <Arrow />
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'rounded-xs px-3 py-2 type-small transition-colors duration-200',
                  isActive(item.href)
                    ? 'text-fg'
                    : 'text-fg-60 hover:text-fg',
                )}
              >
                {t(item.key)}
              </Link>
            ),
          )}
        </nav>

        {/* ---- desktop actions ---- */}
        {/* shrink-0 so a future addition here overflows visibly instead of
            quietly squashing the icon buttons, which is exactly how the 1024px
            problem hid itself. */}
        <div className="ms-auto hidden shrink-0 items-center gap-4 xl:flex">
          {office && (
            <a
              href={channelHref(office)}
              dir="ltr"
              className="inline-flex min-h-6 items-center font-mono text-[0.8125rem] text-fg-60 transition-colors duration-200 hover:text-fg"
            >
              {office.display}
            </a>
          )}
          <ThemeToggle />
          <LanguageSwitcher />
          <ButtonLink href="/contact">{tcta('primary')}</ButtonLink>
        </div>

        {/* ---- mobile trigger ----------------------------------------------
            Three controls plus the lockup did not fit: at 360px the row needs
            ~366px, so the flex items were shrinking and the icon buttons were
            visibly squashed. The theme toggle moves into the drawer (it is a
            preference, not navigation) and the language control goes compact,
            which brings the row to ~250px and leaves the smallest phones room
            to spare. `shrink-0` makes any future regression here a visible
            overflow rather than a silent squash. ------------------------- */}
        <div className="ms-auto flex shrink-0 items-center gap-1.5 sm:gap-2 xl:hidden">
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={ta('openMenu')}
            aria-expanded={drawerOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xs border border-fg/15 text-fg"
          >
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M2 5h16M2 10h16M2 15h16" />
            </svg>
          </button>
        </div>
      </Container>
      </header>

      {/* ---- mobile drawer ----------------------------------------------
          Rendered as a sibling of <header>, not inside it. The header carries
          backdrop-blur, and a backdrop-filter establishes a containing block:
          a `fixed inset-0` descendant would be scoped to the 72px header box
          instead of the viewport. Slides from the inline-end edge, so it
          mirrors for free in Arabic. ------------------------------------ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-60 xl:hidden">
          <button
            type="button"
            aria-label={ta('closeMenu')}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute inset-y-0 end-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto border-s border-edge bg-ground">
            <div className="flex h-18 shrink-0 items-center justify-between gap-3 border-b border-edge px-6">
              <Logo />
              <div className="flex items-center gap-2">
                {/* Lives here below xl — see the note on the trigger cluster. */}
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label={ta('closeMenu')}
                  className="flex h-10 w-10 items-center justify-center rounded-xs border border-fg/15 text-fg"
                >
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M5 5l10 10M15 5L5 15" />
                  </svg>
                </button>
              </div>
            </div>

            <nav aria-label={ta('mainNavigation')} className="flex flex-col p-6">
              <Link
                href="/services"
                className="border-b border-edge-soft py-3 type-display-3"
              >
                {t('services')}
              </Link>
              <div className="flex flex-col border-b border-edge-soft py-2">
                {serviceCategories.map((child) => (
                  <Link
                    key={child.key}
                    href={child.href}
                    className="py-2 type-small text-fg-60"
                  >
                    {tc(child.key)}
                  </Link>
                ))}
              </div>
              {primaryNav
                .filter((i) => !i.children)
                .map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="border-b border-edge-soft py-3 type-display-3"
                  >
                    {t(item.key)}
                  </Link>
                ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 p-6">
              <ButtonLink href="/contact" size="lg" className="w-full">
                {tcta('primary')}
              </ButtonLink>
              {office && (
                <a
                  href={channelHref(office)}
                  dir="ltr"
                  className="flex h-12 w-full items-center justify-center rounded-xs border border-fg/25 font-mono text-[0.875rem] text-fg"
                >
                  {office.display}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

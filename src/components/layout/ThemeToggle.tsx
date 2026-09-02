'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import { THEME_KEY } from '@/lib/theme';

/**
 * Three states, one button.
 *
 * The stored preference is "light", "dark", or absent — absent means follow the
 * operating system, which is where most visitors stay. `data-theme` carries the
 * explicit choice and drives the palette; `data-resolved` carries what is
 * actually on screen right now and drives this control.
 *
 * Which icon and which label to show is decided in CSS from `data-resolved`,
 * not from React state. That is deliberate: the markup is then byte-identical
 * on the server and the client, so there is no hydration mismatch and no frame
 * where the button is empty or shows the wrong icon. Both labels are in the
 * DOM; the hidden one is `display: none`, so assistive technology reads exactly
 * one of them.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations('a11y');

  // While no explicit choice is stored, keep following the system.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_KEY);
      } catch {
        /* storage can throw in private modes; system preference still applies */
      }
      if (stored === 'dark' || stored === 'light') return;
      document.documentElement.dataset.resolved = e.matches ? 'dark' : 'light';
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.resolved === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    root.dataset.resolved = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* the choice simply will not persist */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xs text-fg-60',
        'transition-colors duration-200 hover:bg-raised hover:text-fg',
        className,
      )}
    >
      <span className="sr-only theme-when-light">{t('switchToDark')}</span>
      <span className="sr-only theme-when-dark">{t('switchToLight')}</span>

      {/* Shown in light: the destination is dark. */}
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="theme-when-light h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z" />
      </svg>

      {/* Shown in dark: the destination is light. */}
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="theme-when-dark h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="10" cy="10" r="3.6" />
        <path d="M10 1.6v1.8M10 16.6v1.8M18.4 10h-1.8M3.4 10H1.6M15.9 4.1l-1.3 1.3M5.4 14.6l-1.3 1.3M15.9 15.9l-1.3-1.3M5.4 5.4 4.1 4.1" />
      </svg>
    </button>
  );
}

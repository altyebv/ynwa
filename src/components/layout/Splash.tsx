'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SPLASH_KEY, SPLASH_TOTAL } from '@/lib/theme';

/**
 * The opening reveal: YNWA unfurls into the phrase behind the name, and then
 * two letters change.
 *
 *   YNWA  ->  You'll Never Walk Alone  ->  You'll Never Work Alone
 *
 * "You'll Never Walk Alone" is where the name comes from, and it belongs to
 * Liverpool FC in most people's heads. Swapping Walk for Work makes that a
 * deliberate beat rather than a borrowed line, and it lands on a promise that
 * is actually YNWA's: you are not doing the paperwork by yourself. Only two
 * letters separate the two words, so the swap is the smallest possible gesture
 * carrying the largest possible change in meaning — the animation does nothing
 * but hold still and let you notice it.
 *
 * ---------------------------------------------------------------------------
 * How this is built, and why
 *
 * The markup is server-rendered and every step is a CSS animation. Nothing here
 * waits for hydration: the reveal has already started before this component's
 * JavaScript arrives, and it finishes on time even if that JavaScript never
 * does. React's only jobs are to record that the tab has seen it, to take the
 * element out of the DOM afterwards so it cannot swallow clicks, and to let
 * people skip it.
 *
 * It plays once per session, on whatever page the visitor arrives at. Repeat
 * loads and internal navigation are untouched — the pre-paint script in
 * lib/theme.ts hides it before anything renders. That is what keeps this from
 * costing the site its Core Web Vitals: the splash is a first-arrival event,
 * not a toll gate on every page.
 *
 * Anyone who asks for reduced motion never sees it — `display: none` in CSS, no
 * JavaScript involved. The overlay is aria-hidden, so screen readers get the
 * real page immediately and are never told to wait.
 */
export function Splash() {
  const t = useTranslations('splash');
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Already seen in this tab: the pre-paint script hid it, so just drop it.
    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem(SPLASH_KEY));
    } catch {
      /* private mode — the splash simply plays every time */
    }
    if (seen) {
      setVisible(false);
      return;
    }

    const markSeen = () => {
      try {
        sessionStorage.setItem(SPLASH_KEY, '1');
      } catch {
        /* nothing to do; worst case it plays again */
      }
    };

    const dismiss = () => {
      markSeen();
      setDismissed(true);
      window.setTimeout(() => setVisible(false), 400);
      cleanup();
    };

    // Any key or any click gets you out. A skip control that has to be found
    // and aimed at is not a skip control.
    const onKey = () => dismiss();
    const onPointer = () => dismiss();
    const timer = window.setTimeout(() => {
      markSeen();
      setVisible(false);
      cleanup();
    }, SPLASH_TOTAL);

    function cleanup() {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    }

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return cleanup;
  }, []);

  if (!visible) return null;

  return (
    <div className="splash" data-dismissed={dismissed || undefined} aria-hidden="true">
      <div className="splash-inner">
        <svg viewBox="0 0 32 32" className="splash-mark" fill="none">
          <path
            className="sm-outer"
            pathLength={100}
            d="M16 1.6 30.4 16 16 30.4 1.6 16Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            className="sm-inner"
            pathLength={100}
            d="M16 7 25 16 16 25 7 16Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect className="sm-core" x="12.5" y="12.5" width="7" height="7" fill="currentColor" />
        </svg>

        {/* Each word keeps its capital and grows the rest of itself, so the
            wordmark opens into the sentence instead of being replaced by it. */}
        <p className="splash-words" dir="ltr">
          <span className="sw" style={{ ['--i' as string]: 0 }}>
            <span className="si">Y</span>
            <span className="st">ou&rsquo;ll</span>
          </span>
          <span className="sw" style={{ ['--i' as string]: 1 }}>
            <span className="si">N</span>
            <span className="st">ever</span>
          </span>
          <span className="sw" style={{ ['--i' as string]: 2 }}>
            <span className="si">W</span>
            <span className="st">
              {/* a -> o and l -> r. The W and the k never move. */}
              <span className="swap">
                <span className="from">a</span>
                <span className="to">o</span>
              </span>
              <span className="swap swap-late">
                <span className="from">l</span>
                <span className="to">r </span>
              </span>
               k
            </span>
          </span>
          <span className="sw" style={{ ['--i' as string]: 3 }}>
            <span className="si">A</span>
            <span className="st">lone</span>
          </span>
        </p>

        <p className="splash-sub">{t('subline')}</p>
      </div>

      <p className="splash-skip">{t('skip')}</p>
    </div>
  );
}

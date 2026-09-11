'use client';

import { useEffect, useRef, useState } from 'react';
import { SPLASH_TOTAL } from '@/lib/theme';

/**
 * The moving background of the homepage hero.
 *
 * Where the footage is allowed to be — and the masks that keep it off the type —
 * live in globals.css under "Hero media". Whether this visitor gets footage at
 * all was settled before the first paint, in lib/theme.ts. What is left for
 * this file is which of the two files to fetch, and when it starts.
 *
 * ---------------------------------------------------------------------------
 * Why this is a client component and not two <source media> elements
 *
 * `media` on <source> works inside <picture> and does nothing inside <video> —
 * it was dropped from the video spec. The alternative without JavaScript is two
 * <video> elements with one hidden per breakpoint, and a hidden autoplaying
 * video is still fetched in Chromium: 7.8MB for a hero that shows 3MB of it.
 * Choosing here costs a render but guarantees exactly one file is ever
 * downloaded.
 *
 * Nothing is server-rendered, which is the point. The hero's first paint is the
 * ground and the lattice — the same hero this page had before the footage
 * existed — and it stays that way for anyone this component decides against.
 */

/**
 * Which file crops well, which is a question about the viewport's orientation
 * and nothing else. Deliberately NOT the 80rem breakpoint where globals.css
 * switches the hero's mask from a band to a field: that one is about whether
 * the text column has stopped filling the page, and it lands much later. A
 * 1024px laptop is landscape — it wants the landscape footage — and still
 * gets the band.
 */
const WIDE_QUERY = '(min-width: 768px)';

const SOURCES = {
  /** 1280×720. */
  wide: '/assets/hero-wide.mp4',
  /** 720×1280. */
  tall: '/assets/hero-tall.mp4',
} as const;

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Three independent conditions decide whether the video should be running,
  // and they arrive from three different places at three different times. They
  // are kept as refs and reconciled in one place (`sync`, below) rather than
  // each listener calling play() or pause() on its own — that version had the
  // intersection observer pausing a video the splash gate had just started,
  // and made recovering from it depend on which observer happened to fire next.
  const startedRef = useRef(false); // the splash is out of the way
  const inViewRef = useRef(true); // the hero is on screen
  const syncRef = useRef<() => void>(() => {});

  // --- is there a video, and which one? ------------------------------------
  useEffect(() => {
    // Deferred a task rather than decided synchronously, for two reasons: it
    // keeps a multi-megabyte fetch from being discovered while the document is
    // still pulling fonts and CSS, and it keeps the setState out of the effect
    // body (react-hooks/set-state-in-effect) — the same shape Splash.tsx uses.
    const timer = window.setTimeout(() => {
      // Whether there is a video at all was settled before the first paint, in
      // lib/theme.ts — reduced motion gets the same answer the splash gives
      // it, and a metered or sub-4G connection is not somewhere to spend three
      // to five megabytes of decoration. It is decided there rather than here
      // because the hero's bottom padding depends on the answer and has to be
      // right in the first frame; re-deriving it in this component would let
      // the two disagree. Read it, don't recompute it.
      if (document.documentElement.dataset.hero !== 'video') return;

      // Chosen once and never swapped. Following the media query for the life
      // of the page would fetch the second file the first time somebody turns
      // a phone sideways; `object-fit: cover` handles a rotated viewport
      // perfectly well, and a surprise 3MB fetch does not.
      setSrc(window.matchMedia(WIDE_QUERY).matches ? SOURCES.wide : SOURCES.tall);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // --- the one place that starts and stops playback -------------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const sync = () => {
      const shouldPlay = startedRef.current && inViewRef.current && !document.hidden;
      if (shouldPlay === !video.paused) return;
      if (!shouldPlay) {
        video.pause();
        return;
      }
      // Belt and braces on the autoplay policy: React does set `muted` as a
      // property, but an unmuted play() is refused outright and these files
      // carry no audio track to begin with.
      video.muted = true;
      // A muted inline play() is permitted, and can still be refused by a
      // battery saver or a managed-device policy. Nothing to do if it is —
      // `data-ready` never lands and the hero stays as it was.
      void video.play().catch(() => {});
    };
    syncRef.current = sync;

    // `document.hidden` is in that condition for a reason that is easy to miss:
    // a page loaded in a background tab is never rendered, so the intersection
    // observer below reports the hero as NOT intersecting and would park the
    // video — leaving recovery to depend on that observer firing again when the
    // tab is finally looked at. Listening for the visibility change directly
    // makes the resume ours rather than the observer's, and opening a link in a
    // new tab is far too ordinary a thing to leave to that.
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [src]);

  // --- start once the splash is out of the way ------------------------------
  useEffect(() => {
    if (!videoRef.current || !src) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      syncRef.current();
    };

    // The reveal owns the first 5.3 seconds of a first visit (Splash.tsx).
    // Running the loop behind it would spend them on frames nobody sees and
    // hand the visitor a video already mid-shot the moment the overlay lifts.
    // Only playback waits — `preload="auto"` below is already buffering — so
    // this is waiting on the first frame, not on the download.
    const splash = document.querySelector('.splash');
    if (!splash?.isConnected) {
      start();
      return;
    }

    // React unmounts the overlay when it is done, so its removal is the signal.
    // Watching for it beats re-deriving the timing here: the splash can also
    // end early, on any key or click, and a duplicated timetable would sit
    // there going stale.
    const observer = new MutationObserver(() => {
      if (!splash.isConnected) {
        observer.disconnect();
        start();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Backstop, so a splash that somehow never unmounts cannot cost the hero
    // its video. SPLASH_TOTAL is the overlay's own runtime, plus a little air.
    const timer = window.setTimeout(() => {
      observer.disconnect();
      start();
    }, SPLASH_TOTAL + 600);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [src]);

  // --- no decoding for frames nobody is looking at --------------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Records the condition and defers to `sync`, which is what keeps this
        // from starting playback while the splash is still up: it cannot,
        // because it does not call play() at all.
        inViewRef.current = entries.some((entry) => entry.isIntersecting);
        syncRef.current();
      },
      { threshold: 0 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  if (!src) return null;

  return (
    <div className="hero-media" data-ready={ready || undefined} aria-hidden="true">
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        // Decorative and inert: out of the tab order, and never a control.
        tabIndex={-1}
        // `playing`, not `canplay`: it fires when a frame is actually on
        // screen, so the fade-in cannot reveal a still first frame that then
        // jerks into motion — and it never fires at all if play() was refused.
        onPlaying={() => setReady(true)}
      />
    </div>
  );
}

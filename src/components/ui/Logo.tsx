import { cn } from '@/lib/cn';

/**
 * YNWA identity.
 *
 * The supplied master is `public/assets/ynwa-logo.png`: the four letters drawn
 * as one folded ribbon. What ships is `ynwa-wordmark.png`, the same artwork
 * trimmed of its transparent margin (1732×908 of canvas around 1469×588 of
 * drawing, which would otherwise have to be paid for in layout) and resized to
 * 3x its largest rendered height. 371KB down to 6.3KB, same pixels.
 *
 * The lockup is now the whole identity — it replaced a mark-plus-set-wordmark
 * pair, so the diamond mark and the Newsreader wordmark that used to live in
 * this file are gone with it. The diamond survives where it is still the right
 * figure: `app/icon.svg` for the favicon, and the drawn-on reveal in Splash.
 *
 * See `.wordmark-img` in globals.css for why this is inverted in the light
 * theme. The short version is that the artwork is near-white and the page is
 * not.
 */
export function Logo({ className }: { className?: string }) {
  return (
    // Plain <img>, not next/image: at 6KB there is nothing to optimise away,
    // and the header's logo is the one image on the page that must never be
    // lazy, resized or deferred. Width and height are the file's own, so the
    // box is reserved before it loads.
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/assets/ynwa-wordmark.png"
      // The header wraps this in a link that carries its own aria-label, which
      // wins over anything in here; the footer and the drawer do not, and this
      // is what names them.
      alt="YNWA"
      width={210}
      height={84}
      decoding="async"
      // Taller than the set wordmark it replaced. The ribbon folds carry the
      // letterforms here, and below about 32px they close up into a texture.
      className={cn('wordmark-img h-8 w-auto sm:h-9', className)}
    />
  );
}

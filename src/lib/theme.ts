export const THEME_KEY = 'ynwa-theme';
export const SPLASH_KEY = 'ynwa-splash-seen';

/** Total splash runtime in ms. Must match --sp-total in globals.css. */
export const SPLASH_TOTAL = 5340;

/**
 * Everything that has to be decided before the first paint, inlined in <head>.
 *
 * THEME — two attributes, because they answer different questions:
 *   data-theme     the explicit choice, or absent for "follow the system".
 *                  Only this drives the palette, so an absent value correctly
 *                  falls through to the prefers-color-scheme block.
 *   data-resolved  what is actually on screen. The theme control reads this.
 *
 * Without this a visitor who chose dark would get a flash of the light palette
 * on every navigation, because the choice lives in localStorage and the server
 * cannot see it.
 *
 * SPLASH — the overlay is in the server-rendered HTML, so it is on screen from
 * the first paint with no flash of the page behind it. This script's job is the
 * opposite: to take it away instantly for anyone who should not see it. It sets
 *   data-splash="skip"
 * when this tab has already seen it, which CSS turns into `display: none`
 * before anything is painted. sessionStorage, not localStorage: the reveal
 * should happen once per visit, not once per lifetime.
 *
 * HERO — whether this visitor gets the homepage hero's footage at all. Two
 * disqualifiers, both of which HeroVideo would otherwise have to discover
 * after hydration: a reduced-motion preference, and a connection that has
 * asked not to be spent (Data Saver, or 3G and below).
 *
 * It is decided here for the same reason the other two are. Below `xl` the
 * hero reserves 320px under the buttons for the video's band to rise into,
 * and with no video that padding is a 320px hole. Choosing after hydration
 * means the hole is painted and then closed — a 320px layout shift on the
 * page most likely to be somebody's first. Setting
 *   data-hero="video"
 * before the first paint lets CSS reserve the space only when something is
 * going to fill it. The one case it cannot predict is an autoplay refused by
 * the device after all; the space is reserved and stays empty, which is a far
 * smaller wrong than shifting the page for everyone.
 *
 * Deciding here rather than in React matters — a component that hides the
 * splash after hydration would show it for a frame to every repeat visitor.
 */
export const preflightScript = `(function(){try{
var s=localStorage.getItem('${THEME_KEY}');
var d=s==='dark'||s==='light'?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
if(s==='dark'||s==='light')document.documentElement.dataset.theme=s;
document.documentElement.dataset.resolved=d?'dark':'light';
if(sessionStorage.getItem('${SPLASH_KEY}'))document.documentElement.dataset.splash='skip';
var c=navigator.connection||{};
var thrifty=c.saveData===true||/^(slow-2g|2g|3g)$/.test(c.effectiveType||'');
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!thrifty)document.documentElement.dataset.hero='video';
}catch(e){}})()`;

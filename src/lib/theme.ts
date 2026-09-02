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
 * Deciding here rather than in React matters — a component that hides the
 * splash after hydration would show it for a frame to every repeat visitor.
 */
export const preflightScript = `(function(){try{
var s=localStorage.getItem('${THEME_KEY}');
var d=s==='dark'||s==='light'?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
if(s==='dark'||s==='light')document.documentElement.dataset.theme=s;
document.documentElement.dataset.resolved=d?'dark':'light';
if(sessionStorage.getItem('${SPLASH_KEY}'))document.documentElement.dataset.splash='skip';
}catch(e){}})()`;

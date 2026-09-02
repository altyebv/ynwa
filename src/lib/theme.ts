export const THEME_KEY = 'ynwa-theme';

/**
 * Runs before first paint, inlined in <head>.
 *
 * Two attributes, because they answer different questions:
 *   data-theme     the explicit choice, or absent for "follow the system".
 *                  Only this drives the palette, so an absent value correctly
 *                  falls through to the prefers-color-scheme block.
 *   data-resolved  what is actually on screen. The theme control reads this.
 *
 * Without this script a visitor who chose dark would get a flash of the light
 * palette on every navigation, because the choice lives in localStorage and
 * the server cannot see it.
 */
export const themeScript = `(function(){try{
var s=localStorage.getItem('${THEME_KEY}');
var d=s==='dark'||s==='light'?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
if(s==='dark'||s==='light')document.documentElement.dataset.theme=s;
document.documentElement.dataset.resolved=d?'dark':'light';
}catch(e){}})()`;

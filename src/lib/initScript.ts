import { THEME_STORAGE_KEY } from "./theme";

export const PRELOADER_SESSION_KEY = "preloaded";

/**
 * Runs synchronously in <head> before first paint:
 *  1. applies the saved light/dark theme (no flash)
 *  2. marks repeat visits in this session so CSS hides the preloader immediately
 *  3. adds html.intro-pending so the hero waits invisibly for its intro (see lib/intro.ts)
 * Pattern: node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
export const headInitScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")d.setAttribute("data-theme",t)}catch(e){}try{if(sessionStorage.getItem("${PRELOADER_SESSION_KEY}"))d.setAttribute("data-preloaded","")}catch(e){}try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("intro-pending");setTimeout(function(){d.classList.remove("intro-pending")},4000)}}catch(e){}})()`;

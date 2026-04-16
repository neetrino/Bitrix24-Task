/** Shared primary auth / entry CTA — solid light button on dark, no colored glow. */
const AUTH_PRIMARY_CTA_BASE =
  'inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-slate-100 font-semibold text-slate-900 shadow-sm transition hover:border-slate-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:opacity-60';

/** Home hero — large, visually central. */
export const AUTH_PRIMARY_CTA_HERO_CLASS = `${AUTH_PRIMARY_CTA_BASE} px-10 py-4 text-base`;

/** Sign-in form submit — full width inside card. */
export const AUTH_PRIMARY_CTA_FORM_CLASS = `${AUTH_PRIMARY_CTA_BASE} w-full px-5 py-3.5 text-sm sm:text-base`;

/** Magic-link submit — AI gradient CTA on dark surfaces. */
export const AUTH_MAGIC_LINK_SUBMIT_CLASS =
  'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-fuchsia-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:opacity-60 sm:text-base';

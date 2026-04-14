/**
 * Project page: tasks (aside) + chat column split.
 * Aside width band is +30% vs the original 220px–280px so the task list is easier to scan.
 * Values: Math.round(220 * 1.3) = 286, Math.round(280 * 1.3) = 364.
 */
export const TASKS_ASIDE_MIN_WIDTH_PX = 286;
export const TASKS_ASIDE_MAX_WIDTH_PX = 364;

/**
 * Full className for the project page two-column grid. Must stay a static string for Tailwind JIT.
 * lg:grid-cols-[minmax(286px,364px)_minmax(0,1fr)]
 */
export const PROJECT_TASKS_CHAT_GRID_CLASS =
  'grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(286px,364px)_minmax(0,1fr)] lg:gap-4 lg:overflow-hidden lg:-mx-6';

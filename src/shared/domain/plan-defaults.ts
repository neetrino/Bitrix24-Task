/**
 * Zod-free plan constants and type shapes.
 *
 * Importing from the full `./plan` module pulls the entire Zod schema graph
 * (and the Zod runtime) into the bundle. Client-reachable modules that only
 * need types or the `DEFAULT_PLAN` constant should import from this file
 * instead, so Zod stays on the server.
 */

export type EpicMode = 'scrum' | 'parent_tasks';

export type DecompositionLevel = 'coarse' | 'balanced' | 'fine';

export type TaskSize = 'small' | 'medium' | 'large';

export type TaskPayload = {
  title: string;
  description?: string;
  size?: TaskSize;
  /** When true, this task is included in the next Bitrix sync. */
  syncSelected?: boolean;
  /** Set after a successful push to Bitrix. */
  bitrixSynced?: boolean;
  bitrixTaskId?: number;
};

export type EpicPayload = {
  name: string;
  description?: string;
  tasks: TaskPayload[];
  /** Scrum: reuse this epic in Bitrix on subsequent syncs. */
  bitrixEpicId?: number;
  /** parent_tasks mode: reuse this parent task in Bitrix. */
  bitrixParentTaskId?: number;
};

export type PlanPayload = {
  project_title?: string;
  epic_mode: EpicMode;
  /** Relative depth of decomposition; absolute task counts depend on scope. */
  decomposition_level?: DecompositionLevel;
  /** Expected task count band note for the chosen level. */
  decomposition_estimate_note?: string;
  responsible_id?: number;
  epics: EpicPayload[];
};

/** What each decomposition level *means* (depth), without implying a universal number of tasks. */
export const DECOMPOSITION_LEVEL_DESCRIPTIONS: Record<DecompositionLevel, string> = {
  coarse:
    'Fewer, larger chunks — main areas or milestones only (depth is shallow; total tasks scales with project size).',
  balanced:
    'Middle depth — modules and main flows broken down; more tasks than coarse, not every micro-step.',
  fine:
    'Deepest split — many small actionable tasks; total count still depends on how big the scope is.',
};

/** @deprecated Use DECOMPOSITION_LEVEL_DESCRIPTIONS; alias for existing imports. */
export const DECOMPOSITION_LEVEL_RANGES = DECOMPOSITION_LEVEL_DESCRIPTIONS;

export const DEFAULT_PLAN: PlanPayload = {
  epic_mode: 'scrum',
  epics: [
    {
      name: 'Backlog',
      tasks: [
        {
          title: 'First task',
          description: 'Describe the outcome',
          syncSelected: true,
          bitrixSynced: false,
        },
      ],
    },
  ],
};

import { z } from 'zod';
import {
  DEFAULT_PLAN,
  type DecompositionLevel,
  type EpicPayload,
  type PlanPayload,
  type TaskPayload,
} from '@/shared/domain/plan-defaults';

/**
 * Server-side plan module: owns the Zod schemas and normalization logic.
 *
 * Do NOT import this from `'use client'` components — doing so drags the Zod
 * runtime into the browser bundle. Use `@/shared/domain/plan-defaults` for
 * types and constants on the client.
 */

export {
  DEFAULT_PLAN,
  DECOMPOSITION_LEVEL_DESCRIPTIONS,
  DECOMPOSITION_LEVEL_RANGES,
} from '@/shared/domain/plan-defaults';

export type {
  DecompositionLevel,
  EpicMode,
  EpicPayload,
  PlanPayload,
  TaskPayload,
  TaskSize,
} from '@/shared/domain/plan-defaults';

export const epicModeSchema = z.enum(['scrum', 'parent_tasks']);

/** How finely to split work before generating the full backlog (not per-task labels). */
export const decompositionLevelSchema = z.enum(['coarse', 'balanced', 'fine']);

export const taskSizeSchema = z.enum(['small', 'medium', 'large']);

export const taskSpecSchema: z.ZodType<TaskPayload> = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  size: taskSizeSchema.optional(),
  /** When true, this task is included in the next Bitrix sync. */
  syncSelected: z.boolean().optional(),
  /** Set after a successful push to Bitrix. */
  bitrixSynced: z.boolean().optional(),
  bitrixTaskId: z.number().finite().optional(),
});

export const epicSpecSchema: z.ZodType<EpicPayload> = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  tasks: z.array(taskSpecSchema).min(1),
  /** Scrum: reuse this epic in Bitrix on subsequent syncs. */
  bitrixEpicId: z.number().finite().optional(),
  /** parent_tasks mode: reuse this parent task in Bitrix. */
  bitrixParentTaskId: z.number().finite().optional(),
});

export const planSchema: z.ZodType<PlanPayload> = z.object({
  project_title: z.string().optional(),
  epic_mode: epicModeSchema,
  /** Relative depth of decomposition; absolute task counts depend on scope (see decomposition_estimate_note). */
  decomposition_level: decompositionLevelSchema.optional(),
  /** AI/user-facing note: expected task count band for *this* scope at the chosen level (not fixed globally). */
  decomposition_estimate_note: z.string().max(600).optional(),
  responsible_id: z.number().optional(),
  epics: z.array(epicSpecSchema).min(1),
});

const PLACEHOLDER_TASK_TITLE = 'Clarify scope and next steps';

function parseTaskSize(raw: unknown): 'small' | 'medium' | 'large' | undefined {
  if (raw === 'small' || raw === 'medium' || raw === 'large') return raw;
  return undefined;
}

function parseDecompositionLevel(raw: unknown): DecompositionLevel | undefined {
  if (raw === 'coarse' || raw === 'balanced' || raw === 'fine') return raw;
  return undefined;
}

function parseDecompositionEstimateNote(
  raw: unknown,
  prior: string | undefined,
): string | undefined {
  if (typeof raw === 'string' && raw.trim()) return raw.trim().slice(0, 600);
  return prior;
}

function isValidPriorEpics(prior: PlanPayload | undefined): prior is PlanPayload {
  if (!prior?.epics?.length) return false;
  return prior.epics.every(
    (e) =>
      typeof e.name === 'string' &&
      e.name.trim().length > 0 &&
      Array.isArray(e.tasks) &&
      e.tasks.length > 0,
  );
}

function applyTaskBitrixDefaults(task: TaskPayload): TaskPayload {
  const bitrixSynced = task.bitrixSynced ?? false;
  const syncSelected = task.syncSelected ?? !bitrixSynced;
  return { ...task, bitrixSynced, syncSelected };
}

/** Preserves Bitrix metadata from prior snapshot; index-based matching only. */
function mergeBitrixMetadataFromPrior(plan: PlanPayload, prior: PlanPayload | undefined): PlanPayload {
  if (!prior?.epics?.length) {
    return {
      ...plan,
      epics: plan.epics.map((epic) => ({
        ...epic,
        tasks: epic.tasks.map((t) => applyTaskBitrixDefaults(t)),
      })),
    };
  }

  const epics = plan.epics.map((epic, epicIndex) => {
    const priorEpic = prior.epics[epicIndex];
    const epicMerged: EpicPayload = { ...epic };
    if (priorEpic?.bitrixEpicId !== undefined) {
      epicMerged.bitrixEpicId = priorEpic.bitrixEpicId;
    }
    if (priorEpic?.bitrixParentTaskId !== undefined) {
      epicMerged.bitrixParentTaskId = priorEpic.bitrixParentTaskId;
    }
    epicMerged.tasks = epic.tasks.map((task, taskIndex) => {
      const priorTask = priorEpic?.tasks[taskIndex];
      const next: TaskPayload = { ...task };
      if (priorTask) {
        if (priorTask.bitrixTaskId !== undefined) {
          next.bitrixTaskId = priorTask.bitrixTaskId;
        }
        if (priorTask.bitrixSynced !== undefined) {
          next.bitrixSynced = priorTask.bitrixSynced;
        }
        if (priorTask.syncSelected !== undefined) {
          next.syncSelected = priorTask.syncSelected;
        }
      }
      return applyTaskBitrixDefaults(next);
    });
    return epicMerged;
  });

  return { ...plan, epics };
}

/**
 * Coerces a model-produced plan into a valid {@link PlanPayload}.
 * Fills missing `epic_mode`, empty epics/tasks, and fixes invalid task titles so chat does not fail on vague or greeting-only messages.
 */
export function normalizePlanFromAi(planRaw: unknown, prior: PlanPayload | undefined): PlanPayload {
  const fallbackEpics = isValidPriorEpics(prior) ? prior.epics : DEFAULT_PLAN.epics;

  if (!planRaw || typeof planRaw !== 'object') {
    return planSchema.parse(
      mergeBitrixMetadataFromPrior(
        {
          epic_mode: 'scrum',
          decomposition_level: prior?.decomposition_level,
          decomposition_estimate_note: prior?.decomposition_estimate_note,
          epics: fallbackEpics,
        },
        prior,
      ),
    );
  }

  const o = planRaw as Record<string, unknown>;
  const epic_mode = o.epic_mode === 'parent_tasks' ? 'parent_tasks' : 'scrum';
  const decomposition_level =
    parseDecompositionLevel(o.decomposition_level) ?? prior?.decomposition_level;
  const decomposition_estimate_note = parseDecompositionEstimateNote(
    o.decomposition_estimate_note,
    prior?.decomposition_estimate_note,
  );

  const project_title =
    typeof o.project_title === 'string' && o.project_title.trim() ? o.project_title.trim() : undefined;
  const responsible_id = typeof o.responsible_id === 'number' && Number.isFinite(o.responsible_id)
    ? o.responsible_id
    : undefined;

  const epicsRaw = o.epics;
  if (!Array.isArray(epicsRaw) || epicsRaw.length === 0) {
    return planSchema.parse(
      mergeBitrixMetadataFromPrior(
        {
          epic_mode,
          project_title,
          responsible_id,
          decomposition_level,
          decomposition_estimate_note,
          epics: fallbackEpics,
        },
        prior,
      ),
    );
  }

  const epics = epicsRaw.map((epicRaw, epicIndex) => {
    if (!epicRaw || typeof epicRaw !== 'object') {
      return {
        name: `Epic ${epicIndex + 1}`,
        tasks: [{ title: PLACEHOLDER_TASK_TITLE }],
      };
    }
    const e = epicRaw as Record<string, unknown>;
    const name =
      typeof e.name === 'string' && e.name.trim() ? e.name.trim() : `Epic ${epicIndex + 1}`;
    const description =
      typeof e.description === 'string' && e.description.trim() ? e.description.trim() : undefined;

    const tasksRaw = e.tasks;
    if (!Array.isArray(tasksRaw) || tasksRaw.length === 0) {
      return { name, description, tasks: [{ title: PLACEHOLDER_TASK_TITLE }] };
    }

    const tasks = tasksRaw.map((taskRaw, taskIndex) => {
      if (!taskRaw || typeof taskRaw !== 'object') {
        return { title: `Task ${taskIndex + 1}` };
      }
      const t = taskRaw as Record<string, unknown>;
      const title =
        typeof t.title === 'string' && t.title.trim()
          ? t.title.trim()
          : `Task ${taskIndex + 1}`;
      const taskDescription =
        typeof t.description === 'string' && t.description.trim()
          ? t.description.trim()
          : undefined;
      const size = parseTaskSize(t.size);
      const base = taskDescription ? { title, description: taskDescription } : { title };
      return size ? { ...base, size } : base;
    });

    return { name, description, tasks };
  });

  return planSchema.parse(
    mergeBitrixMetadataFromPrior(
      {
        epic_mode,
        project_title,
        responsible_id,
        decomposition_level,
        decomposition_estimate_note,
        epics,
      },
      prior,
    ),
  );
}

export function parsePlanFromJson(raw: unknown): PlanPayload {
  return planSchema.parse(raw);
}

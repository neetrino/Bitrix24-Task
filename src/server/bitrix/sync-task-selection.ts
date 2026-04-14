import type { Plan, TaskSpec } from '@/server/bitrix/types';

/** Whether this task should be included in the next Bitrix API run. */
export function shouldSyncTaskForBitrix(task: TaskSpec): boolean {
  if (task.syncSelected === false) return false;
  if (task.syncSelected === true) return true;
  return !task.bitrixSynced;
}

export function countTasksMarkedForSync(plan: Plan): number {
  return plan.epics.reduce(
    (acc, epic) => acc + epic.tasks.filter((t) => shouldSyncTaskForBitrix(t)).length,
    0,
  );
}

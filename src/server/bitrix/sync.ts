import { addEpic, addTask, linkScrumTaskToEpic } from '@/server/bitrix/client';
import type { BitrixEnv, TaskActors } from '@/server/bitrix/env';
import type { Plan } from '@/server/bitrix/types';
import { logger } from '@/shared/lib/logger';

function resolveAssigneeId(plan: Plan, actors: TaskActors): number {
  return plan.responsible_id ?? actors.taskAssigneeId;
}

export async function syncScrum(
  plan: Plan,
  webhook: string,
  groupId: number,
  actors: TaskActors,
  dryRun: boolean,
): Promise<void> {
  const assigneeId = resolveAssigneeId(plan, actors);
  for (const epic of plan.epics) {
    if (dryRun) {
      logger.info({ epic: epic.name, tasks: epic.tasks.length }, '[dry-run] epic');
      continue;
    }
    const epicResult = await addEpic(webhook, groupId, epic.name, epic.description ?? '');
    const epicId = epicResult.id;
    logger.info({ epicId, name: epic.name }, 'Epic created');
    for (const task of epic.tasks) {
      const taskResult = await addTask(webhook, {
        TITLE: task.title,
        DESCRIPTION: task.description ?? '',
        GROUP_ID: groupId,
        RESPONSIBLE_ID: assigneeId,
        CREATED_BY: actors.taskOwnerId,
      });
      const taskId = Number(taskResult.task.id);
      await linkScrumTaskToEpic(webhook, taskId, epicId);
      logger.info({ taskId, title: task.title, epicId }, 'Task created');
    }
  }
}

export async function syncParentTasks(
  plan: Plan,
  webhook: string,
  groupId: number,
  actors: TaskActors,
  dryRun: boolean,
): Promise<void> {
  const assigneeId = resolveAssigneeId(plan, actors);
  for (const epic of plan.epics) {
    if (dryRun) {
      logger.info({ parent: epic.name, subtasks: epic.tasks.length }, '[dry-run] parent task');
      continue;
    }
    const parent = await addTask(webhook, {
      TITLE: epic.name,
      DESCRIPTION: epic.description ?? '',
      GROUP_ID: groupId,
      RESPONSIBLE_ID: assigneeId,
      CREATED_BY: actors.taskOwnerId,
    });
    const parentId = Number(parent.task.id);
    logger.info({ parentId, name: epic.name }, 'Epic parent task');
    for (const task of epic.tasks) {
      const taskResult = await addTask(webhook, {
        TITLE: task.title,
        DESCRIPTION: task.description ?? '',
        GROUP_ID: groupId,
        RESPONSIBLE_ID: assigneeId,
        CREATED_BY: actors.taskOwnerId,
        PARENT_ID: parentId,
      });
      logger.info({ taskId: taskResult.task.id, title: task.title }, 'Subtask');
    }
  }
}

export async function runSyncPlan(
  plan: Plan,
  env: BitrixEnv,
  dryRun: boolean,
): Promise<void> {
  const { webhook, groupId, taskOwnerId, taskAssigneeId } = env;
  const actors: TaskActors = { taskOwnerId, taskAssigneeId };
  if (plan.epic_mode === 'scrum') {
    await syncScrum(plan, webhook, groupId, actors, dryRun);
  } else {
    await syncParentTasks(plan, webhook, groupId, actors, dryRun);
  }
}

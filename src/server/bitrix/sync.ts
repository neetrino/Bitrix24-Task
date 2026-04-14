import { addEpic, addTask, linkScrumTaskToEpic, updateTask } from '@/server/bitrix/client';
import type { BitrixEnv, TaskActors } from '@/server/bitrix/env';
import { shouldSyncTaskForBitrix } from '@/server/bitrix/sync-task-selection';
import type { Plan } from '@/server/bitrix/types';
import { logger } from '@/shared/lib/logger';

function resolveAssigneeId(plan: Plan, actors: TaskActors): number {
  return plan.responsible_id ?? actors.taskAssigneeId;
}

function clonePlan(plan: Plan): Plan {
  return JSON.parse(JSON.stringify(plan)) as Plan;
}

export async function syncScrum(
  plan: Plan,
  webhook: string,
  groupId: number,
  actors: TaskActors,
  dryRun: boolean,
): Promise<Plan> {
  const result = clonePlan(plan);
  const assigneeId = resolveAssigneeId(plan, actors);

  for (let ei = 0; ei < result.epics.length; ei++) {
    const epic = result.epics[ei];
    const entries = epic.tasks
      .map((task, ti) => ({ task, ti }))
      .filter(({ task }) => shouldSyncTaskForBitrix(task));

    if (entries.length === 0) {
      if (dryRun) {
        logger.info({ epic: epic.name }, '[dry-run] epic — no tasks selected for sync');
      }
      continue;
    }

    let epicId = epic.bitrixEpicId;

    if (dryRun) {
      logger.info(
        {
          epic: epic.name,
          taskTitles: entries.map((e) => e.task.title),
          epicId: epicId ?? 'would_create',
        },
        '[dry-run] scrum epic',
      );
      continue;
    }

    if (epicId === undefined) {
      const epicResult = await addEpic(webhook, groupId, epic.name, epic.description ?? '');
      epicId = epicResult.id;
      result.epics[ei].bitrixEpicId = epicId;
      logger.info({ epicId, name: epic.name }, 'Epic created');
    }

    for (const { task, ti } of entries) {
      if (task.bitrixTaskId !== undefined) {
        await updateTask(webhook, task.bitrixTaskId, {
          TITLE: task.title,
          DESCRIPTION: task.description ?? '',
        });
        result.epics[ei].tasks[ti].bitrixSynced = true;
        result.epics[ei].tasks[ti].syncSelected = false;
        logger.info({ taskId: task.bitrixTaskId, title: task.title, epicId }, 'Task updated');
        continue;
      }

      const taskResult = await addTask(webhook, {
        TITLE: task.title,
        DESCRIPTION: task.description ?? '',
        GROUP_ID: groupId,
        RESPONSIBLE_ID: assigneeId,
        CREATED_BY: actors.taskOwnerId,
      });
      const newTaskId = Number(taskResult.task.id);
      await linkScrumTaskToEpic(webhook, newTaskId, epicId);
      result.epics[ei].tasks[ti].bitrixTaskId = newTaskId;
      result.epics[ei].tasks[ti].bitrixSynced = true;
      result.epics[ei].tasks[ti].syncSelected = false;
      logger.info({ taskId: newTaskId, title: task.title, epicId }, 'Task created');
    }
  }

  return result;
}

export async function syncParentTasks(
  plan: Plan,
  webhook: string,
  groupId: number,
  actors: TaskActors,
  dryRun: boolean,
): Promise<Plan> {
  const result = clonePlan(plan);
  const assigneeId = resolveAssigneeId(plan, actors);

  for (let ei = 0; ei < result.epics.length; ei++) {
    const epic = result.epics[ei];
    const entries = epic.tasks
      .map((task, ti) => ({ task, ti }))
      .filter(({ task }) => shouldSyncTaskForBitrix(task));

    if (entries.length === 0) {
      if (dryRun) {
        logger.info({ parent: epic.name }, '[dry-run] parent — no subtasks selected for sync');
      }
      continue;
    }

    let parentId = epic.bitrixParentTaskId;

    if (dryRun) {
      logger.info(
        {
          parent: epic.name,
          subtasks: entries.map((e) => e.task.title),
          parentId: parentId ?? 'would_create',
        },
        '[dry-run] parent task group',
      );
      continue;
    }

    if (parentId === undefined) {
      const parent = await addTask(webhook, {
        TITLE: epic.name,
        DESCRIPTION: epic.description ?? '',
        GROUP_ID: groupId,
        RESPONSIBLE_ID: assigneeId,
        CREATED_BY: actors.taskOwnerId,
      });
      parentId = Number(parent.task.id);
      result.epics[ei].bitrixParentTaskId = parentId;
      logger.info({ parentId, name: epic.name }, 'Parent task created');
    }

    for (const { task, ti } of entries) {
      if (task.bitrixTaskId !== undefined) {
        await updateTask(webhook, task.bitrixTaskId, {
          TITLE: task.title,
          DESCRIPTION: task.description ?? '',
        });
        result.epics[ei].tasks[ti].bitrixSynced = true;
        result.epics[ei].tasks[ti].syncSelected = false;
        logger.info({ taskId: task.bitrixTaskId, title: task.title }, 'Subtask updated');
        continue;
      }

      const taskResult = await addTask(webhook, {
        TITLE: task.title,
        DESCRIPTION: task.description ?? '',
        GROUP_ID: groupId,
        RESPONSIBLE_ID: assigneeId,
        CREATED_BY: actors.taskOwnerId,
        PARENT_ID: parentId,
      });
      const newId = Number(taskResult.task.id);
      result.epics[ei].tasks[ti].bitrixTaskId = newId;
      result.epics[ei].tasks[ti].bitrixSynced = true;
      result.epics[ei].tasks[ti].syncSelected = false;
      logger.info({ taskId: newId, title: task.title }, 'Subtask created');
    }
  }

  return result;
}

export async function runSyncPlan(plan: Plan, env: BitrixEnv, dryRun: boolean): Promise<Plan> {
  const { webhook, groupId, taskOwnerId, taskAssigneeId } = env;
  const actors: TaskActors = { taskOwnerId, taskAssigneeId };
  if (plan.epic_mode === 'scrum') {
    return syncScrum(plan, webhook, groupId, actors, dryRun);
  }
  return syncParentTasks(plan, webhook, groupId, actors, dryRun);
}

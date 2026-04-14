import type { EpicAddResult, TaskAddResult } from '@/server/bitrix/types';

/** Bitrix REST: user or task state blocks modify (closed task, wrong rights, stale id). */
const TASK_ACTION_DENIED_HINT =
  'Typical causes: the webhook user cannot edit this task, the task is completed/closed in Bitrix, the task was moved/deleted, or the stored Bitrix task id is outdated. In Bitrix: check rights for the incoming webhook user, reopen the task if needed, or in PlanRelay clear the Bitrix link for that row and sync again to create a new task.';

function appendBitrixDeniedHint(message: string, description: string | undefined): string {
  const d = description ?? '';
  if (
    d.includes('Действие над задачей не разрешено') ||
    /action on (the )?task is not (allowed|permitted)/i.test(d)
  ) {
    return `${message} — ${TASK_ACTION_DENIED_HINT}`;
  }
  return message;
}

/** Response body inside REST `result` for `tasks.api.scrum.task.update` */
type ScrumTaskUpdatePayload = {
  status?: string;
  data?: boolean | null;
  errors?: unknown[];
};

export async function bitrixCall<T>(
  webhookBase: string,
  method: string,
  body: Record<string, unknown>,
): Promise<T> {
  const url = `${webhookBase}${method}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as {
    result?: T;
    error?: string;
    error_description?: string;
  };
  if (!res.ok) {
    const base = `HTTP ${res.status}: ${JSON.stringify(json)}`;
    throw new Error(appendBitrixDeniedHint(base, json.error_description));
  }
  if (json.error) {
    const base = `${json.error}: ${json.error_description ?? ''}`;
    throw new Error(appendBitrixDeniedHint(base, json.error_description));
  }
  return json.result as T;
}

export async function linkScrumTaskToEpic(
  webhook: string,
  taskId: number,
  epicId: number,
): Promise<void> {
  const payload = await bitrixCall<ScrumTaskUpdatePayload | boolean>(
    webhook,
    'tasks.api.scrum.task.update',
    {
      id: taskId,
      fields: { epicId },
    },
  );
  if (payload === true) return;
  if (typeof payload === 'object' && payload !== null && 'status' in payload) {
    if (payload.status === 'success') return;
    if (payload.status === 'error') {
      throw new Error(
        `tasks.api.scrum.task.update failed for task ${taskId}: ${JSON.stringify(payload)}`,
      );
    }
  }
}

export async function addEpic(
  webhook: string,
  groupId: number,
  name: string,
  description: string,
): Promise<EpicAddResult> {
  return bitrixCall<EpicAddResult>(webhook, 'tasks.api.scrum.epic.add', {
    fields: {
      name,
      groupId,
      description,
    },
  });
}

export async function addTask(
  webhook: string,
  fields: Record<string, unknown>,
): Promise<TaskAddResult> {
  return bitrixCall<TaskAddResult>(webhook, 'tasks.task.add', { fields });
}

export async function updateTask(
  webhook: string,
  taskId: number,
  fields: Record<string, unknown>,
): Promise<void> {
  await bitrixCall<unknown>(webhook, 'tasks.task.update', {
    taskId,
    fields,
  });
}

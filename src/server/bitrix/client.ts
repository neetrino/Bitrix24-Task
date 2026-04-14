import type { EpicAddResult, TaskAddResult } from '@/server/bitrix/types';

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
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
  }
  if (json.error) {
    throw new Error(`${json.error}: ${json.error_description ?? ''}`);
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

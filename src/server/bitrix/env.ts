export type TaskActors = {
  taskOwnerId: number;
  taskAssigneeId: number;
};

export type BitrixEnv = {
  webhook: string;
  groupId: number;
} & TaskActors;

function parseUserId(raw: string | undefined, label: string): number | undefined {
  if (raw === undefined || raw.trim() === '') return undefined;
  const n = Number(raw.trim());
  if (!Number.isFinite(n)) {
    throw new Error(`${label} must be a number`);
  }
  return n;
}

export function loadEnvFromProcess(): BitrixEnv {
  const webhook = process.env.Webhook_URL?.trim();
  const idRaw = process.env.Bitrix24_Project_id?.trim();
  const legacyResponsible = parseUserId(process.env.Bitrix24_responsible_id, 'Bitrix24_responsible_id');
  const ownerParsed = parseUserId(process.env.Task_owner_id, 'Task_owner_id');
  const assigneeParsed = parseUserId(process.env.Task_Assignee_id, 'Task_Assignee_id');

  if (!webhook) throw new Error('Missing Webhook_URL in .env');
  if (!idRaw) throw new Error('Missing Bitrix24_Project_id in .env');
  const groupId = Number(idRaw);
  if (!Number.isFinite(groupId)) {
    throw new Error('Bitrix24_Project_id must be a number');
  }

  const taskOwnerId = ownerParsed ?? legacyResponsible ?? 1;
  const taskAssigneeId = assigneeParsed ?? legacyResponsible ?? 1;

  return { webhook, groupId, taskOwnerId, taskAssigneeId };
}

export function resolveBitrixContext(params: {
  webhook: string;
  projectBitrixId: string;
  taskOwnerId: string;
  taskAssigneeId: string;
}): BitrixEnv {
  const groupId = Number(params.projectBitrixId.trim());
  if (!Number.isFinite(groupId)) {
    throw new Error('Bitrix project id must be a number');
  }
  const owner = Number(params.taskOwnerId.trim());
  const assignee = Number(params.taskAssigneeId.trim());
  if (!Number.isFinite(owner) || !Number.isFinite(assignee)) {
    throw new Error('Task owner and assignee must be numeric Bitrix user ids');
  }
  return {
    webhook: params.webhook.trim(),
    groupId,
    taskOwnerId: owner,
    taskAssigneeId: assignee,
  };
}

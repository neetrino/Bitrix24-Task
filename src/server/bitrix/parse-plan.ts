import type { EpicSpec, Plan, TaskSpec } from '@/server/bitrix/types';

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

function parseTaskSpec(x: unknown, epicPath: string, index: number): TaskSpec {
  if (!isRecord(x)) throw new Error(`${epicPath}: tasks[${index}] must be an object`);
  const title = x.title;
  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error(`${epicPath}: tasks[${index}].title is required`);
  }
  const description = x.description;
  if (description !== undefined && typeof description !== 'string') {
    throw new Error(`${epicPath}: tasks[${index}].description must be a string`);
  }
  return { title: title.trim(), description: description?.trim() };
}

function parseEpicSpec(x: unknown, index: number): EpicSpec {
  const path = `epics[${index}]`;
  if (!isRecord(x)) throw new Error(`${path} must be an object`);
  const name = x.name;
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error(`${path}.name is required`);
  }
  const rawTasks = x.tasks;
  if (!Array.isArray(rawTasks) || rawTasks.length === 0) {
    throw new Error(`${path}.tasks must be a non-empty array`);
  }
  const tasks = rawTasks.map((t, i) => parseTaskSpec(t, path, i));
  const description = x.description;
  if (description !== undefined && typeof description !== 'string') {
    throw new Error(`${path}.description must be a string`);
  }
  return { name: name.trim(), description: description?.trim(), tasks };
}

export function parsePlan(raw: unknown): Plan {
  if (!isRecord(raw)) throw new Error('Plan root must be an object');
  const mode = raw.epic_mode;
  if (mode !== 'scrum' && mode !== 'parent_tasks') {
    throw new Error('epic_mode must be "scrum" or "parent_tasks"');
  }
  const epicsRaw = raw.epics;
  if (!Array.isArray(epicsRaw) || epicsRaw.length === 0) {
    throw new Error('epics must be a non-empty array');
  }
  const epics = epicsRaw.map((e, i) => parseEpicSpec(e, i));
  const project_title = raw.project_title;
  if (project_title !== undefined && typeof project_title !== 'string') {
    throw new Error('project_title must be a string');
  }
  const responsible_id = raw.responsible_id;
  if (responsible_id !== undefined && typeof responsible_id !== 'number') {
    throw new Error('responsible_id must be a number');
  }
  return {
    project_title: project_title?.trim(),
    epic_mode: mode,
    responsible_id,
    epics,
  };
}

export type TaskSpec = {
  title: string;
  description?: string;
};

export type EpicSpec = {
  name: string;
  description?: string;
  tasks: TaskSpec[];
};

export type Plan = {
  project_title?: string;
  epic_mode: 'scrum' | 'parent_tasks';
  responsible_id?: number;
  epics: EpicSpec[];
};

export type TaskAddResult = { task: { id: string } };
export type EpicAddResult = { id: number };

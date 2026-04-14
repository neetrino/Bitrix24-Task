export type TaskSpec = {
  title: string;
  description?: string;
  /** Granularity for planning / export; not sent as a Bitrix field by default. */
  size?: 'small' | 'medium' | 'large';
  syncSelected?: boolean;
  bitrixSynced?: boolean;
  bitrixTaskId?: number;
};

export type EpicSpec = {
  name: string;
  description?: string;
  tasks: TaskSpec[];
  bitrixEpicId?: number;
  bitrixParentTaskId?: number;
};

export type Plan = {
  project_title?: string;
  epic_mode: 'scrum' | 'parent_tasks';
  responsible_id?: number;
  decomposition_level?: 'coarse' | 'balanced' | 'fine';
  decomposition_estimate_note?: string;
  epics: EpicSpec[];
};

export type TaskAddResult = { task: { id: string } };
export type EpicAddResult = { id: number };

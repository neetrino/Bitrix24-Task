import { z } from 'zod';

export const epicModeSchema = z.enum(['scrum', 'parent_tasks']);

export const taskSpecSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const epicSpecSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  tasks: z.array(taskSpecSchema).min(1),
});

export const planSchema = z.object({
  project_title: z.string().optional(),
  epic_mode: epicModeSchema,
  responsible_id: z.number().optional(),
  epics: z.array(epicSpecSchema).min(1),
});

export type PlanPayload = z.infer<typeof planSchema>;
export type EpicPayload = z.infer<typeof epicSpecSchema>;
export type TaskPayload = z.infer<typeof taskSpecSchema>;

export const DEFAULT_PLAN: PlanPayload = {
  epic_mode: 'scrum',
  epics: [
    {
      name: 'Backlog',
      tasks: [{ title: 'First task', description: 'Describe the outcome' }],
    },
  ],
};

export function parsePlanFromJson(raw: unknown): PlanPayload {
  return planSchema.parse(raw);
}

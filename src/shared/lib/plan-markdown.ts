import type { PlanPayload } from '@/shared/domain/plan';

export function planToMarkdown(plan: PlanPayload, fileTitle: string): string {
  const lines: string[] = [`# ${fileTitle}`, ''];
  if (plan.project_title) {
    lines.push(`**Project:** ${plan.project_title}`, '');
  }
  lines.push(`**Mode:** ${plan.epic_mode}`, '');
  for (const epic of plan.epics) {
    lines.push(`## ${epic.name}`, '');
    if (epic.description) {
      lines.push(epic.description, '');
    }
    for (const task of epic.tasks) {
      lines.push(`- ${task.title}`);
      if (task.description) {
        lines.push(`  - ${task.description}`);
      }
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}

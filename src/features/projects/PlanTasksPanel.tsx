import type { PlanPayload } from '@/shared/domain/plan';
import { PlanTasksPanelClient } from '@/features/projects/PlanTasksPanelClient';

export function PlanTasksPanel({
  plan,
  projectId,
  activePhaseId,
}: {
  plan: PlanPayload;
  projectId: string;
  activePhaseId: string | null;
}) {
  return (
    <PlanTasksPanelClient initialPlan={plan} phaseId={activePhaseId} projectId={projectId} />
  );
}

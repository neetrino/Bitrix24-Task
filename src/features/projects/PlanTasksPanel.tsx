import type { PlanPayload } from '@/shared/domain/plan';
import { PlanTasksPanelClient } from '@/features/projects/PlanTasksPanelClient';

export function PlanTasksPanel({
  plan,
  projectId,
  activePhaseId,
  showPlanHeader = true,
}: {
  plan: PlanPayload;
  projectId: string;
  activePhaseId: string | null;
  /** When false, the gradient plan summary is omitted (shown in the left rail). */
  showPlanHeader?: boolean;
}) {
  return (
    <PlanTasksPanelClient
      initialPlan={plan}
      phaseId={activePhaseId}
      projectId={projectId}
      showPlanHeader={showPlanHeader}
    />
  );
}

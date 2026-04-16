import { ChatModelForm } from '@/features/projects/ChatModelForm';
import { SETUP_DETAILS_CLASS, SETUP_SUMMARY_CLASS } from '@/features/projects/setup-panel-classes';
import { PlanEditor } from '@/features/plan-editor/PlanEditor';
import type { PlanPayload } from '@/shared/domain/plan-defaults';
import { WORKSPACE_BODY_CLASS } from '@/shared/ui/workspace-ui';

type ProjectModel = {
  id: string;
  openaiChatModel: string | null;
};

export function AccountSettingsBlocks({
  project,
  activePhaseId,
  plan,
}: {
  project: ProjectModel;
  activePhaseId: string | null;
  plan: PlanPayload;
}) {
  return (
    <div className="flex flex-col gap-2">
      <details className={SETUP_DETAILS_CLASS} open>
        <summary className={SETUP_SUMMARY_CLASS}>AI model</summary>
        <div className="mt-3">
          <ChatModelForm project={project} />
        </div>
      </details>
      <details className={SETUP_DETAILS_CLASS} open>
        <summary className={SETUP_SUMMARY_CLASS}>Advanced · plan JSON</summary>
        <p className={`mt-2 ${WORKSPACE_BODY_CLASS} text-xs`}>
          Edit raw plan if needed; chat usually updates this automatically.
        </p>
        <div className="mt-3">
          <PlanEditor embedded initialPlan={plan} phaseId={activePhaseId} projectId={project.id} />
        </div>
      </details>
    </div>
  );
}

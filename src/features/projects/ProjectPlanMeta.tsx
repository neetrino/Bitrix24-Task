import type { PlanPayload } from '@/shared/domain/plan-defaults';
import { ProjectRailQuickActions } from '@/features/projects/ProjectRailQuickActions';
import { ProjectWorkspaceRailHeader } from '@/features/projects/ProjectWorkspaceRailHeader';
import type { BitrixSettingsProject } from '@/features/projects/BitrixProjectSettingsDialog';
import { SparklesGlyph } from '@/shared/ui/brand-icons';

type ProjectOption = { slug: string; name: string };

/**
 * Project + plan summary for the left workspace rail (top-aligned, compact).
 */
export function ProjectPlanMeta({
  projectName,
  plan,
  projects,
  activeSlug,
  bitrixProject,
  activePhaseId,
}: {
  projectName: string;
  plan: PlanPayload;
  projects: ProjectOption[];
  activeSlug: string;
  bitrixProject: BitrixSettingsProject;
  activePhaseId: string | null;
}) {
  const showSubtitle =
    Boolean(plan.project_title) && plan.project_title !== projectName;

  return (
    <div className="shrink-0 border-b border-workspace-hairline px-2 pb-3 pt-2">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
        <SparklesGlyph className="col-start-1 row-start-1 h-3.5 w-3.5 shrink-0 self-center text-neutral-400" />
        <div className="col-start-2 row-start-1 min-w-0">
          <ProjectWorkspaceRailHeader activeSlug={activeSlug} projects={projects} />
        </div>
        {showSubtitle ? (
          <p className="col-start-2 mt-2 text-left text-sm font-medium text-neutral-300">
            {plan.project_title}
          </p>
        ) : null}
        <div className="col-span-2 mt-2">
          <ProjectRailQuickActions
            activePhaseId={activePhaseId}
            bitrixProject={bitrixProject}
            plan={plan}
            projectName={projectName}
          />
        </div>
      </div>
    </div>
  );
}

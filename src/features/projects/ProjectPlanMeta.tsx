import {
  DECOMPOSITION_LEVEL_DESCRIPTIONS,
  type PlanPayload,
} from '@/shared/domain/plan';
import { SparklesGlyph } from '@/shared/ui/brand-icons';

/**
 * Project + plan summary for the left workspace rail (top-aligned, compact).
 */
export function ProjectPlanMeta({
  projectName,
  plan,
}: {
  projectName: string;
  plan: PlanPayload;
}) {
  const showSubtitle =
    Boolean(plan.project_title) && plan.project_title !== projectName;

  return (
    <div className="shrink-0 border-b border-workspace-hairline px-3 py-3">
      <div className="flex items-start gap-2">
        <SparklesGlyph className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400" />
        <div className="min-w-0 flex-1">
          <h1 className="text-left text-base font-semibold leading-snug tracking-tight text-neutral-100">
            {projectName}
          </h1>
          {showSubtitle ? (
            <p className="mt-1 text-left text-sm font-medium text-neutral-300">{plan.project_title}</p>
          ) : null}
          <div className="mt-2 text-left text-xs leading-relaxed text-neutral-500">
            {plan.decomposition_level ? (
              <p title="Relative depth; task counts scale with project size">
                <span className="font-medium text-neutral-400">Decomposition:</span>{' '}
                {plan.decomposition_level} —{' '}
                {DECOMPOSITION_LEVEL_DESCRIPTIONS[plan.decomposition_level]}
              </p>
            ) : (
              <p className="text-neutral-500">
                No decomposition level yet — the assistant should ask coarse / balanced / fine
                before a full breakdown.
              </p>
            )}
            {plan.decomposition_estimate_note ? (
              <p className="mt-1 text-neutral-500">{plan.decomposition_estimate_note}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

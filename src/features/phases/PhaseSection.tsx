import Link from 'next/link';
import type { Phase } from '@prisma/client';
import { PhaseCreateForm } from '@/features/phases/PhaseCreateForm';
import {
  WORKSPACE_BODY_CLASS,
  WORKSPACE_H2_CLASS,
  WORKSPACE_PANEL_CLASS,
  WORKSPACE_PHASE_ACTIVE_CLASS,
  WORKSPACE_PHASE_IDLE_CLASS,
} from '@/shared/ui/workspace-ui';

export function PhaseSection({
  projectId,
  projectSlug,
  phases,
  activePhaseId,
}: {
  projectId: string;
  projectSlug: string;
  phases: Phase[];
  activePhaseId: string | null;
}) {
  return (
    <section className={`${WORKSPACE_PANEL_CLASS} p-6`}>
      <h2 className={WORKSPACE_H2_CLASS}>Phases</h2>
      <p className={`mt-1 ${WORKSPACE_BODY_CLASS}`}>
        Scope chat and plan snapshots per iteration. Main uses no phase id.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          className={activePhaseId === null ? WORKSPACE_PHASE_ACTIVE_CLASS : WORKSPACE_PHASE_IDLE_CLASS}
          href={`/app/projects/${projectSlug}`}
        >
          Main
        </Link>
        {phases.map((p) => (
          <Link
            className={
              activePhaseId === p.id ? WORKSPACE_PHASE_ACTIVE_CLASS : WORKSPACE_PHASE_IDLE_CLASS
            }
            href={`/app/projects/${projectSlug}?phase=${p.id}`}
            key={p.id}
          >
            {p.label}
          </Link>
        ))}
      </div>
      <div className="mt-6 border-t border-white/10 pt-6">
        <PhaseCreateForm projectId={projectId} />
      </div>
    </section>
  );
}

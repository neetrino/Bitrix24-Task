'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Phase } from '@prisma/client';
import { PhaseCreateForm } from '@/features/phases/PhaseCreateForm';
import {
  WORKSPACE_BODY_CLASS,
  WORKSPACE_PHASE_ACTIVE_CLASS,
  WORKSPACE_PHASE_IDLE_CLASS,
} from '@/shared/ui/workspace-ui';

export function PhasePills({
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
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Phase</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Link
          className={
            activePhaseId === null ? WORKSPACE_PHASE_ACTIVE_CLASS : WORKSPACE_PHASE_IDLE_CLASS
          }
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
        <button
          aria-expanded={addOpen}
          aria-label={addOpen ? 'Close add phase' : 'Add phase'}
          className={`flex h-8 min-w-[2rem] items-center justify-center px-2 font-semibold leading-none ${WORKSPACE_PHASE_IDLE_CLASS}`}
          onClick={() => setAddOpen((v) => !v)}
          type="button"
        >
          +
        </button>
      </div>
      {addOpen ? (
        <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/50 p-3">
          <PhaseCreateForm
            onSuccess={() => setAddOpen(false)}
            projectId={projectId}
            variant="inline"
          />
        </div>
      ) : null}
      <p className={`mt-2 ${WORKSPACE_BODY_CLASS} text-xs`}>
        Chat and plan are scoped to this phase.
      </p>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Phase } from '@prisma/client';
import { PhaseCreateForm } from '@/features/phases/PhaseCreateForm';

const PHASE_ROW_ACTIVE =
  'bg-white/12 text-slate-100 shadow-[inset_3px_0_0_0_rgba(139,92,246,0.85)]';
const PHASE_ROW_IDLE =
  'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200';

function phaseRowClass(isActive: boolean): string {
  const base =
    'flex w-full min-w-0 items-center rounded-lg px-2.5 py-2 text-left text-sm font-medium transition';
  return `${base} ${isActive ? PHASE_ROW_ACTIVE : PHASE_ROW_IDLE}`;
}

/**
 * Vertical phase list (ChatGPT-style sidebar “chats” rail).
 */
export function PhaseSidebarNav({
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
    <nav aria-label="Phases" className="flex shrink-0 flex-col border-b border-white/10 px-2 py-2">
      <p className="px-2 pb-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
        Phases
      </p>
      <div className="flex flex-col gap-0.5">
        <Link
          className={phaseRowClass(activePhaseId === null)}
          href={`/app/projects/${projectSlug}`}
        >
          <span className="min-w-0 truncate">Main</span>
        </Link>
        {phases.map((p) => (
          <Link
            className={phaseRowClass(activePhaseId === p.id)}
            href={`/app/projects/${projectSlug}?phase=${p.id}`}
            key={p.id}
          >
            <span className="min-w-0 truncate">{p.label}</span>
          </Link>
        ))}
        <button
          aria-expanded={addOpen}
          className={`${phaseRowClass(false)} gap-2 text-slate-500 hover:text-slate-300`}
          onClick={() => setAddOpen((v) => !v)}
          type="button"
        >
          <span aria-hidden className="text-base leading-none">
            +
          </span>
          <span className="min-w-0 truncate text-sm font-medium">New phase</span>
        </button>
      </div>
      {addOpen ? (
        <div className="mt-2 rounded-lg border border-white/10 bg-slate-950/50 p-2">
          <PhaseCreateForm
            onSuccess={() => setAddOpen(false)}
            projectId={projectId}
            variant="inline"
          />
        </div>
      ) : null}
    </nav>
  );
}

import Link from 'next/link';
import type { Phase } from '@prisma/client';
import { PhaseCreateForm } from '@/features/phases/PhaseCreateForm';

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
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Phases</h2>
      <p className="mt-1 text-sm text-slate-600">
        Scope chat and plan snapshots per iteration. Main uses no phase id.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          className={`rounded-full px-3 py-1 text-sm ${
            activePhaseId === null
              ? 'bg-slate-900 text-white'
              : 'border border-slate-300 text-slate-800 hover:bg-slate-50'
          }`}
          href={`/app/projects/${projectSlug}`}
        >
          Main
        </Link>
        {phases.map((p) => (
          <Link
            className={`rounded-full px-3 py-1 text-sm ${
              activePhaseId === p.id
                ? 'bg-slate-900 text-white'
                : 'border border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
            href={`/app/projects/${projectSlug}?phase=${p.id}`}
            key={p.id}
          >
            {p.label}
          </Link>
        ))}
      </div>
      <div className="mt-6 border-t border-slate-100 pt-6">
        <PhaseCreateForm projectId={projectId} />
      </div>
    </section>
  );
}

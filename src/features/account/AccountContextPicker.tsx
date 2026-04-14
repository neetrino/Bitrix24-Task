'use client';

import { useRouter } from 'next/navigation';
import { accountSettingsPath } from '@/features/account/account-settings-path';
import {
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_LABEL_CLASS,
} from '@/shared/ui/workspace-ui';

type PhaseOption = { id: string; label: string };
type ProjectOption = { slug: string; name: string; phases: PhaseOption[] };

export function AccountContextPicker({
  projects,
  activeProjectSlug,
  activePhaseId,
}: {
  projects: ProjectOption[];
  activeProjectSlug: string;
  activePhaseId: string | null;
}) {
  const router = useRouter();

  function onProjectChange(slug: string) {
    const p = projects.find((x) => x.slug === slug);
    const nextPhase = p?.phases[0]?.id ?? null;
    router.push(accountSettingsPath(slug, nextPhase));
  }

  function onPhaseChange(phaseId: string) {
    router.push(accountSettingsPath(activeProjectSlug, phaseId || null));
  }

  const activeProject = projects.find((p) => p.slug === activeProjectSlug);
  const phases = activeProject?.phases ?? [];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-[min(100%,220px)] flex-1 flex-col gap-1.5">
        <label className={WORKSPACE_LABEL_CLASS} htmlFor="account-project-select">
          Project
        </label>
        <select
          className={WORKSPACE_FIELD_CLASS}
          id="account-project-select"
          onChange={(e) => onProjectChange(e.target.value)}
          value={activeProjectSlug}
        >
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      {phases.length > 0 ? (
        <div className="flex min-w-[min(100%,220px)] flex-1 flex-col gap-1.5">
          <label className={WORKSPACE_LABEL_CLASS} htmlFor="account-phase-select">
            Phase
          </label>
          <select
            className={WORKSPACE_FIELD_CLASS}
            id="account-phase-select"
            onChange={(e) => onPhaseChange(e.target.value)}
            value={activePhaseId ?? phases[0]?.id ?? ''}
          >
            {phases.map((ph) => (
              <option key={ph.id} value={ph.id}>
                {ph.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}

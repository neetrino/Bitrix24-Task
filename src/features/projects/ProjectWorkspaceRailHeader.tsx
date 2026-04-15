'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { isBitrixProjectConnectionComplete } from '@/features/bitrix-sync/bitrix-project-connection-status';
import {
  BitrixProjectSettingsDialog,
  type BitrixSettingsProject,
} from '@/features/projects/BitrixProjectSettingsDialog';
import { WORKSPACE_FIELD_CLASS } from '@/shared/ui/workspace-ui';

const CONNECTION_BTN_BASE =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition focus:outline-none focus:ring-2 focus:ring-violet-500/35';

/** Needs Bitrix project / owner / assignee ids */
const CONNECTION_BTN_INCOMPLETE_CLASS = `${CONNECTION_BTN_BASE} border border-amber-500/55 bg-amber-950/35 text-amber-100 hover:border-amber-400/70 hover:bg-amber-950/55`;

/** All project-scoped Bitrix fields set */
const CONNECTION_BTN_COMPLETE_CLASS = `${CONNECTION_BTN_BASE} border border-emerald-600/40 bg-slate-800 text-emerald-200/95 hover:border-emerald-500/55 hover:bg-slate-700/80`;

const PROJECT_TRIGGER_CLASS = `${WORKSPACE_FIELD_CLASS} flex w-full min-w-0 items-center justify-between gap-2 py-2 text-left text-lg font-semibold leading-snug tracking-tight text-neutral-100`;

type ProjectOption = { slug: string; name: string };

function ProjectSwitcherDropdown({
  projects,
  activeSlug,
  onSelect,
}: {
  projects: ProjectOption[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const active = projects.find((p) => p.slug === activeSlug);

  useEffect(() => {
    if (!open) return;
    function onDocDown(e: MouseEvent) {
      if (wrapRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function pick(slug: string) {
    onSelect(slug);
    setOpen(false);
  }

  return (
    <div className="relative min-w-0 flex-1" ref={wrapRef}>
      <button
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={PROJECT_TRIGGER_CLASS}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className="min-w-0 truncate">{active?.name ?? activeSlug}</span>
        <svg
          aria-hidden
          className={`h-4 w-4 shrink-0 text-neutral-400 transition ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      </button>
      {open ? (
        <ul
          className="absolute left-0 right-0 top-full z-40 mt-1 max-h-60 overflow-auto rounded-lg border border-white/10 bg-workspace-elevated py-1 shadow-lg shadow-black/40"
          id={listId}
          role="listbox"
        >
          {projects.map((p) => {
            const selected = p.slug === activeSlug;
            return (
              <li key={p.slug} role="presentation">
                <button
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-white/[0.06] ${
                    selected ? 'font-medium text-neutral-100' : 'text-neutral-300'
                  }`}
                  onClick={() => pick(p.slug)}
                  role="option"
                  type="button"
                  aria-selected={selected}
                >
                  {selected ? (
                    <span aria-hidden className="w-4 shrink-0 text-neutral-400">
                      ✓
                    </span>
                  ) : (
                    <span className="w-4 shrink-0" />
                  )}
                  <span className="min-w-0 truncate">{p.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function ProjectWorkspaceRailHeader({
  projects,
  activeSlug,
  project,
  activePhaseId,
}: {
  projects: ProjectOption[];
  activeSlug: string;
  project: BitrixSettingsProject;
  activePhaseId: string | null;
}) {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const connected = isBitrixProjectConnectionComplete(project);

  function onProjectChange(slug: string) {
    if (slug === activeSlug) return;
    router.push(`/app/projects/${slug}`);
  }

  return (
    <>
      <div className="flex min-w-0 items-center gap-2">
        <ProjectSwitcherDropdown activeSlug={activeSlug} onSelect={onProjectChange} projects={projects} />
        <button
          aria-label="Bitrix connection settings"
          className={connected ? CONNECTION_BTN_COMPLETE_CLASS : CONNECTION_BTN_INCOMPLETE_CLASS}
          onClick={() => setSettingsOpen(true)}
          title={connected ? 'Bitrix: connected' : 'Bitrix: configure connection'}
          type="button"
        >
          <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
              className="stroke-current"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
            />
          </svg>
        </button>
      </div>
      <BitrixProjectSettingsDialog
        activePhaseId={activePhaseId}
        onClose={() => setSettingsOpen(false)}
        open={settingsOpen}
        project={project}
      />
    </>
  );
}

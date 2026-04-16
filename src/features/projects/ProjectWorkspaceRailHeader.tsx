'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

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

  const triggerClass = [
    'flex w-full min-w-0 items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-lg font-semibold leading-snug tracking-tight text-neutral-100',
    'border transition-colors',
    open
      ? 'border-white/[0.08] bg-white/[0.03]'
      : 'border-transparent hover:border-white/[0.08]',
    'focus:outline-none focus:ring-2 focus:ring-violet-500/25',
  ].join(' ');

  return (
    <div className="relative min-w-0 flex-1" ref={wrapRef}>
      <button
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={triggerClass}
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
}: {
  projects: ProjectOption[];
  activeSlug: string;
}) {
  const router = useRouter();

  function onProjectChange(slug: string) {
    if (slug === activeSlug) return;
    router.push(`/app/projects/${slug}`);
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <ProjectSwitcherDropdown activeSlug={activeSlug} onSelect={onProjectChange} projects={projects} />
    </div>
  );
}

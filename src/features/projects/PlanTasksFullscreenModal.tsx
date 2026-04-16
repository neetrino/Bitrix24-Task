'use client';

import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { PlanPayload } from '@/shared/domain/plan-defaults';
import {
  buildFlatPlanTasks,
  filterFlatPlanTasks,
  type FlatPlanTaskRow,
} from '@/features/projects/plan-tasks-iterate';
import { SyncToolbar } from '@/features/bitrix-sync/SyncToolbar';
import { PlanTaskRowCard } from '@/features/projects/PlanTaskRowCard';
import { ALL_TASKS_PANEL_DOM_ID, TASKS_PHASE_RAIL_WIDTH_CLASS } from '@/features/projects/plan-tasks-layout';
import {
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_GHOST_BTN_CLASS,
  WORKSPACE_H2_CLASS,
} from '@/shared/ui/workspace-ui';

type EditingTarget = { epicIndex: number; taskIndex: number };

type TasksViewMode = 'grid' | 'list';

/** Slide-in animation from the right; see `tasks-drawer-panel-enter` in globals.css. */
const TASKS_DRAWER_PANEL_ENTER_CLASS = 'tasks-drawer-panel-enter';

const VIEW_TOGGLE_SHELL_CLASS =
  'flex shrink-0 rounded-lg border border-white/10 bg-neutral-900/60 p-0.5 sm:ml-auto';
const VIEW_TOGGLE_ACTIVE_CLASS = 'bg-neutral-800 text-neutral-100 ring-1 ring-white/10';
const VIEW_TOGGLE_IDLE_CLASS = 'text-neutral-500 hover:text-neutral-200';

export function PlanTasksFullscreenModal({
  open,
  onClose,
  plan,
  title = 'All tasks',
  search,
  onSearchChange,
  editing,
  draftTitle,
  draftDescription,
  onDraftTitleChange,
  onDraftDescriptionChange,
  onBeginEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteEdit,
  onToggleSync,
  savePending,
  planLoading = false,
  fetchError = null,
  projectId,
  phaseId,
  exportMarkdownHref,
}: {
  open: boolean;
  onClose: () => void;
  plan: PlanPayload;
  projectId: string;
  phaseId: string | null;
  exportMarkdownHref: string;
  title?: string;
  search: string;
  onSearchChange: (value: string) => void;
  editing: EditingTarget | null;
  draftTitle: string;
  draftDescription: string;
  onDraftTitleChange: (value: string) => void;
  onDraftDescriptionChange: (value: string) => void;
  onBeginEdit: (row: FlatPlanTaskRow) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDeleteEdit: () => void;
  onToggleSync: (row: FlatPlanTaskRow) => void;
  /** True while task edit save is in flight (does not block Select/Deselect). */
  savePending: boolean;
  planLoading?: boolean;
  /** When set, plan fetch failed; details are shown via global toast. */
  fetchError?: string | null;
}) {
  const titleId = useId();
  const searchId = useId();
  const tasksLayoutRegionId = useId();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<TasksViewMode>('grid');
  const rows = useMemo(() => buildFlatPlanTasks(plan), [plan]);
  const filtered = useMemo(() => filterFlatPlanTasks(rows, search), [rows, search]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const content: ReactNode = (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-[100] flex min-h-0 w-full flex-row pointer-events-none"
      role="dialog"
    >
      {/*
        Reserve width on lg+ so the tasks panel aligns with the chat column; the shell has
        pointer-events-none so clicks reach the phase rail. Only the panel re-enables hit targets.
      */}
      <div
        aria-hidden
        className={`pointer-events-none hidden shrink-0 lg:block ${TASKS_PHASE_RAIL_WIDTH_CLASS}`}
      />
      <div
        className={`relative z-[101] flex h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden border border-white/[0.08] border-r-0 bg-workspace-elevated shadow-none lg:rounded-none pointer-events-auto ${TASKS_DRAWER_PANEL_ENTER_CLASS}`}
        id={ALL_TASKS_PANEL_DOM_ID}
      >
        <div className="flex shrink-0 flex-col gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className={WORKSPACE_H2_CLASS} id={titleId}>
                {title}
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">{filtered.length} tasks</p>
            </div>
            <button
              className={`shrink-0 ${WORKSPACE_GHOST_BTN_CLASS} px-2.5 py-1.5 text-xs`}
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <div className="min-w-0 flex-1 sm:min-w-[12rem]">
              <label className="sr-only" htmlFor={searchId}>
                Search tasks
              </label>
              <input
                className={`w-full ${WORKSPACE_FIELD_CLASS} text-xs`}
                id={searchId}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tasks…"
                type="search"
                value={search}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:min-w-0 sm:justify-end">
              <SyncToolbar compact phaseId={phaseId} projectId={projectId} variant="syncOnly" />
              <a
                className={`inline-flex shrink-0 items-center justify-center ${WORKSPACE_GHOST_BTN_CLASS} px-2 py-1 text-xs`}
                download
                href={exportMarkdownHref}
              >
                Markdown
              </a>
            </div>
            <div className={VIEW_TOGGLE_SHELL_CLASS} role="group" aria-label="Task layout">
              <button
                aria-controls={tasksLayoutRegionId}
                aria-pressed={viewMode === 'grid'}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  viewMode === 'grid' ? VIEW_TOGGLE_ACTIVE_CLASS : VIEW_TOGGLE_IDLE_CLASS
                }`}
                onClick={() => setViewMode('grid')}
                type="button"
              >
                Grid
              </button>
              <button
                aria-controls={tasksLayoutRegionId}
                aria-pressed={viewMode === 'list'}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  viewMode === 'list' ? VIEW_TOGGLE_ACTIVE_CLASS : VIEW_TOGGLE_IDLE_CLASS
                }`}
                onClick={() => setViewMode('list')}
                type="button"
              >
                List
              </button>
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-workspace-canvas px-4 py-4 scrollbar-workspace-subtle sm:px-5">
          {planLoading ? (
            <p className="py-12 text-center text-sm text-neutral-400">Loading plan…</p>
          ) : null}
          {!planLoading && fetchError ? (
            <p className="py-8 text-center text-sm text-neutral-400">
              Could not load plan for this phase.
            </p>
          ) : null}
          {!planLoading && !fetchError ? (
            <>
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'
                    : 'flex flex-col gap-2'
                }
                id={tasksLayoutRegionId}
              >
                {filtered.map((row) => {
                  const isEditing =
                    editing?.epicIndex === row.epicIndex && editing?.taskIndex === row.taskIndex;
                  return (
                    <PlanTaskRowCard
                      draftDescription={draftDescription}
                      draftTitle={draftTitle}
                      isEditing={isEditing}
                      key={`${row.epicIndex}-${row.taskIndex}`}
                      onBeginEdit={() => onBeginEdit(row)}
                      onCancelEdit={onCancelEdit}
                      onDeleteEdit={onDeleteEdit}
                      onDraftDescriptionChange={onDraftDescriptionChange}
                      onDraftTitleChange={onDraftTitleChange}
                      onSaveEdit={onSaveEdit}
                      onToggleSync={() => onToggleSync(row)}
                      savePending={savePending}
                      row={row}
                      variant={viewMode === 'grid' ? 'grid' : 'list'}
                    />
                  );
                })}
              </div>
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-xs text-neutral-500">No tasks match your search.</p>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

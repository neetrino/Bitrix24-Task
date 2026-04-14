'use client';

import Link from 'next/link';
import {
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_GHOST_BTN_CLASS,
} from '@/shared/ui/workspace-ui';
import { isTaskSyncChecked, type FlatPlanTaskRow } from '@/features/projects/plan-tasks-iterate';

const LIST_WRAP =
  'rounded-lg border px-2 py-1.5 outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500/40';
const GRID_WRAP =
  'rounded-xl border px-3 py-3 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500/40';

export function PlanTaskRowCard({
  row,
  variant,
  isEditing,
  draftTitle,
  draftDescription,
  onDraftTitleChange,
  onDraftDescriptionChange,
  onBeginEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleSync,
  pending,
  taskHref,
  onNavigateTask,
}: {
  row: FlatPlanTaskRow;
  variant: 'list' | 'grid';
  isEditing: boolean;
  draftTitle: string;
  draftDescription: string;
  onDraftTitleChange: (value: string) => void;
  onDraftDescriptionChange: (value: string) => void;
  onBeginEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onToggleSync: () => void;
  pending: boolean;
  /** When set, shows an “Open” link (e.g. same project page + `#task-e-t`). */
  taskHref?: string;
  onNavigateTask?: () => void;
}) {
  if (isEditing) {
    return (
      <div className="space-y-2 rounded-lg border border-violet-500/25 bg-slate-950/50 p-2">
        <input
          className={`w-full ${WORKSPACE_FIELD_CLASS} text-xs`}
          onChange={(e) => onDraftTitleChange(e.target.value)}
          value={draftTitle}
        />
        <textarea
          className={`min-h-[72px] w-full resize-y ${WORKSPACE_FIELD_CLASS} text-xs`}
          onChange={(e) => onDraftDescriptionChange(e.target.value)}
          placeholder="Description (optional)"
          value={draftDescription}
        />
        <div className="flex flex-wrap gap-2">
          <button
            className={WORKSPACE_GHOST_BTN_CLASS}
            disabled={pending}
            onClick={onCancelEdit}
            type="button"
          >
            Cancel
          </button>
          <button
            className={WORKSPACE_GHOST_BTN_CLASS}
            disabled={pending}
            onClick={onSaveEdit}
            type="button"
          >
            {pending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  const wrapClass =
    variant === 'list' ? LIST_WRAP : GRID_WRAP;
  const selected = isTaskSyncChecked(row.task);
  const stateClass = selected
    ? 'cursor-pointer border-emerald-500/40 bg-emerald-500/[0.12] hover:bg-emerald-500/[0.16]'
    : 'cursor-pointer border-white/[0.08] bg-slate-900/50 hover:bg-slate-800/60';

  return (
    <div
      aria-pressed={selected}
      className={`${wrapClass} ${stateClass} ${pending ? 'pointer-events-none opacity-70' : ''}`}
      onClick={onToggleSync}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleSync();
        }
      }}
      role="button"
      tabIndex={0}
      title={
        selected
          ? 'Selected for Bitrix sync — click to exclude'
          : 'Not selected for Bitrix sync — click to include'
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="flex min-w-0 flex-1 flex-wrap items-baseline gap-2 text-sm text-slate-200">
          <span className="shrink-0 tabular-nums font-mono text-[10px] font-medium text-slate-500">
            {row.displayNumber}
          </span>
          {row.task.bitrixSynced ? (
            <span
              className="shrink-0 rounded border border-emerald-500/35 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300/95"
              title="This task was pushed to Bitrix"
            >
              Bitrix
            </span>
          ) : null}
          <span
            className={
              variant === 'grid'
                ? 'min-w-0 font-medium leading-snug text-slate-100'
                : 'min-w-0'
            }
          >
            {row.task.title}
          </span>
        </p>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          {taskHref ? (
            <Link
              className="rounded border border-white/12 px-2 py-0.5 text-[10px] font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
              href={taskHref}
              onClick={(e) => {
                e.stopPropagation();
                onNavigateTask?.();
              }}
            >
              Open
            </Link>
          ) : null}
          <button
            className="shrink-0 rounded border border-white/12 px-2 py-0.5 text-[10px] font-medium text-slate-400 transition hover:border-white/20 hover:text-slate-200"
            onClick={(e) => {
              e.stopPropagation();
              onBeginEdit();
            }}
            type="button"
          >
            Edit
          </button>
        </div>
      </div>
      {row.task.description ? (
        <p
          className={`mt-0.5 text-xs leading-snug text-slate-500 ${variant === 'grid' ? 'line-clamp-3' : ''}`}
        >
          {row.task.description}
        </p>
      ) : null}
      {variant === 'grid' ? (
        <p className="mt-2 truncate text-[10px] uppercase tracking-wide text-slate-600">{row.epicName}</p>
      ) : null}
    </div>
  );
}

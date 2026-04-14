'use client';

import {
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_GHOST_BTN_CLASS,
} from '@/shared/ui/workspace-ui';
import { isTaskSyncChecked, type FlatPlanTaskRow } from '@/features/projects/plan-tasks-iterate';

const LIST_WRAP =
  'rounded-lg border px-2 py-1.5 outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500/40';
const GRID_WRAP =
  'rounded-xl border px-3 py-3 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500/40';

const CHECKBOX_WRAP_CLASS =
  'shrink-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100';

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

  const wrapClass = variant === 'list' ? LIST_WRAP : GRID_WRAP;
  const syncSelected = isTaskSyncChecked(row.task);
  const stateClass = syncSelected
    ? 'cursor-pointer border-emerald-500/40 bg-emerald-500/[0.12] hover:bg-emerald-500/[0.16]'
    : 'cursor-pointer border-white/[0.08] bg-slate-900/50 hover:bg-slate-800/60';

  return (
    <div
      className={`group relative ${wrapClass} ${stateClass} ${pending ? 'pointer-events-none opacity-70' : ''}`}
      onClick={() => {
        if (pending) return;
        onBeginEdit();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!pending) onBeginEdit();
        }
      }}
      role="button"
      tabIndex={0}
      title="Click to edit. Use the checkbox to include or exclude from Bitrix sync."
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <div className={`flex shrink-0 items-center pt-0.5 ${CHECKBOX_WRAP_CLASS}`}>
            <input
              aria-label={
                syncSelected ? 'Included in Bitrix sync — click to exclude' : 'Not included in Bitrix sync — click to include'
              }
              checked={syncSelected}
              className="h-3.5 w-3.5 cursor-pointer rounded border-white/25 bg-slate-900 text-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              onChange={(e) => {
                e.stopPropagation();
                onToggleSync();
              }}
              onClick={(e) => e.stopPropagation()}
              type="checkbox"
            />
          </div>
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
        </div>
      </div>
      {row.task.description ? (
        <p
          className={`mt-0.5 text-xs leading-snug text-slate-500 ${variant === 'grid' ? 'line-clamp-3' : ''}`}
        >
          {row.task.description}
        </p>
      ) : null}
      <p className="mt-2 truncate text-[10px] uppercase tracking-wide text-slate-600">{row.epicName}</p>
    </div>
  );
}

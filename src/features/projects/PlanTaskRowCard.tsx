'use client';

import {
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_GHOST_BTN_CLASS,
} from '@/shared/ui/workspace-ui';
import { isTaskSyncChecked, type FlatPlanTaskRow } from '@/features/projects/plan-tasks-iterate';

const LIST_WRAP =
  'rounded-lg border px-2 py-1 outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500/40';
const GRID_WRAP =
  'rounded-xl border px-3 py-3 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500/40';

const SYNC_BTN_BASE =
  'shrink-0 rounded-lg border text-[10px] font-semibold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50';

const SYNC_BTN_SIZE_LIST = 'px-2 py-1';
const SYNC_BTN_SIZE_GRID = 'px-2.5 py-1.5';

function syncToggleButtonClass(syncSelected: boolean, variant: 'list' | 'grid'): string {
  const size = variant === 'list' ? SYNC_BTN_SIZE_LIST : SYNC_BTN_SIZE_GRID;
  if (syncSelected) {
    return `${SYNC_BTN_BASE} ${size} border-amber-400/50 bg-amber-950/60 text-amber-100/95 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.14)] hover:border-amber-300/60 hover:bg-amber-900/45 focus-visible:ring-amber-500/50`;
  }
  return `${SYNC_BTN_BASE} ${size} border-emerald-500/45 bg-emerald-950/55 text-emerald-100/95 shadow-[inset_0_1px_0_0_rgba(52,211,153,0.12)] hover:border-emerald-400/60 hover:bg-emerald-900/45 focus-visible:ring-emerald-500/50`;
}

const SYNC_BTN_REVEAL =
  'opacity-100 transition-opacity duration-150 [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-opacity [@media(hover:hover)]:duration-150 [@media(hover:hover)]:group-hover:pointer-events-auto [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:pointer-events-auto [@media(hover:hover)]:group-focus-within:opacity-100';

const BITRIX_BADGE_CLASS =
  'shrink-0 rounded border border-emerald-500/35 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300/95';

type ListRowProps = {
  row: FlatPlanTaskRow;
  syncSelected: boolean;
  onToggleSync: () => void;
};

function PlanTaskListRow({ row, syncSelected, onToggleSync }: ListRowProps) {
  return (
    <div className="flex min-w-0 flex-nowrap items-center gap-2 text-sm">
      <span className="shrink-0 tabular-nums font-mono text-[10px] font-medium text-slate-500">
        {row.displayNumber}
      </span>
      {row.task.bitrixSynced ? (
        <span className={BITRIX_BADGE_CLASS} title="This task was pushed to Bitrix">
          Bitrix
        </span>
      ) : null}
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
        <span className="min-w-0 flex-[2_1_0%] truncate font-medium text-slate-100">{row.task.title}</span>
        {row.task.description ? (
          <span className="min-w-0 flex-[3_1_0%] truncate text-xs text-slate-500" title={row.task.description}>
            {row.task.description}
          </span>
        ) : null}
      </div>
      <span
        className="max-w-32 shrink truncate text-[10px] uppercase tracking-wide text-slate-600"
        title={row.epicName}
      >
        {row.epicName}
      </span>
      <button
        aria-pressed={syncSelected}
        className={`${syncToggleButtonClass(syncSelected, 'list')} ${SYNC_BTN_REVEAL}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSync();
        }}
        type="button"
      >
        {syncSelected ? 'Deselect' : 'Select'}
      </button>
    </div>
  );
}

type GridRowProps = {
  row: FlatPlanTaskRow;
  syncSelected: boolean;
  onToggleSync: () => void;
};

function PlanTaskGridRow({ row, syncSelected, onToggleSync }: GridRowProps) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="flex min-w-0 flex-1 flex-wrap items-baseline gap-2 text-sm text-slate-200">
          <span className="shrink-0 tabular-nums font-mono text-[10px] font-medium text-slate-500">
            {row.displayNumber}
          </span>
          {row.task.bitrixSynced ? (
            <span className={BITRIX_BADGE_CLASS} title="This task was pushed to Bitrix">
              Bitrix
            </span>
          ) : null}
          <span className="min-w-0 font-medium leading-snug text-slate-100">{row.task.title}</span>
        </p>
        <button
          aria-pressed={syncSelected}
          className={`${syncToggleButtonClass(syncSelected, 'grid')} ${SYNC_BTN_REVEAL}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSync();
          }}
          type="button"
        >
          {syncSelected ? 'Deselect' : 'Select'}
        </button>
      </div>
      {row.task.description ? (
        <p className="mt-0.5 line-clamp-3 text-xs leading-snug text-slate-500">{row.task.description}</p>
      ) : null}
      <p className="mt-2 truncate text-[10px] uppercase tracking-wide text-slate-600">{row.epicName}</p>
    </>
  );
}

type EditFormProps = {
  draftTitle: string;
  draftDescription: string;
  onDraftTitleChange: (value: string) => void;
  onDraftDescriptionChange: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  savePending: boolean;
};

function PlanTaskRowEditForm({
  draftTitle,
  draftDescription,
  onDraftTitleChange,
  onDraftDescriptionChange,
  onCancelEdit,
  onSaveEdit,
  savePending,
}: EditFormProps) {
  return (
    <div
      className={`space-y-2 rounded-lg border border-violet-500/25 bg-slate-950/50 p-2 ${savePending ? 'pointer-events-none opacity-70' : ''}`}
    >
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
        <button className={WORKSPACE_GHOST_BTN_CLASS} disabled={savePending} onClick={onCancelEdit} type="button">
          Cancel
        </button>
        <button className={WORKSPACE_GHOST_BTN_CLASS} disabled={savePending} onClick={onSaveEdit} type="button">
          {savePending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

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
  savePending,
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
  /** Only for inline save (Cancel/Save); does not block sync toggles on other cards. */
  savePending: boolean;
}) {
  if (isEditing) {
    return (
      <PlanTaskRowEditForm
        draftDescription={draftDescription}
        draftTitle={draftTitle}
        onCancelEdit={onCancelEdit}
        onDraftDescriptionChange={onDraftDescriptionChange}
        onDraftTitleChange={onDraftTitleChange}
        onSaveEdit={onSaveEdit}
        savePending={savePending}
      />
    );
  }

  const wrapClass = variant === 'list' ? LIST_WRAP : GRID_WRAP;
  const syncSelected = isTaskSyncChecked(row.task);
  const stateClass = syncSelected
    ? 'cursor-pointer border-emerald-500/40 bg-emerald-500/[0.12] hover:bg-emerald-500/[0.16]'
    : 'cursor-pointer border-white/[0.08] bg-slate-900/50 hover:bg-slate-800/60';

  return (
    <div
      className={`group ${wrapClass} ${stateClass}`}
      onClick={onBeginEdit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onBeginEdit();
        }
      }}
      role="button"
      tabIndex={0}
      title="Click the card to edit. Hover to show Select/Deselect for Bitrix sync."
    >
      {variant === 'list' ? (
        <PlanTaskListRow onToggleSync={onToggleSync} row={row} syncSelected={syncSelected} />
      ) : (
        <PlanTaskGridRow onToggleSync={onToggleSync} row={row} syncSelected={syncSelected} />
      )}
    </div>
  );
}

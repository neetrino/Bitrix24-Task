'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  DECOMPOSITION_LEVEL_DESCRIPTIONS,
  type PlanPayload,
} from '@/shared/domain/plan';
import { savePlanSnapshot } from '@/features/plan-editor/plan-actions';
import { setPlanTaskSyncSelected } from '@/features/bitrix-sync/plan-sync-actions';
import {
  buildFlatPlanTasks,
  filterFlatPlanTasks,
  groupRowsByEpicOrder,
  isTaskSyncChecked,
  updateTaskInPlan,
  updateTaskSyncInPlan,
  type FlatPlanTaskRow,
} from '@/features/projects/plan-tasks-iterate';
import { PlanTasksFullscreenModal } from '@/features/projects/PlanTasksFullscreenModal';
import { PlanTaskRowCard } from '@/features/projects/PlanTaskRowCard';
import { SparklesGlyph } from '@/shared/ui/brand-icons';
import {
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_GHOST_BTN_CLASS,
  WORKSPACE_PANEL_CLASS,
} from '@/shared/ui/workspace-ui';

type EditingTarget = { epicIndex: number; taskIndex: number };

export function PlanTasksPanelClient({
  initialPlan,
  projectId,
  projectSlug,
  phaseId,
  showPlanHeader = true,
}: {
  initialPlan: PlanPayload;
  projectId: string;
  projectSlug: string;
  phaseId: string | null;
  showPlanHeader?: boolean;
}) {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanPayload>(initialPlan);
  const [search, setSearch] = useState('');
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [editing, setEditing] = useState<EditingTarget | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [syncNote, setSyncNote] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith('#task-')) return;
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  const taskHrefFor = useCallback(
    (row: FlatPlanTaskRow) => {
      const base = `/app/projects/${projectSlug}`;
      const phaseQ = phaseId ? `?phase=${phaseId}` : '';
      return `${base}${phaseQ}#task-${row.epicIndex}-${row.taskIndex}`;
    },
    [phaseId, projectSlug],
  );

  const flat = useMemo(() => buildFlatPlanTasks(plan), [plan]);
  const filtered = useMemo(() => filterFlatPlanTasks(flat, search), [flat, search]);
  const grouped = useMemo(() => groupRowsByEpicOrder(plan, filtered), [plan, filtered]);

  const beginEdit = useCallback((row: FlatPlanTaskRow) => {
    setEditing({ epicIndex: row.epicIndex, taskIndex: row.taskIndex });
    setDraftTitle(row.task.title);
    setDraftDescription(row.task.description ?? '');
    setSaveNote(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditing(null);
    setDraftTitle('');
    setDraftDescription('');
  }, []);

  const saveEdit = useCallback(() => {
    if (!editing) return;
    const next = updateTaskInPlan(
      plan,
      editing.epicIndex,
      editing.taskIndex,
      draftTitle,
      draftDescription,
    );
    setSaveNote(null);
    startTransition(async () => {
      const res = await savePlanSnapshot(projectId, phaseId, JSON.stringify(next));
      if (res && 'error' in res && res.error) {
        setSaveNote(res.error);
        return;
      }
      setPlan(next);
      setEditing(null);
      setDraftTitle('');
      setDraftDescription('');
      router.refresh();
    });
  }, [draftDescription, draftTitle, editing, phaseId, plan, projectId, router]);

  const toggleRowBitrixSync = useCallback(
    (row: FlatPlanTaskRow) => {
      const nextSelected = !isTaskSyncChecked(row.task);
      setSyncNote(null);
      startTransition(async () => {
        const res = await setPlanTaskSyncSelected(
          projectId,
          phaseId,
          row.epicIndex,
          row.taskIndex,
          nextSelected,
        );
        if ('error' in res && res.error) {
          setSyncNote(res.error);
          return;
        }
        setPlan((p) =>
          updateTaskSyncInPlan(p, row.epicIndex, row.taskIndex, nextSelected),
        );
        router.refresh();
      });
    },
    [phaseId, projectId, router],
  );

  return (
    <div className={`flex h-full min-h-0 flex-col ${WORKSPACE_PANEL_CLASS}`}>
      {showPlanHeader ? (
        <div className="border-b border-white/10 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 px-3 py-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 text-left">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-violet-200/90">
                <SparklesGlyph className="h-3.5 w-3.5 text-cyan-300" />
                AI plan
              </div>
              {plan.project_title ? (
                <p className="mt-1 text-sm font-medium text-slate-100">{plan.project_title}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">Structured tasks from the latest snapshot</p>
              )}
              {plan.decomposition_level ? (
                <div className="mt-1 space-y-1 text-xs leading-snug text-slate-400">
                  <p title="Relative depth; task counts scale with project size">
                    <span className="font-medium text-slate-300">Decomposition:</span>{' '}
                    {plan.decomposition_level} —{' '}
                    {DECOMPOSITION_LEVEL_DESCRIPTIONS[plan.decomposition_level]}
                  </p>
                  {plan.decomposition_estimate_note ? (
                    <p className="text-slate-500">{plan.decomposition_estimate_note}</p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  No decomposition level yet — the assistant should ask coarse / balanced / fine (with
                  scope-specific estimates) before a full breakdown.
                </p>
              )}
            </div>
            <button
              className={`${WORKSPACE_GHOST_BTN_CLASS} shrink-0 whitespace-nowrap text-[11px]`}
              onClick={() => setFullscreenOpen(true)}
              type="button"
            >
              View all
            </button>
          </div>
        </div>
      ) : null}

      <div className="shrink-0 border-b border-white/10 px-3 py-2">
        <div className={`flex min-w-0 items-center gap-2 ${showPlanHeader ? '' : 'flex-wrap sm:flex-nowrap'}`}>
          {!showPlanHeader ? (
            <button
              className={`${WORKSPACE_GHOST_BTN_CLASS} shrink-0 whitespace-nowrap text-[11px]`}
              onClick={() => setFullscreenOpen(true)}
              type="button"
            >
              View all
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor="plan-task-search">
              Search tasks
            </label>
            <input
              className={`w-full ${WORKSPACE_FIELD_CLASS} text-xs`}
              id="plan-task-search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              type="search"
              value={search}
            />
          </div>
        </div>
      </div>

      <div className="scrollbar-workspace-subtle min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {saveNote ? <p className="mb-2 text-xs text-red-400">{saveNote}</p> : null}
        {syncNote ? <p className="mb-2 text-xs text-red-400">{syncNote}</p> : null}
        <ul className="space-y-5">
          {grouped.map(({ epic, epicIndex, rows }) => (
            <li key={`epic-${epicIndex}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {epic.name}
              </p>
              {epic.description ? (
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{epic.description}</p>
              ) : null}
              <ul className="mt-2 space-y-2 border-l border-white/10 pl-3">
                {rows.map((row) => {
                  const isEditing =
                    editing?.epicIndex === row.epicIndex && editing?.taskIndex === row.taskIndex;
                  return (
                    <li
                      id={`task-${row.epicIndex}-${row.taskIndex}`}
                      key={`${row.epicIndex}-${row.taskIndex}`}
                    >
                      <PlanTaskRowCard
                        draftDescription={draftDescription}
                        draftTitle={draftTitle}
                        isEditing={isEditing}
                        onBeginEdit={() => beginEdit(row)}
                        onCancelEdit={cancelEdit}
                        onDraftDescriptionChange={setDraftDescription}
                        onDraftTitleChange={setDraftTitle}
                        onSaveEdit={saveEdit}
                        onToggleSync={() => toggleRowBitrixSync(row)}
                        pending={pending}
                        row={row}
                        taskHref={taskHrefFor(row)}
                        variant="list"
                      />
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
        {grouped.length === 0 ? (
          <p className="py-4 text-center text-xs text-slate-500">No tasks match your search.</p>
        ) : null}
      </div>

      <PlanTasksFullscreenModal
        draftDescription={draftDescription}
        draftTitle={draftTitle}
        editing={editing}
        onBeginEdit={beginEdit}
        onCancelEdit={cancelEdit}
        onClose={() => setFullscreenOpen(false)}
        onDraftDescriptionChange={setDraftDescription}
        onDraftTitleChange={setDraftTitle}
        onSaveEdit={saveEdit}
        onSearchChange={setSearch}
        onToggleSync={toggleRowBitrixSync}
        open={fullscreenOpen}
        pending={pending}
        phaseId={phaseId}
        plan={plan}
        projectSlug={projectSlug}
        saveNote={saveNote}
        search={search}
        syncNote={syncNote}
      />
    </div>
  );
}

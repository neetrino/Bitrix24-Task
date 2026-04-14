'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  DECOMPOSITION_LEVEL_DESCRIPTIONS,
  type PlanPayload,
} from '@/shared/domain/plan';
import { savePlanSnapshot } from '@/features/plan-editor/plan-actions';
import {
  buildFlatPlanTasks,
  filterFlatPlanTasks,
  groupRowsByEpicOrder,
  updateTaskInPlan,
  type FlatPlanTaskRow,
} from '@/features/projects/plan-tasks-iterate';
import { PlanTasksFullscreenModal } from '@/features/projects/PlanTasksFullscreenModal';
import { SparklesGlyph } from '@/shared/ui/brand-icons';
import {
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_GHOST_BTN_CLASS,
  WORKSPACE_PANEL_CLASS,
} from '@/shared/ui/workspace-ui';

function SizeBadge({ size }: { size: FlatPlanTaskRow['task']['size'] }) {
  if (!size) return null;
  return (
    <span
      className="shrink-0 rounded border border-white/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400"
      title={
        size === 'small'
          ? 'Small — sub-step / short task'
          : size === 'medium'
            ? 'Medium — feature-sized'
            : 'Large — milestone or major work'
      }
    >
      {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
    </span>
  );
}

type EditingTarget = { epicIndex: number; taskIndex: number };

export function PlanTasksPanelClient({
  initialPlan,
  projectId,
  phaseId,
}: {
  initialPlan: PlanPayload;
  projectId: string;
  phaseId: string | null;
}) {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanPayload>(initialPlan);
  const [search, setSearch] = useState('');
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [editing, setEditing] = useState<EditingTarget | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

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

  return (
    <div className={`flex h-full min-h-0 flex-col ${WORKSPACE_PANEL_CLASS}`}>
      <div className="border-b border-white/10 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 px-3 py-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
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

      <div className="shrink-0 border-b border-white/10 px-3 py-2">
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

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {saveNote ? <p className="mb-2 text-xs text-red-400">{saveNote}</p> : null}
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
                    <li key={`${row.epicIndex}-${row.taskIndex}`}>
                      {isEditing ? (
                        <div className="space-y-2 rounded-lg border border-violet-500/25 bg-slate-950/50 p-2">
                          <input
                            className={`w-full ${WORKSPACE_FIELD_CLASS} text-xs`}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            value={draftTitle}
                          />
                          <textarea
                            className={`min-h-[72px] w-full resize-y ${WORKSPACE_FIELD_CLASS} text-xs`}
                            onChange={(e) => setDraftDescription(e.target.value)}
                            placeholder="Description (optional)"
                            value={draftDescription}
                          />
                          <div className="flex flex-wrap gap-2">
                            <button
                              className={WORKSPACE_GHOST_BTN_CLASS}
                              disabled={pending}
                              onClick={cancelEdit}
                              type="button"
                            >
                              Cancel
                            </button>
                            <button
                              className={WORKSPACE_GHOST_BTN_CLASS}
                              disabled={pending}
                              onClick={saveEdit}
                              type="button"
                            >
                              {pending ? 'Saving…' : 'Save'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="flex min-w-0 flex-1 flex-wrap items-baseline gap-2 text-sm text-slate-200">
                              <span className="shrink-0 font-mono text-[10px] font-medium text-slate-500">
                                #{row.displayNumber}
                              </span>
                              <SizeBadge size={row.task.size} />
                              <span className="min-w-0">{row.task.title}</span>
                            </p>
                            <button
                              className="shrink-0 rounded border border-white/12 px-2 py-0.5 text-[10px] font-medium text-slate-400 transition hover:border-white/20 hover:text-slate-200"
                              onClick={() => beginEdit(row)}
                              type="button"
                            >
                              Edit
                            </button>
                          </div>
                          {row.task.description ? (
                            <p className="mt-0.5 text-xs leading-snug text-slate-500">
                              {row.task.description}
                            </p>
                          ) : null}
                        </>
                      )}
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
        onClose={() => setFullscreenOpen(false)}
        open={fullscreenOpen}
        plan={plan}
      />
    </div>
  );
}

'use client';

import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { PlanPayload } from '@/shared/domain/plan';
import { buildFlatPlanTasks, type FlatPlanTaskRow } from '@/features/projects/plan-tasks-iterate';

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

function TaskGridCard({ row }: { row: FlatPlanTaskRow }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 shadow-sm">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="shrink-0 font-mono text-[10px] font-medium text-slate-500">#{row.displayNumber}</span>
        <SizeBadge size={row.task.size} />
        <span className="min-w-0 flex-1 text-sm leading-snug text-slate-100">{row.task.title}</span>
      </div>
      {row.task.description ? (
        <p className="mt-2 text-xs leading-snug text-slate-400">{row.task.description}</p>
      ) : null}
      <p className="mt-2 truncate text-[10px] uppercase tracking-wide text-slate-600">{row.epicName}</p>
    </div>
  );
}

export function PlanTasksFullscreenModal({
  open,
  onClose,
  plan,
  title = 'All tasks',
}: {
  open: boolean;
  onClose: () => void;
  plan: PlanPayload;
  title?: string;
}) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const rows = useMemo(() => buildFlatPlanTasks(plan), [plan]);

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
      className="fixed inset-0 z-[100] flex items-stretch justify-center p-3 sm:p-4"
      role="dialog"
    >
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />
      <div className="relative z-[101] flex h-[min(100dvh,100vh)] w-full max-w-[100vw] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/60 ring-1 ring-white/5 backdrop-blur-xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-white" id={titleId}>
              {title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">{rows.length} tasks</p>
          </div>
          <button
            className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {rows.map((row) => (
              <TaskGridCard key={`${row.epicIndex}-${row.taskIndex}`} row={row} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

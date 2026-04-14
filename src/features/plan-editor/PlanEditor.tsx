'use client';

import { useMemo, useState, useTransition } from 'react';
import type { PlanPayload } from '@/shared/domain/plan';
import { savePlanSnapshot } from '@/features/plan-editor/plan-actions';

export function PlanEditor({
  projectId,
  phaseId,
  initialPlan,
}: {
  projectId: string;
  phaseId: string | null;
  initialPlan: PlanPayload;
}) {
  const [json, setJson] = useState(() => JSON.stringify(initialPlan, null, 2));
  const [note, setNote] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const validPreview = useMemo(() => {
    try {
      return JSON.parse(json) as unknown;
    } catch {
      return null;
    }
  }, [json]);

  function onSave() {
    setNote(null);
    start(async () => {
      const res = await savePlanSnapshot(projectId, phaseId, json);
      if (res && 'error' in res && res.error) {
        setNote(res.error);
        return;
      }
      setNote('Saved.');
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Plan</h2>
        <button
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50 disabled:opacity-60"
          disabled={pending}
          onClick={onSave}
          type="button"
        >
          {pending ? 'Saving…' : 'Save plan'}
        </button>
      </div>
      <p className="text-sm text-slate-600">
        Edit the structured JSON (validated on save). AI chat updates this automatically.
      </p>
      <textarea
        className="min-h-[220px] w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
        onChange={(e) => setJson(e.target.value)}
        spellCheck={false}
        value={json}
      />
      {note ? <p className="text-sm text-slate-700">{note}</p> : null}
      {validPreview ? (
        <p className="text-xs text-slate-500">JSON parses locally. Server validates schema on save.</p>
      ) : (
        <p className="text-xs text-red-600">Invalid JSON — fix before saving.</p>
      )}
    </div>
  );
}

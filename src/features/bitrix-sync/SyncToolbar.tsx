'use client';

import { useState, useTransition } from 'react';
import { syncProjectToBitrix } from '@/features/bitrix-sync/sync-actions';

export function SyncToolbar({
  projectId,
  phaseId,
}: {
  projectId: string;
  phaseId: string | null;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function run(dryRun: boolean) {
    setMessage(null);
    setError(null);
    start(async () => {
      const res = await syncProjectToBitrix(projectId, phaseId, dryRun);
      if ('error' in res) {
        setError(res.error);
        return;
      }
      setMessage(res.message);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50 disabled:opacity-60"
          disabled={pending}
          onClick={() => run(true)}
          type="button"
        >
          Dry-run sync
        </button>
        <button
          className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          disabled={pending}
          onClick={() => run(false)}
          type="button"
        >
          {pending ? 'Syncing…' : 'Sync to Bitrix'}
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-800">{message}</p> : null}
    </div>
  );
}

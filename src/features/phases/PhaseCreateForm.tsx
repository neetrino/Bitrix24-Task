'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createPhase } from '@/features/phases/phase-actions';
import {
  WORKSPACE_ACCENT_BTN_CLASS,
  WORKSPACE_FIELD_CLASS,
  WORKSPACE_LABEL_CLASS,
} from '@/shared/ui/workspace-ui';

function SubmitPhase() {
  const { pending } = useFormStatus();
  return (
    <button className={WORKSPACE_ACCENT_BTN_CLASS} disabled={pending} type="submit">
      {pending ? 'Adding…' : 'Add phase'}
    </button>
  );
}

export function PhaseCreateForm({ projectId }: { projectId: string }) {
  const [state, action] = useActionState(createPhase.bind(null, projectId), undefined);
  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <label className={`flex flex-col gap-1 ${WORKSPACE_LABEL_CLASS}`} htmlFor="label">
        New phase
        <input
          className={WORKSPACE_FIELD_CLASS}
          id="label"
          name="label"
          placeholder="Iteration"
          required
          type="text"
        />
      </label>
      <SubmitPhase />
      {state?.error ? <p className="w-full text-sm text-red-400">{state.error}</p> : null}
    </form>
  );
}
